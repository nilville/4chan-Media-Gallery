export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ status: 'ok' });
  }

  let urlInput = '';
  if (req.method === 'POST') {
    urlInput = req.body?.url || '';
  } else {
    urlInput = req.query?.url || '';
  }

  if (!urlInput) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a 4chan thread URL.'
    });
  }

  // Parse input
  const cleaned = String(urlInput).trim();
  let board = null;
  let threadId = null;

  // Format 1: URL with /thread/
  const match1 = cleaned.match(/(?:boards\.(?:4chan|4channel)\.org)?\/?([a-zA-Z0-9_]+)\/thread\/([0-9]+)/);
  if (match1) {
    board = match1[1].toLowerCase();
    threadId = match1[2];
  } else {
    // Format 2: Shorthand /board/thread_id
    const match2 = cleaned.match(/^\/?([a-zA-Z0-9_]{1,10})\/([0-9]{1,15})(?:\/.*)?$/);
    if (match2) {
      board = match2[1].toLowerCase();
      threadId = match2[2];
    }
  }

  if (!board || !threadId) {
    return res.status(400).json({
      success: false,
      error: 'Invalid thread URL. Expected format: https://boards.4chan.org/[board]/thread/[id]'
    });
  }

  const apiUrl = `https://a.4cdn.org/${board}/thread/${threadId}.json`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) 4chan-Gallery/2.0'
      }
    });

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        error: `Thread #${threadId} on /${board}/ was not found or has expired (404).`
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Failed to fetch thread from 4chan API (Status ${response.status}).`
      });
    }

    const data = await response.json();
    const posts = data.posts || [];
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Thread contains no posts.'
      });
    }

    const opPost = posts[0];
    const subject = opPost.sub || '';
    const opComment = opPost.com || '';
    const totalReplies = opPost.replies !== undefined ? opPost.replies : (posts.length - 1);
    const totalImages = opPost.images !== undefined ? opPost.images : 0;

    const media = [];
    for (const post of posts) {
      if (post.tim && post.ext) {
        const ext = post.ext.toLowerCase();
        const isVideo = ext === '.webm' || ext === '.mp4';
        const tim = post.tim;
        media.push({
          no: post.no,
          tim: tim,
          ext: ext,
          filename: post.filename || 'file',
          w: post.w || 0,
          h: post.h || 0,
          tn_w: post.tn_w || 0,
          tn_h: post.tn_h || 0,
          fsize: post.fsize || 0,
          is_video: isVideo,
          url: `https://i.4cdn.org/${board}/${tim}${ext}`,
          thumb: `https://i.4cdn.org/${board}/${tim}s.jpg`,
          now: post.now || '',
          name: post.name || 'Anonymous',
          resto: post.resto || 0,
          com: post.com || ''
        });
      }
    }

    return res.status(200).json({
      success: true,
      board: board,
      thread_id: threadId,
      subject: subject,
      op_comment: opComment,
      op_name: opPost.name || 'Anonymous',
      op_now: opPost.now || '',
      total_replies: totalReplies,
      total_images: totalImages,
      media_count: media.length,
      media: media
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Server error while fetching thread: ${err.message}`
    });
  }
}
