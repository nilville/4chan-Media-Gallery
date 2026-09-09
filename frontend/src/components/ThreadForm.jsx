import React, { useState } from 'react';

export function ThreadForm({ onSubmit, initialUrl = '', isLoading = false }) {
  const [url, setUrl] = useState(initialUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit} className="post-form-table">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <th>Thread URL</th>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    className="post-form-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://boards.4chan.org/board/thread/12345678 or /board/12345678"
                    disabled={isLoading}
                    autoFocus
                  />
                  {url && (
                    <button
                      type="button"
                      className="chan-button"
                      onClick={() => setUrl('')}
                      title="Clear URL"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <th>Action</th>
              <td>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="submit"
                    className="chan-button primary"
                    disabled={isLoading || !url.trim()}
                  >
                    {isLoading ? 'Fetching Thread...' : 'Extract Media Gallery'}
                  </button>
                  <span style={{ fontSize: '11px', color: '#707070' }}>
                    Supports 4chan.org and 4channel.org thread links
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

