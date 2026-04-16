/**
 * In-memory sliding-window rate limiter.
 *
 * IMPORTANT: This Map-based store does NOT persist across serverless cold starts
 * on Vercel. Each new Lambda instance starts with an empty Map, so the effective
 * rate limit resets whenever the instance is recycled (typically after ~5-15 min
 * of inactivity). This means:
 *   - A determined attacker can bypass the limit by waiting for a cold start.
 *   - Under high traffic with multiple instances, each instance tracks its own
 *     counters independently, effectively multiplying the allowed request budget.
 *
 * For production hardening, consider:
 *   - Vercel WAF / Edge Middleware rate limiting (runs before function invocation)
 *   - Upstash Redis (@upstash/ratelimit) for shared, persistent counters
 *   - Cloudflare rate-limiting rules if fronted by CF
 *
 * Despite these caveats, this limiter still provides useful protection against
 * naive abuse (rapid-fire requests within a single warm instance).
 */
const store = new Map<string, number[]>();

const DEFAULT_MAX = process.env.NODE_ENV === 'production' ? 5 : 50;

/**
 * Checks whether the given IP address has exceeded the rate limit.
 *
 * @param ip - Client IP address. In Vercel deployments, extract from
 *   `request.headers.get('x-forwarded-for')` (first value) or
 *   `request.headers.get('x-real-ip')`. Note that X-Forwarded-For can be
 *   spoofed if not behind a trusted proxy; Vercel sets x-real-ip reliably.
 * @param maxRequests - Maximum allowed requests within the window (default: 5 prod, 50 dev).
 * @param windowMs - Sliding window duration in milliseconds (default: 10 minutes).
 * @returns `true` if the request is allowed, `false` if rate-limited.
 */
export function checkRateLimit(ip: string, maxRequests = DEFAULT_MAX, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = store.get(ip)?.filter(t => now - t < windowMs) ?? [];
  if (timestamps.length >= maxRequests) return false;
  timestamps.push(now);
  store.set(ip, timestamps);
  return true;
}
