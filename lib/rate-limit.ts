const store = new Map<string, number[]>();

const DEFAULT_MAX = process.env.NODE_ENV === 'production' ? 5 : 50;

export function checkRateLimit(ip: string, maxRequests = DEFAULT_MAX, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = store.get(ip)?.filter(t => now - t < windowMs) ?? [];
  if (timestamps.length >= maxRequests) return false;
  timestamps.push(now);
  store.set(ip, timestamps);
  return true;
}
