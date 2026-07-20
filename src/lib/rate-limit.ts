export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitStore {
  increment(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<{ success: boolean; current: number; resetTime: number }>;
}

// In-memory implementation (default for now)
class InMemoryStore implements RateLimitStore {
  private hits = new Map<string, { count: number; resetTime: number }>();

  async increment(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const record = this.hits.get(key);

    if (!record || record.resetTime < now) {
      // Create new or reset expired
      this.hits.set(key, { count: 1, resetTime: now + windowMs });
      return { success: 1 <= limit, current: 1, resetTime: now + windowMs };
    }

    // Increment existing
    record.count += 1;
    return {
      success: record.count <= limit,
      current: record.count,
      resetTime: record.resetTime,
    };
  }
}

// Global store instance to persist across HMR in dev
const globalForStore = globalThis as unknown as {
  _rateLimitStore?: RateLimitStore;
};

const store = globalForStore._rateLimitStore || new InMemoryStore();
if (process.env.NODE_ENV !== 'production')
  globalForStore._rateLimitStore = store;

export async function rateLimit(identifier: string, config: RateLimitConfig) {
  const result = await store.increment(
    identifier,
    config.limit,
    config.windowMs,
  );
  return result;
}
