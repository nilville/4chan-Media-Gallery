import os
import re
import requests
from flask import Flask, jsonify, request, send_from_directory, render_template

# Initialize Flask app
# Static folder points to frontend dist directory for production builds
app = Flask(
    __name__,
    static_folder=os.path.join("frontend", "dist"),
    template_folder="templates"
)

def parse_thread_input(raw_input: str):
    """
    Extracts and validates board_name and thread_id strictly to prevent SSRF
    and invalid requests.
    Accepts:
      - Full URLs: https://boards.4chan.org/[board]/thread/[id]
      - 4channel URLs: https://boards.4channel.org/[board]/thread/[id]
      - Shorthand syntax: /[board]/[id] or [board]/[id]
    """
    if not raw_input or not isinstance(raw_input, str):
        return None, None

    cleaned = raw_input.strip()
    
    # Regex to capture board and thread_id
    # Format 1: URL with /thread/
    match = re.search(r"(?:boards\.(?:4chan|4channel)\.org)?\/?([a-zA-Z0-9_]+)\/thread\/([0-9]+)", cleaned)
    if match:
        return match.group(1).lower(), match.group(2)
        
    # Format 2: Shorthand like /board/thread_id
    match_short = re.search(r"^\/?([a-zA-Z0-9_]{1,10})\/([0-9]{1,15})(?:\/.*)?$", cleaned)
    if match_short:
        return match_short.group(1).lower(), match_short.group(2)
        
    return None, None


def fetch_4chan_thread(board: str, thread_id: str):
    """
    Safely queries official 4chan JSON API with strict parameter construction.
    """
    # Whitelist safety check: alphanumeric board name, numeric thread ID
    if not re.match(r"^[a-zA-Z0-9_]{1,10}$", board) or not re.match(r"^[0-9]{1,15}$", thread_id):
        return {"error": "Invalid board or thread format.", "code": 400}

    api_url = f"https://a.4cdn.org/{board}/thread/{thread_id}.json"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) 4chan-Gallery/2.0"
    }

    try:
        response = requests.get(api_url, headers=headers, timeout=10)
        if response.status_code == 404:
            return {"error": f"Thread #{thread_id} on /{board}/ was not found or has expired (404).", "code": 404}
        if response.status_code != 200:
            return {"error": f"Failed to fetch thread (Status {response.status_code}).", "code": response.status_code}
        
        data = response.json()
        posts = data.get("posts", [])
        if not posts:
            return {"error": "Thread contains no posts.", "code": 404}

        op_post = posts[0]
        subject = op_post.get("sub", "")
        op_comment = op_post.get("com", "")
        total_replies = op_post.get("replies", len(posts) - 1)
        total_images = op_post.get("images", 0)

        media_items = []
        for post in posts:
            if "tim" in post and "ext" in post:
                ext = post["ext"].lower()
                is_video = ext in [".webm", ".mp4"]
                tim = post["tim"]
                media_items.append({
                    "no": post.get("no"),
                    "tim": tim,
                    "ext": ext,
                    "filename": post.get("filename", "file"),
                    "w": post.get("w", 0),
                    "h": post.get("h", 0),
                    "tn_w": post.get("tn_w", 0),
                    "tn_h": post.get("tn_h", 0),
                    "fsize": post.get("fsize", 0),
                    "is_video": is_video,
                    "url": f"https://i.4cdn.org/{board}/{tim}{ext}",
                    "thumb": f"https://i.4cdn.org/{board}/{tim}s.jpg",
                    "now": post.get("now", ""),
                    "name": post.get("name", "Anonymous"),
                    "resto": post.get("resto", 0),
                    "com": post.get("com", "")
                })

        return {
            "success": True,
            "board": board,
            "thread_id": thread_id,
            "subject": subject,
            "op_comment": op_comment,
            "op_name": op_post.get("name", "Anonymous"),
            "op_now": op_post.get("now", ""),
            "total_replies": total_replies,
            "total_images": total_images,
            "media_count": len(media_items),
            "media": media_items
        }

    except requests.exceptions.Timeout:
        return {"error": "Request timed out while connecting to 4chan API.", "code": 504}
    except requests.exceptions.RequestException as e:
        return {"error": f"Network error: {str(e)}", "code": 502}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}", "code": 500}


@app.after_request
def add_security_headers(response):
    """
    Attach security headers & referrer policy to allow hotlinking 4chan CDN media
    without 403 Forbidden errors.
    """
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    # Allow local dev server CORS
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/api/thread", methods=["GET", "POST", "OPTIONS"])
def api_thread():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    url_input = ""
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        url_input = data.get("url", "")
    else:
        url_input = request.args.get("url", "")

    if not url_input:
        return jsonify({
            "success": False,
            "error": "Please enter a 4chan thread URL."
        }), 400

    board, thread_id = parse_thread_input(url_input)
    if not board or not thread_id:
        return jsonify({
            "success": False,
            "error": "Invalid thread URL. Expected format: https://boards.4chan.org/[board]/thread/[id]"
        }), 400

    result = fetch_4chan_thread(board, thread_id)
    if "error" in result:
        return jsonify({
            "success": False,
            "error": result["error"]
        }), result.get("code", 400)

    return jsonify(result)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    dist_dir = os.path.join(app.root_path, "frontend", "dist")
    if os.path.exists(dist_dir) and path != "":
        file_path = os.path.join(dist_dir, path)
        if os.path.exists(file_path):
            return send_from_directory(dist_dir, path)
    
    # If dist index.html exists, serve it
    if os.path.exists(os.path.join(dist_dir, "index.html")):
        return send_from_directory(dist_dir, "index.html")

    # Fallback to template if frontend is not yet built
    return render_template("index.html", media_list=[])


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
