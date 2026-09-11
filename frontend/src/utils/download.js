/**
 * Helper to download media directly to the user's computer.
 * Proxies the file through /api/download to bypass cross-origin browser download restrictions
 * and set Content-Disposition: attachment.
 */
export async function downloadMediaFile(url, filename) {
  if (!url) return;

  const resolvedFilename = filename || url.split('/').pop() || 'download';
  const downloadApiUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(resolvedFilename)}`;

  try {
    const res = await fetch(downloadApiUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = resolvedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.warn('Direct blob download failed, falling back to direct navigation trigger:', err);
    // Fallback: direct anchor trigger to /api/download which has Content-Disposition: attachment
    const link = document.createElement('a');
    link.href = downloadApiUrl;
    link.download = resolvedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
