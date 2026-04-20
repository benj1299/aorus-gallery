import { NextRequest, NextResponse } from 'next/server';

/**
 * Image proxy — fetches images from trusted remote sources and returns them
 * with CORS headers so the browser can draw them into a canvas.
 *
 * Needed because R2 (Cloudflare Workers) doesn't serve
 * Access-Control-Allow-Origin by default, which breaks canvas operations
 * (like crop/rotate in the admin ImageEditor) when the image lives on R2.
 *
 * Whitelist-only — any untrusted origin is rejected to avoid SSRF.
 */

const ALLOWED_HOSTS = [
  'images.unsplash.com',
  'res.cloudinary.com',
  'pub-982abfe009084d04879c7921a4cc6156.r2.dev',
  'r2.orusgallery.com',
];

function isHostAllowed(url: URL): boolean {
  return ALLOWED_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');
  if (!target) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (targetUrl.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only https targets allowed' }, { status: 400 });
  }
  if (!isHostAllowed(targetUrl)) {
    return NextResponse.json({ error: 'Host not whitelisted' }, { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), { cache: 'force-cache' });
    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: upstream.status });
    }
    const arrayBuffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') ?? 'image/*';
    return new NextResponse(arrayBuffer, {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=300',
        'access-control-allow-origin': '*',
      },
    });
  } catch (err) {
    console.error('[image-proxy] failed:', err);
    return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 });
  }
}
