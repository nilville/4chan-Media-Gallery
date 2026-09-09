import React, { useEffect, useRef, useState } from 'react';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  totalCount
}) {
  const videoRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      } else if (e.key === ' ' && item?.is_video && videoRef.current) {
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext, item]);

  if (!item) return null;

  const displayFilename = item.filename ? `${item.filename}${item.ext}` : `${item.tim}${item.ext}`;
  const sizeText = formatBytes(item.fsize);
  const dimensionText = item.w && item.h ? `${item.w}x${item.h}` : '';

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-window" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="lightbox-header">
          <div className="lightbox-title-text" title={displayFilename}>
            [{currentIndex + 1} / {totalCount}] {displayFilename}
            {dimensionText ? ` (${dimensionText}, ${sizeText})` : ` (${sizeText})`}
          </div>

          <div className="lightbox-controls">
            <a
              href={item.url}
              download={displayFilename}
              className="chan-button"
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
            <a
              href={item.url}
              className="chan-button"
              target="_blank"
              rel="noreferrer"
            >
              Direct Link
            </a>
            <button
              type="button"
              className="chan-button"
              onClick={onClose}
              title="Close (Esc)"
              style={{ fontWeight: 'bold' }}
            >
              [X]
            </button>
          </div>
        </div>

        {/* Media Container */}
        <div className="lightbox-body">
          {hasPrev && (
            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={onPrev}
              title="Previous (Left Arrow)"
            >
              ◀
            </button>
          )}

          {item.is_video ? (
            <video
              ref={videoRef}
              src={item.url}
              poster={item.thumb}
              autoPlay
              loop={isLooping}
              controls
              playsInline
              className="lightbox-media-video"
            />
          ) : (
            <img
              src={item.url}
              alt={displayFilename}
              className="lightbox-media-img"
            />
          )}

          {hasNext && (
            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={onNext}
              title="Next (Right Arrow)"
            >
              ▶
            </button>
          )}
        </div>

        {/* Footer Bar */}
        <div className="lightbox-footer">
          <div>
            <span>Post No. {item.no} &bull; {item.name || 'Anonymous'} &bull; {item.now}</span>
          </div>

          {item.is_video && (
            <div className="lightbox-video-bar">
              <span>Speed:</span>
              {[0.5, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`speed-btn ${playbackSpeed === s ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(s)}
                >
                  {s}x
                </button>
              ))}

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isLooping}
                  onChange={(e) => setIsLooping(e.target.checked)}
                />
                Loop
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
