import os
import sys
from flask import Flask, jsonify, request

# Ensure root directory is on Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import fetch_4chan_thread, parse_thread_input

app = Flask(__name__)


@app.after_request
def add_security_headers(response):
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "OPTIONS"])
@app.route("/<path:path>", methods=["GET", "POST", "OPTIONS"])
def handler(path=""):
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
