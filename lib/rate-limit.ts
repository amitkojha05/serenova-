import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type LimitType = 'chat' | 'conversation-write'

const configs: Record<LimitType, { requests: number; window: `${number} s` | `${number} m` | `${number} h` }> = {
  chat: { requests: 20, window: '1 m' },
  'conversation-write': { requests: 30, window: '1 m' },
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export async function enforceRateLimit(
  key: string,
  type: LimitType
): Promise<{ success: true } | { success: false; retryAfter: number }> {
  const redis = getRedis()
  if (!redis) return { success: true }

  const config = configs[type]
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: `bcare:${type}`,
  })

  const result = await limiter.limit(key)
  if (!result.success) {
    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
    return { success: false, retryAfter }
  }

  return { success: true }
}
