import React, { useState, useEffect, useMemo } from 'react';
import { BoardNav } from './components/BoardNav';
import { BoardHeader } from './components/BoardHeader';
import { ThreadForm } from './components/ThreadForm';
import { ThreadInfo } from './components/ThreadInfo';
import { GalleryControls } from './components/GalleryControls';
import { GalleryCard } from './components/GalleryCard';
import { PostStream } from './components/PostStream';
import { Lightbox } from './components/Lightbox';

export default function App() {
  const [threadUrl, setThreadUrl] = useState(() => {
    // Check if URL search param exists e.g. ?url=...
    const params = new URLSearchParams(window.location.search);
    return params.get('url') || '';
  });

  const [threadData, setThreadData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gallery view controls
  const [filter, setFilter] = useState('all'); // 'all' | 'images' | 'videos'
  const [sort, setSort] = useState('default'); // 'default' | 'newest' | 'size-desc' | 'size-asc' | 'res-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact' | 'stream'

  // Lightbox selection
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Fetch thread function
  const fetchThread = async (urlToFetch) => {
    if (!urlToFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/thread?url=${encodeURIComponent(urlToFetch)}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to fetch thread. Please check the URL.');
        setThreadData(null);
      } else {
        setThreadData(data);
        setError(null);
        // Sync URL query without reloading
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('url', urlToFetch);
        window.history.replaceState({}, '', currentUrl);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to reach server. Make sure the backend service is running.');
      setThreadData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (threadUrl) {
      fetchThread(threadUrl);
    }
  }, []);

  const handleFormSubmit = (newUrl) => {
    setThreadUrl(newUrl);
    fetchThread(newUrl);
  };

  // Filtered and Sorted Media
  const displayedMedia = useMemo(() => {
    if (!threadData || !threadData.media) return [];

    let list = [...threadData.media];

    // Filter
    if (filter === 'images') {
      list = list.filter((item) => !item.is_video);
    } else if (filter === 'videos') {
      list = list.filter((item) => item.is_video);
    }

    // Sort
    if (sort === 'newest') {
      list.sort((a, b) => (b.tim || 0) - (a.tim || 0));
    } else if (sort === 'size-desc') {
      list.sort((a, b) => (b.fsize || 0) - (a.fsize || 0));
    } else if (sort === 'size-asc') {
      list.sort((a, b) => (a.fsize || 0) - (b.fsize || 0));
    } else if (sort === 'res-desc') {
      list.sort((a, b) => ((b.w || 0) * (b.h || 0)) - ((a.w || 0) * (a.h || 0)));
    }

    return list;
  }, [threadData, filter, sort]);

  // Lightbox handlers
  const handleOpenLightbox = (item) => {
    const idx = displayedMedia.findIndex((m) => m.tim === item.tim && m.no === item.no);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevMedia = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleNextMedia = () => {
    if (lightboxIndex !== null && lightboxIndex < displayedMedia.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const activeLightboxItem = lightboxIndex !== null ? displayedMedia[lightboxIndex] : null;

  return (
    <div>
      {/* Top Boards Bar */}
      <BoardNav />

      {/* Board Header */}
      <BoardHeader />

      {/* Thread Input Form (4chan Post Form Style) */}
      <ThreadForm
        initialUrl={threadUrl}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="chan-box-loading">
          Loading thread data from 4chan...
        </div>
      )}

      {/* Error Message Display */}
      {error && !isLoading && (
        <div className="chan-box-error">
          Error: {error}
        </div>
      )}

      {/* Thread OP Info */}
      {threadData && !isLoading && (
        <ThreadInfo threadData={threadData} />
      )}

      {/* Gallery Controls (Filter, Sort, View) */}
      {threadData && !isLoading && (
        <GalleryControls
          media={threadData.media || []}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      )}

      {/* Empty State */}
      {threadData && !isLoading && displayedMedia.length === 0 && (
        <div className="chan-box-error" style={{ backgroundColor: '#FFFFEE', borderColor: '#CCA', color: '#800000' }}>
          No media files found matching the current filter.
        </div>
      )}

      {/* Media Display: Grid / Compact */}
      {threadData && !isLoading && (viewMode === 'grid' || viewMode === 'compact') && (
        <div className={`gallery-grid ${viewMode === 'compact' ? 'compact' : ''}`}>
          {displayedMedia.map((item) => (
            <GalleryCard
              key={`${item.tim}_${item.no}`}
              item={item}
              onClick={handleOpenLightbox}
              isCompact={viewMode === 'compact'}
            />
          ))}
        </div>
      )}

      {/* Media Display: Post Stream */}
      {threadData && !isLoading && viewMode === 'stream' && (
        <PostStream
          media={displayedMedia}
          onMediaClick={handleOpenLightbox}
        />
      )}

      {/* Lightbox / Fullscreen WebM & Image Player */}
      {activeLightboxItem && (
        <Lightbox
          item={activeLightboxItem}
          onClose={handleCloseLightbox}
          onPrev={handlePrevMedia}
          onNext={handleNextMedia}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < displayedMedia.length - 1}
          currentIndex={lightboxIndex}
          totalCount={displayedMedia.length}
        />
      )}

      {/* Bottom Boards Bar */}
      <BoardNav isBottom />
    </div>
  );
}
