import { Router } from 'express'
import type { WorkspaceEvent } from '../types/workspace'
import { generateAiResponse } from '../services/ai'
import { extractUserId, checkQuota, incrementUsage } from '../services/auth'
import { sheetsAssistantCard, formulaResultCard } from '../cards/sheets-cards'
import { renderCard, notify } from '../cards/builder'

export const sheetsRouter = Router()

sheetsRouter.post('/contextual', async (req, res) => {
  res.json(renderCard(sheetsAssistantCard()))
})

sheetsRouter.post('/generateFormula', async (req, res) => {
  const event = req.body as WorkspaceEvent
  const userId = extractUserId(event)
  const { allowed } = await checkQuota(userId)

  if (!allowed) {
    return res.json(notify('Quota reached. Upgrade for more requests.'))
  }

  const prompt = event.commonEventObject?.formInputs?.formulaPrompt?.stringInputs?.value?.[0]
  if (!prompt) {
    return res.json(notify('Please describe the formula you need.'))
  }

  try {
    const result = await generateAiResponse({
      provider: 'gemini',
      systemPrompt: 'You are a Google Sheets formula expert. Given a description, return ONLY the formula on the first line, then a brief explanation. Do not include markdown code blocks.',
      prompt: `Generate a Google Sheets formula: ${prompt}`,
      maxTokens: 256,
    })

    const lines = result.text.split('\n')
    const formula = lines[0]?.trim() || result.text
    const explanation = lines.slice(1).join('\n').trim() || 'Generated formula ready to use.'

    incrementUsage(userId)
    res.json(renderCard(formulaResultCard(formula, explanation)))
  } catch (err) {
    res.json(notify('Error generating formula. Please try again.'))
  }
})

sheetsRouter.post('/analyzeData', async (req, res) => {
  const event = req.body as WorkspaceEvent
  const userId = extractUserId(event)
  const { allowed } = await checkQuota(userId)

  if (!allowed) {
    return res.json(notify('Quota reached. Upgrade for more requests.'))
  }

  try {
    const result = await generateAiResponse({
      provider: 'gemini',
      systemPrompt: 'Analyze the spreadsheet data and provide insights: trends, outliers, summary statistics, and recommended visualizations.',
      prompt: `Analyze the data in spreadsheet: ${event.sheets?.title || 'Untitled'}`,
      maxTokens: 512,
    })

    incrementUsage(userId)
    res.json(renderCard(formulaResultCard('Data Analysis', result.text)))
  } catch (err) {
    res.json(notify('Error analyzing data. Please try again.'))
  }
})
