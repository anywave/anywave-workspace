import type { AiProvider, AiRequest, AiResponse } from '../types/ai'
import { config } from '../config'

export async function generateAiResponse(request: AiRequest): Promise<AiResponse> {
  const start = Date.now()
  const provider = request.provider || config.ai.defaultProvider

  // Check MOBIUS mesh first if enabled
  if (config.mobius.enabled && provider === 'mobius') {
    return callMobiusMesh(request, start)
  }

  switch (provider) {
    case 'gemini':
      return callGemini(request, start)
    case 'claude':
      return callClaude(request, start)
    case 'openai':
      return callOpenAI(request, start)
    default:
      return callGemini(request, start)
  }
}

async function callGemini(request: AiRequest, start: number): Promise<AiResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.ai.geminiKey}`

  const body = {
    contents: [{ parts: [{ text: request.prompt }] }],
    generationConfig: {
      maxOutputTokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
    },
    ...(request.systemPrompt && {
      systemInstruction: { parts: [{ text: request.systemPrompt }] },
    }),
  }

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await resp.json() as any
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const tokens = data.usageMetadata?.totalTokenCount || 0

  return {
    text,
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    tokensUsed: tokens,
    latencyMs: Date.now() - start,
  }
}

async function callClaude(request: AiRequest, start: number): Promise<AiResponse> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.ai.anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
      ...(request.systemPrompt && { system: request.systemPrompt }),
      messages: [{ role: 'user', content: request.prompt }],
    }),
  })

  const data = await resp.json() as any
  const text = data.content?.[0]?.text || ''
  const tokens = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)

  return {
    text,
    provider: 'claude',
    model: 'claude-sonnet-4-6',
    tokensUsed: tokens,
    latencyMs: Date.now() - start,
  }
}

async function callOpenAI(request: AiRequest, start: number): Promise<AiResponse> {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.ai.openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system' as const, content: request.systemPrompt }] : []),
        { role: 'user' as const, content: request.prompt },
      ],
    }),
  })

  const data = await resp.json() as any
  const text = data.choices?.[0]?.message?.content || ''
  const tokens = data.usage?.total_tokens || 0

  return {
    text,
    provider: 'openai',
    model: 'gpt-4o',
    tokensUsed: tokens,
    latencyMs: Date.now() - start,
  }
}

async function callMobiusMesh(request: AiRequest, start: number): Promise<AiResponse> {
  // Route to local MOBIUS mesh peer for private inference
  const resp = await fetch(`${config.mobius.gatewayUrl}/v1/inference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.prompt,
      system: request.systemPrompt,
      max_tokens: request.maxTokens || 1024,
      temperature: request.temperature || 0.7,
    }),
  })

  const data = await resp.json() as any

  return {
    text: data.text || '',
    provider: 'mobius',
    model: data.model || 'local',
    tokensUsed: data.tokens_used || 0,
    latencyMs: Date.now() - start,
  }
}
