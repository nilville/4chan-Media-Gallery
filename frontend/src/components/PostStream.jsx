import React from 'react';

function renderPostComment(rawHtml) {
  if (!rawHtml) return null;
  const text = rawHtml
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<wbr>/gi, '')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  const lines = text.split('\n');

  return lines.map((line, idx) => {
    const isGreentext = line.startsWith('>') && !line.startsWith('>>');
    const isQuoteLink = line.startsWith('>>');

    return (
      <div 
        key={idx} 
        className={isGreentext ? 'greentext' : isQuoteLink ? 'quotelink' : ''}
      >
        {line}
      </div>
    );
  });
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function PostStream({ media, onMediaClick }) {
  return (
    <div className="post-stream-container">
      {media.map((item) => {
        const displayFilename = item.filename ? `${item.filename}${item.ext}` : `${item.tim}${item.ext}`;
        const sizeText = formatBytes(item.fsize);
        const dimensionText = item.w && item.h ? `${item.w}x${item.h}` : '';

        return (
          <div key={item.no || item.tim} className="stream-post-item">
            <div className="stream-post-header">
              <span className="op-name">{item.name || 'Anonymous'}</span>
              <span className="op-date">{item.now}</span>
              <span className="op-number">No. {item.no}</span>
              <div className="chan-file-info" style={{ margin: 0, display: 'inline-block' }}>
                File: <a href={item.url} target="_blank" rel="noreferrer">{displayFilename}</a> ({sizeText}, {dimensionText})
              </div>
            </div>

            <div className="stream-post-content">
              <div className="stream-post-media">
                <div
                  className="chan-thumb-wrapper"
                  style={{ width: '180px', height: '180px' }}
                  onClick={() => onMediaClick(item)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={item.thumb}
                    alt={displayFilename}
                    className="chan-thumb-img"
                    loading="lazy"
                  />
                  {item.is_video && (
                    <>
                      <span className="chan-media-badge">{item.ext.replace('.', '')}</span>
                      <div className="chan-play-icon-overlay" />
                    </>
                  )}
                </div>
              </div>

              {item.com && (
                <div className="stream-post-text">
                  {renderPostComment(item.com)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
