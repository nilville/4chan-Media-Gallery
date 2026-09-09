import React from 'react';

export function BoardHeader() {
  return (
    <header className="board-header">
      <div className="board-banner-clover">
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C13 3 11 5 11 8C11 10 12 11 13 12C10 11 7 13 6 16C5 19 7 22 10 22C12 22 14 21 15 19C14 21 15 24 17 25C20 26 23 24 23 21C23 19 22 17 20 16C23 16 25 14 25 11C25 8 22 6 19 6C18 6 17 6 16 7Z" fill="#5A8830"/>
          <path d="M16 16C15 19 13 23 10 26C9 27 10 28 11 28C14 26 16 22 17 19Z" fill="#345A1A"/>
        </svg>
      </div>
      <h1 className="board-title">/gallery/ - 4chan Media Viewer</h1>
      <p className="board-subtitle">
        Enter any 4chan thread URL to extract and browse all images, WebMs, and videos.
      </p>
      <hr className="divider-line" />
    </header>
  );
}
