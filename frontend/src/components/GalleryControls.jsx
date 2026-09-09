import React from 'react';

export function GalleryControls({
  media = [],
  filter,
  setFilter,
  sort,
  setSort,
  viewMode,
  setViewMode
}) {
  const imageCount = media.filter((m) => !m.is_video).length;
  const videoCount = media.filter((m) => m.is_video).length;

  return (
    <div className="gallery-controls-bar">
      {/* Filter by Media Type */}
      <div className="controls-group">
        <span className="controls-label">Filter:</span>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({media.length})
        </button>
        <button
          className={`filter-btn ${filter === 'images' ? 'active' : ''}`}
          onClick={() => setFilter('images')}
        >
          Images ({imageCount})
        </button>
        <button
          className={`filter-btn ${filter === 'videos' ? 'active' : ''}`}
          onClick={() => setFilter('videos')}
        >
          Videos / WebM ({videoCount})
        </button>
      </div>

      {/* Sort Options */}
      <div className="controls-group">
        <span className="controls-label">Sort:</span>
        <select
          className="select-dropdown"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Thread Order (Original)</option>
          <option value="newest">Newest First</option>
          <option value="size-desc">Size (Large to Small)</option>
          <option value="size-asc">Size (Small to Large)</option>
          <option value="res-desc">Resolution (High to Low)</option>
        </select>
      </div>

      {/* View Mode Toggle */}
      <div className="controls-group">
        <span className="controls-label">View:</span>
        <button
          className={`filter-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Grid view with post information"
        >
          Grid
        </button>
        <button
          className={`filter-btn ${viewMode === 'compact' ? 'active' : ''}`}
          onClick={() => setViewMode('compact')}
          title="Compact thumbnail tiles"
        >
          Compact
        </button>
        <button
          className={`filter-btn ${viewMode === 'stream' ? 'active' : ''}`}
          onClick={() => setViewMode('stream')}
          title="Full 4chan post stream view"
        >
          Stream
        </button>
      </div>
    </div>
  );
}
