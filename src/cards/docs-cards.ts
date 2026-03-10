import { card, section, text, buttons, actionButton, textInput, divider } from './builder'

export function docAnalysisCard(analysis: string, title: string) {
  return card({
    title: 'ANYWAVE AI',
    subtitle: `Document: ${title}`,
    sections: [
      section('Analysis', text(analysis)),
      section(
        'Actions',
        buttons(
          actionButton('Generate Outline', 'docs.generateOutline'),
          actionButton('Improve Writing', 'docs.improveWriting'),
          actionButton('Expand Section', 'docs.expandSection')
        )
      ),
    ],
  })
}

export function writingAssistantCard() {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Writing Assistant',
    sections: [
      section(
        'What would you like to do?',
        textInput('prompt', 'Describe what you need...', 'e.g., "Summarize this document" or "Write an introduction about..."', true)
      ),
      section(
        '',
        buttons(
          actionButton('Generate', 'docs.generate'),
          actionButton('Summarize Document', 'docs.summarize'),
          actionButton('Extract Key Points', 'docs.extractKeyPoints')
        )
      ),
    ],
  })
}
