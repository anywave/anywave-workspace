import type { WorkspaceEvent } from '../types/workspace'
import type { UserQuota } from '../types/ai'

const TIER_LIMITS: Record<string, number> = {
  free: 50,
  pro: 1000,
  team: 5000,
  enterprise: -1, // unlimited
}

// In production, this would query Firestore
const quotaCache = new Map<string, UserQuota>()

export function extractUserId(event: WorkspaceEvent): string {
  // The system ID token contains the user's unique ID
  return event.authorizationEventObject?.systemIdToken || 'anonymous'
}

export async function checkQuota(userId: string): Promise<{ allowed: boolean; quota: UserQuota }> {
  let quota = quotaCache.get(userId)

  if (!quota) {
    quota = {
      userId,
      tier: 'free',
      requestsUsed: 0,
      requestsLimit: TIER_LIMITS.free,
      resetAt: getNextResetDate(),
    }
    quotaCache.set(userId, quota)
  }

  // Reset if past reset date
  if (new Date() > quota.resetAt) {
    quota.requestsUsed = 0
    quota.resetAt = getNextResetDate()
  }

  const limit = TIER_LIMITS[quota.tier]
  const allowed = limit === -1 || quota.requestsUsed < limit

  return { allowed, quota }
}

export function incrementUsage(userId: string): void {
  const quota = quotaCache.get(userId)
  if (quota) {
    quota.requestsUsed++
  }
}

function getNextResetDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}
