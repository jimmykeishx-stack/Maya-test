import { BackendError } from "@/lib/backend/core/errors";

type Entry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, Entry>();

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt < now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return;
  }

  if (existing.count >= limit) {
    throw new BackendError("Rate limit exceeded. Please try again shortly.", 429);
  }

  existing.count += 1;
  memoryStore.set(key, existing);
}
