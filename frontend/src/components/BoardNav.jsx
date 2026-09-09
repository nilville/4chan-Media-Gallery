import React from 'react';

const BOARDS = [
  { group: 'Japanese Culture', boards: ['a', 'c', 'w', 'm', 'cgl', 'cm', 'f', 'n', 'jp', 'vt'] },
  { group: 'Video Games', boards: ['v', 'vg', 'vm', 'vmg', 'vp', 'vr', 'vrpg', 'vst'] },
  { group: 'Interests', boards: ['g', 'tv', 'k', 'o', 'an', 'tg', 'sp', 'xs', 'pw', 'sci', 'his', 'int', 'out', 'toy', 'po', 'p', 'ck', 'lit', 'mu', 'fa', '3', 'gd', 'diy', 'wsg', 'qst', 'biz', 'trv', 'fit', 'x', 'adv', 'lgbt', 'mlp', 'news', 'wsr', 'vip'] },
  { group: 'Creative', boards: ['w', 'wg', 'i', 'ic', 'r', 'r9k', 's4s', 'cm', 'hm', 'y', 'u'] },
  { group: 'Other', boards: ['b', 'r9k', 'pol', 'bant', 'soc', 's', 'hc', 'hm', 'h', 'e', 'u', 'd', 'y', 't', 'hr', 'gif', 'aco'] }
];

export function BoardNav({ isBottom = false, onSelectBoard }) {
  return (
    <div className={`board-nav-bar ${isBottom ? 'bottom' : ''}`}>
      <span className="nav-section">
        [ <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a> / <a href="https://www.4chan.org" target="_blank" rel="noreferrer">4chan.org</a> ]
      </span>
      <span className="nav-section">
        [
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'gif', 'h', 'hr', 'k', 'm', 'o', 'p', 'r', 's', 't', 'u', 'v', 'vg', 'vr', 'w', 'wg', 'wsg', 'x', 'pol', 'sci', 'biz', 'tv', 'mu', 'fit'].map((b, idx, arr) => (
          <React.Fragment key={b}>
            <a 
              href={`https://boards.4chan.org/${b}/catalog`} 
              target="_blank" 
              rel="noreferrer"
              title={`Visit /${b}/ catalog on 4chan`}
            >
              {b}
            </a>
            {idx < arr.length - 1 ? ' / ' : ''}
          </React.Fragment>
        ))}
        ]
      </span>
      <span className="nav-section">
        [ <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Top</a> / <a href="#bottom" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>Bottom</a> ]
      </span>
    </div>
  );
}
