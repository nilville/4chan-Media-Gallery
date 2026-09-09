import React from 'react';

/**
 * Safely parse 4chan comments / greentext without dangerouslySetInnerHTML.
 * Converts HTML entities, handles <br>, and adds greentext styling for lines starting with '>'.
 */
function renderComment(rawHtml) {
  if (!rawHtml) return null;

  // Replace <br> / <br/> with newline
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

export function ThreadInfo({ threadData }) {
  if (!threadData || !threadData.success) return null;

  const {
    board,
    thread_id,
    subject,
    op_name,
    op_now,
    op_comment,
    media_count,
    total_replies
  } = threadData;

  const chanUrl = `https://boards.4chan.org/${board}/thread/${thread_id}`;

  return (
    <div className="thread-info-card">
      <div className="op-container">
        <div className="op-header">
          {subject && <span className="op-subject">{subject}</span>}
          <span className="op-name">{op_name || 'Anonymous'}</span>
          <span className="op-date">{op_now}</span>
          <span className="op-number">
            No. <a href={chanUrl} target="_blank" rel="noreferrer">{thread_id}</a>
          </span>
          <span>
            [ <a href={chanUrl} target="_blank" rel="noreferrer">Original Thread</a> ]
          </span>
          <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#800000' }}>
            /{board}/ &bull; {media_count} Files &bull; {total_replies} Replies
          </span>
        </div>

        {op_comment && (
          <div className="op-comment">
            {renderComment(op_comment)}
          </div>
        )}
      </div>
    </div>
  );
}
