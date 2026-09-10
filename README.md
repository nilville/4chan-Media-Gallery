# 4chan Media Gallery

A lightweight thread viewer and media gallery for 4chan / 4channel, styled in the classic Yotsuba theme.

Paste any thread link (or shorthand like `/g/123456`) to pull all images and WebMs from the thread into a clean gallery.

## What it does

- **Multiple view modes** – Switch between a card grid with post snippets, a dense compact thumbnail layout, or a traditional post stream.
- **Filter & sort** – Quickly filter images vs. WebMs, or sort by thread order, newest, resolution, and file size.
- **Lightbox player** – Fullscreen viewer with arrow key navigation (`←` / `→`), WebM looping, quick download buttons, and post comments.
- **Flexible link input** – Accepts full 4chan/4channel URLs or quick shorthands (`/w/123456` or `w/123456`).
- **Referrer handling** – Automatically sets proper headers so 4cdn images load cleanly without 403 Forbidden errors.

## Tech

- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS
- **Backend**: Python (Flask)

## Disclaimer

Built for personal and educational use. All media and posts are fetched via [4chan's read-only JSON API](https://github.com/4chan/4chan-API) and belong to their respective creators.

