import { Router } from 'express'
import type { WorkspaceEvent } from '../types/workspace'
import { card, section, text, buttons, actionButton, linkButton, labeled, divider } from '../cards/builder'
import { renderCard } from '../cards/builder'

export const homepageRouter = Router()

homepageRouter.post('/', (req, res) => {
  const event = req.body as WorkspaceEvent
  const hostApp = event.commonEventObject?.hostApp || 'UNKNOWN'

  const homepageCard = card({
    title: 'ANYWAVE AI',
    subtitle: 'Workspace Intelligence',
    sections: [
      section(
        'Welcome',
        text('AI-powered tools for Gmail, Docs, and Sheets. Summarize emails, draft replies, analyze documents, and generate formulas — all with optional private local inference.'),
      ),
      section(
        'Quick Actions',
        ...getQuickActions(hostApp),
      ),
      section(
        '',
        divider(),
        labeled('Plan', 'Free (50 requests/month)'),
        buttons(
          linkButton('Upgrade', 'https://anywavecreations.com/workspace/pricing'),
          linkButton('Documentation', 'https://github.com/anywave/anywave-workspace')
        ),
      ),
    ],
  })

  res.json(renderCard(homepageCard))
})

function getQuickActions(hostApp: string) {
  const actions: ReturnType<typeof buttons>[] = []

  switch (hostApp) {
    case 'GMAIL':
      actions.push(buttons(
        actionButton('Summarize Email', 'gmail.summarize'),
        actionButton('Draft Reply', 'gmail.draftReply'),
      ))
      break
    case 'DOCS':
      actions.push(buttons(
        actionButton('Analyze Document', 'docs.analyze'),
        actionButton('Writing Assistant', 'docs.assistant'),
      ))
      break
    case 'SHEETS':
      actions.push(buttons(
        actionButton('Generate Formula', 'sheets.generateFormula'),
        actionButton('Analyze Data', 'sheets.analyzeData'),
      ))
      break
    default:
      actions.push(buttons(
        actionButton('Get Started', 'homepage.getStarted'),
      ))
  }

  return actions
}
