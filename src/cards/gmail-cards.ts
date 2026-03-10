import { card, section, text, buttons, actionButton, labeled, textInput, divider } from './builder'

export function emailSummaryCard(summary: string, subject: string) {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Email Summary',
    sections: [
      section('Summary', labeled('Subject', subject), divider(), text(summary)),
      section(
        'Actions',
        buttons(
          actionButton('Draft Reply', 'gmail.draftReply'),
          actionButton('Summarize Thread', 'gmail.summarizeThread')
        )
      ),
    ],
  })
}

export function draftReplyCard(draft: string) {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Draft Reply',
    sections: [
      section(
        'Generated Draft',
        textInput('draft', 'Edit your reply', undefined, true)
      ),
      section(
        'Actions',
        buttons(
          actionButton('Insert Draft', 'gmail.insertDraft'),
          actionButton('Regenerate', 'gmail.regenerateDraft'),
          actionButton('Adjust Tone', 'gmail.adjustTone')
        )
      ),
    ],
  })
}

export function loadingCard(message: string) {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Processing...',
    sections: [section('', text(message))],
  })
}
