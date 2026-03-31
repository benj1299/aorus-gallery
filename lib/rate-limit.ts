const store = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = store.get(ip)?.filter(t => now - t < windowMs) ?? [];
  if (timestamps.length >= maxRequests) return false;
  timestamps.push(now);
  store.set(ip, timestamps);
  return true;
}
