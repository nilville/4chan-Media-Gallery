import React, { useState } from 'react';
import { downloadMediaFile } from '../utils/download';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function GalleryCard({ item, onClick, isCompact = false }) {
  const [isSaving, setIsSaving] = useState(false);
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
    no
  } = item;

  const displayFilename = filename ? `${filename}${ext}` : `${tim}${ext}`;
  const sizeText = formatBytes(fsize);
  const dimensionText = w && h ? `${w}x${h}` : '';

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await downloadMediaFile(url, displayFilename);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

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
            <button
              type="button"
              className="chan-card-action-link"
              onClick={handleSave}
              disabled={isSaving}
              title={`Download ${displayFilename} directly`}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                cursor: isSaving ? 'wait' : 'pointer'
              }}
            >
              {isSaving ? '[Saving...]' : '[Save]'}
            </button>
            <a
              href={url}
              className="chan-card-action-link"
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noreferrer"
              title="Open direct file link in new tab"
            >
              [Direct]
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
