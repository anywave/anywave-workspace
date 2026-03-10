import type { Card, CardSection, Widget, Button, RenderAction } from '../types/workspace'

export function card(opts: { title: string; subtitle?: string; sections: CardSection[] }): Card {
  return {
    header: { title: opts.title, subtitle: opts.subtitle },
    sections: opts.sections,
  }
}

export function section(header: string, ...widgets: Widget[]): CardSection {
  return { header, widgets }
}

export function text(content: string): Widget {
  return { textParagraph: { text: content } }
}

export function labeled(label: string, content: string, bottomLabel?: string): Widget {
  return { decoratedText: { topLabel: label, text: content, bottomLabel } }
}

export function buttons(...btns: Button[]): Widget {
  return { buttonList: { buttons: btns } }
}

export function actionButton(label: string, fn: string, params?: Record<string, string>): Button {
  return {
    text: label,
    onClick: {
      action: {
        function: fn,
        parameters: params ? Object.entries(params).map(([key, value]) => ({ key, value })) : undefined,
      },
    },
  }
}

export function linkButton(label: string, url: string): Button {
  return { text: label, onClick: { openLink: { url } } }
}

export function textInput(name: string, label: string, hint?: string, multiline?: boolean): Widget {
  return {
    textInput: {
      name,
      label,
      type: multiline ? 'MULTIPLE_LINE' : 'SINGLE_LINE',
      hintText: hint,
    },
  }
}

export function divider(): Widget {
  return { divider: {} }
}

export function renderCard(c: Card): { renderActions: RenderAction } {
  return {
    renderActions: {
      action: { navigations: [{ pushCard: c }] },
    },
  }
}

export function updateCard(c: Card): { renderActions: RenderAction } {
  return {
    renderActions: {
      action: { navigations: [{ updateCard: c }] },
    },
  }
}

export function notify(message: string): { renderActions: RenderAction } {
  return {
    renderActions: {
      action: {
        navigations: [],
        notification: { text: message },
      },
    },
  }
}
