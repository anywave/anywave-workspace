import { Router } from 'express'
import type { WorkspaceEvent } from '../types/workspace'
import { generateAiResponse } from '../services/ai'
import { extractUserId, checkQuota, incrementUsage } from '../services/auth'
import { docAnalysisCard, writingAssistantCard } from '../cards/docs-cards'
import { renderCard, notify } from '../cards/builder'

export const docsRouter = Router()

docsRouter.post('/contextual', async (req, res) => {
  const event = req.body as WorkspaceEvent
  res.json(renderCard(writingAssistantCard()))
})

docsRouter.post('/summarize', async (req, res) => {
  const event = req.body as WorkspaceEvent
  const userId = extractUserId(event)
  const { allowed } = await checkQuota(userId)

  if (!allowed) {
    return res.json(notify('Quota reached. Upgrade for more requests.'))
  }

  try {
    const result = await generateAiResponse({
      provider: 'gemini',
      systemPrompt: 'Summarize the document in 3-5 bullet points, highlighting the main arguments and conclusions.',
      prompt: `Summarize document: ${event.docs?.title || 'Untitled'}`,
      maxTokens: 512,
    })

    incrementUsage(userId)
    res.json(renderCard(docAnalysisCard(result.text, event.docs?.title || 'Document')))
  } catch (err) {
    res.json(notify('Error analyzing document. Please try again.'))
  }
})

docsRouter.post('/generate', async (req, res) => {
  const event = req.body as WorkspaceEvent
  const userId = extractUserId(event)
  const { allowed } = await checkQuota(userId)

  if (!allowed) {
    return res.json(notify('Quota reached. Upgrade for more requests.'))
  }

  const prompt = event.commonEventObject?.formInputs?.prompt?.stringInputs?.value?.[0]
  if (!prompt) {
    return res.json(notify('Please enter a prompt first.'))
  }

  try {
    const result = await generateAiResponse({
      provider: 'gemini',
      systemPrompt: 'You are a professional writer. Generate well-structured, clear content based on the user\'s request.',
      prompt,
      maxTokens: 1024,
    })

    incrementUsage(userId)
    res.json(renderCard(docAnalysisCard(result.text, 'Generated Content')))
  } catch (err) {
    res.json(notify('Error generating content. Please try again.'))
  }
})
