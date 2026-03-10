import { card, section, text, buttons, actionButton, textInput, labeled } from './builder'

export function sheetsAssistantCard() {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Sheets Assistant',
    sections: [
      section(
        'Formula Generator',
        textInput('formulaPrompt', 'Describe the formula you need', 'e.g., "Calculate the average of column B where column A is greater than 100"')
      ),
      section(
        '',
        buttons(
          actionButton('Generate Formula', 'sheets.generateFormula'),
          actionButton('Analyze Data', 'sheets.analyzeData'),
          actionButton('Clean Data', 'sheets.cleanData')
        )
      ),
    ],
  })
}

export function formulaResultCard(formula: string, explanation: string) {
  return card({
    title: 'ANYWAVE AI',
    subtitle: 'Formula Result',
    sections: [
      section('Formula', labeled('Generated', formula), text(explanation)),
      section(
        '',
        buttons(
          actionButton('Copy Formula', 'sheets.copyFormula', { formula }),
          actionButton('Try Another', 'sheets.newFormula')
        )
      ),
    ],
  })
}
