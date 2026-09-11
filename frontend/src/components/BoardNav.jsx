import React, { Fragment } from 'react';

export function BoardNav({ isBottom = false }) {
  return (
    <div className={`board-nav-bar ${isBottom ? 'bottom' : ''}`}>
      <span className="nav-section">
        [ <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a> / <a href="https://www.4chan.org" target="_blank" rel="noreferrer">4chan.org</a> ]
      </span>
      <span className="nav-section">
        [
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'gif', 'h', 'hr', 'k', 'm', 'o', 'p', 'r', 's', 't', 'u', 'v', 'vg', 'vr', 'w', 'wg', 'wsg', 'x', 'pol', 'sci', 'biz', 'tv', 'mu', 'fit'].map((b, idx, arr) => (
          <Fragment key={b}>
            <a 
              href={`https://boards.4chan.org/${b}/catalog`} 
              target="_blank" 
              rel="noreferrer"
              title={`Visit /${b}/ catalog on 4chan`}
            >
              {b}
            </a>
            {idx < arr.length - 1 ? ' / ' : ''}
          </Fragment>
        ))}
        ]
      </span>
      <span className="nav-section">
        [ <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Top</a> / <a href="#bottom" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>Bottom</a> ]
      </span>
      {isBottom && (
        <span style={{ fontSize: '10px', color: '#888', marginLeft: '8px' }}>
          v1.0.1
        </span>
      )}
    </div>
  );
}
