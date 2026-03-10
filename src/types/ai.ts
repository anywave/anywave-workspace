export type AiProvider = 'gemini' | 'claude' | 'openai' | 'mobius'

export interface AiRequest {
  provider: AiProvider
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  context?: Record<string, unknown>
}

export interface AiResponse {
  text: string
  provider: AiProvider
  model: string
  tokensUsed: number
  latencyMs: number
}

export interface UserQuota {
  userId: string
  tier: 'free' | 'pro' | 'team' | 'enterprise'
  requestsUsed: number
  requestsLimit: number
  resetAt: Date
}
