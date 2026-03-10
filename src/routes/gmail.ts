import { Router } from 'express'
import type { WorkspaceEvent } from '../types/workspace'
import { generateAiResponse } from '../services/ai'
import { extractUserId, checkQuota, incrementUsage } from '../services/auth'
import { emailSummaryCard, draftReplyCard, loadingCard } from '../cards/gmail-cards'
import { renderCard, notify, card, section, text, buttons, actionButton, linkButton } from '../cards/builder'

export const gmailRouter = Router()

// Contextual trigger — fires when user opens an email
gmailRouter.post('/contextual', async (req, res) => {
  const event = req.body as WorkspaceEvent

  const contextCard = card({
    title: 'ANYWAVE AI',
    subtitle: 'Email Tools',
    sections: [
      section(
        'Actions',
        buttons(
          actionButton('Summarize', 'gmail.summarize'),
          actionButton('Draft Reply', 'gmail.draftReply'),
          actionButton('Extract Action Items', 'gmail.extractActions'),
        )
      ),
    ],
  })

  res.json(renderCard(contextCard))
})

// Summarize email
gmailRouter.post('/summarize', async (req, res) => {
  const event = req.body as WorkspaceEvent
  const userId = extractUserId(event)
  const { allowed, quota } = await checkQuota(userId)

  if (!allowed) {
    return res.json(renderCard(upgradeCard(quota.requestsLimit)))
  }

  try {
    const result = await generateAiResponse({
      provider: 'gemini',
      systemPrompt: 'You are a concise email summarizer. Provide a 2-3 sentence summary of the email, highlighting key points, requests, and deadlines.',
      prompt: `Summarize this email. Message ID: ${event.gmail?.messageId || 'unknown'}`,
      maxTokens: 256,
    })

    incrementUsage(userId)
    res.json(renderCard(emailSummaryCard(result.text, 'Email Summary')))
  } catch (err) {
    res.json(notify('Error summarizing email. Please try again.'))
  }
})

// Draft reply
gmailRouter.post('/draftReply', async (req, res) => {
  const event = req.body as WorkspaceEvent
  const userId = extractUserId(event)
  const { allowed } = await checkQuota(userId)

  if (!allowed) {
    return res.json(renderCard(upgradeCard(50)))
  }

  try {
    const result = await generateAiResponse({
      provider: 'gemini',
      systemPrompt: 'You are a professional email drafter. Write a clear, courteous reply. Match the tone of the original email.',
      prompt: `Draft a reply to this email. Thread ID: ${event.gmail?.threadId || 'unknown'}`,
      maxTokens: 512,
    })

    incrementUsage(userId)
    res.json(renderCard(draftReplyCard(result.text)))
  } catch (err) {
    res.json(notify('Error generating draft. Please try again.'))
  }
})

function upgradeCard(limit: number) {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Quota Reached',
    sections: [
      section('', text(`You've used all ${limit} free requests this month.`)),
      section('', buttons(
        linkButton('Upgrade to Pro', 'https://anywavecreations.com/workspace/pricing'),
      )),
    ],
  })
}
