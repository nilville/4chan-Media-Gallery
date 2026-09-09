import React from 'react';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function GalleryCard({ item, onClick, isCompact = false }) {
  const {
    tim,
    ext,
    filename,
    fsize,
    w,
    h,
    is_video,
    url,
    thumb,
    no,
    now
  } = item;

  const displayFilename = filename ? `${filename}${ext}` : `${tim}${ext}`;
  const sizeText = formatBytes(fsize);
  const dimensionText = w && h ? `${w}x${h}` : '';

  return (
    <div className={`chan-card ${isCompact ? 'compact' : ''}`}>
      {!isCompact && (
        <div className="chan-file-info" title={`${displayFilename} (${sizeText}, ${dimensionText})`}>
          File:{' '}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {displayFilename}
          </a>
          <br />
          <span>({sizeText}{dimensionText ? `, ${dimensionText}` : ''})</span>
        </div>
      )}

      <div
        className="chan-thumb-wrapper"
        onClick={() => onClick(item)}
        role="button"
        tabIndex={0}
        title={`Click to preview ${displayFilename}`}
      >
        <img
          src={thumb}
          alt={displayFilename}
          className="chan-thumb-img"
          loading="lazy"
          onError={(e) => {
            // Fallback to full URL if thumb is not yet generated or 404
            if (e.target.src !== url) {
              e.target.src = url;
            }
          }}
        />

        {is_video && (
          <>
            <span className="chan-media-badge">{ext.replace('.', '')}</span>
            <div className="chan-play-icon-overlay" />
          </>
        )}
      </div>

      {!isCompact && (
        <div className="chan-card-footer">
          <span>No. {no}</span>
          <div className="chan-card-actions">
            <a
              href={url}
              download={displayFilename}
              className="chan-card-action-link"
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
            >
              [Save]
            </a>
            <a
              href={url}
              className="chan-card-action-link"
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
            >
              [Direct]
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
