// Google Workspace Add-on event types (Cards v2)
export interface WorkspaceEvent {
  commonEventObject: {
    userLocale: string
    hostApp: 'GMAIL' | 'DOCS' | 'SHEETS' | 'SLIDES' | 'DRIVE' | 'CALENDAR'
    platform: 'WEB' | 'ANDROID' | 'IOS'
    timeZone?: { id: string; offset: number }
    formInputs?: Record<string, { stringInputs?: { value: string[] } }>
    parameters?: Record<string, string>
  }
  authorizationEventObject?: {
    userOAuthToken: string
    systemIdToken: string
    userIdToken: string
  }
  gmail?: {
    messageId: string
    threadId: string
    accessToken: string
  }
  docs?: {
    id: string
    title: string
  }
  sheets?: {
    id: string
    title: string
  }
}

// Cards v2 response types
export interface Card {
  header?: CardHeader
  sections: CardSection[]
  cardActions?: CardAction[]
}

export interface CardHeader {
  title: string
  subtitle?: string
  imageUrl?: string
  imageType?: 'CIRCLE' | 'SQUARE'
}

export interface CardSection {
  header?: string
  collapsible?: boolean
  widgets: Widget[]
}

export type Widget =
  | { textParagraph: { text: string } }
  | { decoratedText: { topLabel?: string; text: string; bottomLabel?: string; icon?: { knownIcon: string }; button?: Button } }
  | { buttonList: { buttons: Button[] } }
  | { textInput: { name: string; label: string; type?: 'SINGLE_LINE' | 'MULTIPLE_LINE'; value?: string; hintText?: string } }
  | { selectionInput: { name: string; label: string; type: 'DROPDOWN' | 'CHECK_BOX' | 'RADIO_BUTTON' | 'SWITCH'; items: SelectionItem[] } }
  | { divider: {} }
  | { grid: { title?: string; items: GridItem[]; columnCount: number } }

export interface Button {
  text: string
  onClick: { action?: { function: string; parameters?: Parameter[] }; openLink?: { url: string } }
  disabled?: boolean
  color?: { red: number; green: number; blue: number; alpha: number }
}

export interface SelectionItem {
  text: string
  value: string
  selected?: boolean
}

export interface GridItem {
  id: string
  title: string
  subtitle?: string
  image?: { imageUri: string; cropStyle?: { type: string } }
}

export interface CardAction {
  actionLabel: string
  onClick: { action: { function: string } }
}

export interface Parameter {
  key: string
  value: string
}

export interface RenderAction {
  action: {
    navigations: Array<{ pushCard?: Card; popCard?: boolean; updateCard?: Card }>
    notification?: { text: string }
  }
}
