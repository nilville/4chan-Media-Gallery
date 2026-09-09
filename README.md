# 🍀 4chan Media Gallery

A fast, responsive, and aesthetic media gallery & thread viewer for **4chan** and **4channel**. Built with a **Python Flask** backend and a **React 19 + Vite** frontend styled in authentic Yotsuba aesthetic.

---

## ✨ Features

- **🚀 Flexible Input Parsing**:
  - Full URLs: `https://boards.4chan.org/g/thread/10000000` or `https://boards.4channel.org/w/thread/123456`
  - Shorthand syntax: `/g/10000000` or `g/10000000`
- **🖼️ Rich Gallery Views**:
  - **Grid View**: Clean card grid featuring thumbnails, resolution badges, file sizes, and post comments.
  - **Compact View**: Dense thumbnail gallery for quick scanning of large image threads.
  - **Post Stream**: Traditional forum stream layout displaying inline media with full comment text.
- **🔍 Filtering & Sorting**:
  - Filter by media type: *All Media*, *Images Only* (JPG, PNG, GIF), or *Videos Only* (WebM, MP4).
  - Sort by: *Default (Thread Order)*, *Newest*, *File Size (Desc/Asc)*, or *Resolution (Desc)*.
- **🎥 Built-in Lightbox & WebM Player**:
  - High-definition media preview with seamless keyboard navigation (`←` / `→` arrows, `Esc` to close).
  - Native video controls with loop toggle for WebM clips.
  - Media counter, direct download button, and post metadata overlay.
- **🛡️ Secure & Reliable**:
  - Automatic `Referrer-Policy: no-referrer` header handling to prevent CDN 403 Forbidden errors when loading images from `i.4cdn.org`.
  - Backend whitelist validation and SSRF protection.
- **🎨 Authentic Yotsuba Aesthetics**:
  - Faithful retro 4chan styling, typography, greentext quote highlighting, and custom responsive controls.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.8+, [Flask](https://flask.palletsprojects.com/), [Requests](https://requests.readthedocs.io/)
- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Lucide React](https://lucide.dev/) (Icons)
- **Styling**: Vanilla CSS (Custom Yotsuba Design System)

---

## 📁 Project Structure

```text
4chan_gallerie/
├── app.py                  # Flask API server & static file host
├── templates/              # Fallback HTML templates
│   └── index.html
├── frontend/               # React Vite Single Page App
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardHeader.jsx       # Board header & banner
│   │   │   ├── BoardNav.jsx          # Top & bottom board navigation
│   │   │   ├── GalleryCard.jsx       # Individual media thumbnail card
│   │   │   ├── GalleryControls.jsx   # Filter, sort, and view mode toolbar
│   │   │   ├── Lightbox.jsx          # Fullscreen media viewer & video player
│   │   │   ├── PostStream.jsx        # Stream view component
│   │   │   ├── ThreadForm.jsx        # Thread URL input form
│   │   │   └── ThreadInfo.jsx        # Thread OP subject & post stats
│   │   ├── App.jsx                   # Main application state & layout
│   │   ├── index.css                 # 4chan Yotsuba theme styles
│   │   └── main.jsx                  # React entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.8 or newer
- **Node.js**: 18.x or newer
- **npm** or **pnpm** / **yarn**

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/4chan_gallerie.git
   cd 4chan_gallerie
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 💻 Running the App

### Option A: Development Mode (Recommended)

Run the Flask backend API and the Vite frontend dev server with hot reload:

1. **Start the Flask Backend** (Terminal 1):
   ```bash
   python app.py
   ```
   *Runs on `http://127.0.0.1:5000`*

2. **Start the Vite Dev Server** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   *Runs on `http://localhost:5173` (with `/api` automatically proxied to Flask on port 5000).*

---

### Option B: Production / Single-Server Mode

Build the React frontend into static assets and serve everything directly from Flask:

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Start the Flask Application**:
   ```bash
   python app.py
   ```
   *Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.*

---

## 🔌 API Reference

### `GET /api/thread` or `POST /api/thread`

Fetches and normalizes all media items and metadata for a specified 4chan thread.

#### Query Parameter / JSON Body:
| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Full 4chan URL (`https://boards.4chan.org/[board]/thread/[id]`) or shorthand (`/[board]/[id]`) |

#### Example Response:
```json
{
  "success": true,
  "board": "w",
  "thread_id": "2498421",
  "subject": "Wallpapers General",
  "op_name": "Anonymous",
  "op_now": "03/10/26(Tue)00:00:00",
  "op_comment": "Post your high-res wallpapers.",
  "total_replies": 42,
  "total_images": 28,
  "media_count": 28,
  "media": [
    {
      "no": 2498421,
      "tim": 1741561234567,
      "ext": ".jpg",
      "filename": "sunset_mountain",
      "w": 3840,
      "h": 2160,
      "fsize": 4256789,
      "is_video": false,
      "url": "https://i.4cdn.org/w/1741561234567.jpg",
      "thumb": "https://i.4cdn.org/w/1741561234567s.jpg",
      "name": "Anonymous",
      "now": "03/10/26(Tue)00:00:00",
      "com": "First wallpaper of the thread"
    }
  ]
}
```

---

## ⌨️ Keyboard Shortcuts (Lightbox)

| Key | Action |
|---|---|
| `←` / `Left Arrow` | View previous media item |
| `→` / `Right Arrow` | View next media item |
| `Esc` | Close lightbox |

---

## 📄 License & Disclaimer

This project is for educational and personal use. All images and board contents are retrieved from the official 4chan Read-Only JSON API and remain the property of their respective creators.
