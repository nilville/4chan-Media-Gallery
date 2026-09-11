import { Readable } from 'stream';

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.query?.url || '';
  let filename = req.query?.filename || '';

  if (!rawUrl) {
    return res.status(400).json({ error: 'Missing download URL' });
  }

  // Strict SSRF and URL validation
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const allowedHosts = ['i.4cdn.org', 'is2.4chan.org'];
  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !allowedHosts.includes(parsedUrl.hostname)) {
    return res.status(400).json({ error: 'Invalid or unsupported download host' });
  }

  if (!filename) {
    filename = parsedUrl.pathname.split('/').pop() || 'download';
  }
  filename = filename.replace(/[^\w.\-_]/g, '_').trim();
  if (!filename) {
    filename = 'download';
  }

  try {
    const upstream = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 4chan-Gallery/2.0'
      }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Failed to fetch media from CDN: status ${upstream.status}` });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const contentLength = upstream.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Stream directly to response without buffering full payload in memory
    if (upstream.body) {
      return Readable.fromWeb(upstream.body).pipe(res);
    }

    return res.status(200).end();
  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
