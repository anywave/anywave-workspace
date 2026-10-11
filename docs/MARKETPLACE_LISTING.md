# Google Workspace Marketplace Listing

This document contains the listing copy and metadata for the ANYWAVE AI Google Workspace Marketplace submission.

---

## App Name

ANYWAVE AI

## Short Description (80 characters max)

AI assistant for Gmail, Docs, Sheets & Slides — draft, summarize, and transform.

_(78 characters)_

## Long Description

**ANYWAVE AI brings powerful, privacy-first artificial intelligence directly into your Google Workspace.**

Stop switching between tabs and copying text into external AI tools. ANYWAVE AI works right inside Gmail, Docs, Sheets, and Slides — exactly where you already work.

### What Can ANYWAVE AI Do?

**In Gmail:**
- Draft professional email replies in seconds
- Summarize long email threads into key points
- Adjust tone — make messages more formal, friendly, or concise
- Translate emails to and from dozens of languages

**In Google Docs:**
- Summarize documents of any length
- Rewrite and polish paragraphs
- Generate content from outlines or prompts
- Proofread and suggest improvements

**In Google Sheets:**
- Generate formulas from plain English descriptions
- Analyze data patterns and trends
- Create chart descriptions and data summaries
- Clean and transform data with AI assistance

**In Google Slides:**
- Generate speaker notes for your presentations
- Suggest slide content from an outline
- Rewrite bullet points for clarity and impact
- Summarize presentation content

### Choose Your AI Provider

ANYWAVE AI gives you the freedom to choose. Select from three leading AI providers based on your needs:

- **Google Gemini** — deeply integrated with Google's ecosystem
- **Anthropic Claude** — known for nuanced, thoughtful responses
- **OpenAI** — the industry standard for versatile AI

Switch providers at any time from the settings panel. Your choice, your control.

### MOBIUS Mesh: Inference on Your Own Hardware (planned)

ANYWAVE AI is designed to route requests to **MOBIUS**, our peer-to-peer local-inference platform, instead of a cloud AI provider. This routing is scaffolded but not yet released. When it ships:

- The model runs on a MOBIUS gateway you operate, not on a cloud AI service
- The add-on backend still relays the request, because Google Workspace Add-ons call a hosted HTTPS endpoint
- You choose which gateway the add-on talks to

Availability and tier will be announced at release.

### Privacy You Can Trust

We built ANYWAVE AI with privacy as a core principle, not an afterthought:

- **Email and document content is not written to storage by the add-on** — it is processed in memory and sent to the AI provider you select
- **No data is sold to third parties**
- **Data deletion on request**

The privacy policy for this add-on will be published before the Marketplace listing goes live (draft: `docs/privacy-policy.md`, pending review).

### Free to Start

Get started with 50 free AI requests per month — no credit card required. Upgrade to Pro for 1,000 requests/month and MOBIUS mesh support.

---

## Category

Productivity

## Permissions Requested

- Gmail: Read and compose emails (to process and draft email content)
- Google Docs: Read and edit documents (to process and transform document content)
- Google Sheets: Read and edit spreadsheets (to process and generate formulas)
- Google Slides: Read and edit presentations (to process and generate slide content)
- User email address: Identify the user for preferences and quota management

## Features List (for Marketplace badges)

1. AI-powered email drafting and summarization
2. Document summarization and rewriting
3. Formula generation from natural language
4. Presentation speaker notes generation
5. Multi-provider AI (Gemini, Claude, OpenAI)
6. MOBIUS local-inference routing (planned)
7. Content processed in memory, not stored by the add-on
8. Free tier with 50 requests/month

## URLs

- **Support URL**: https://github.com/anywave/anywave-workspace/issues
- **Privacy Policy URL**: https://anywavecreations.com/workspace/privacy
- **Terms of Service URL**: https://anywavecreations.com/workspace/terms
- **Website**: https://anywavecreations.com

## Developer Information

- **Developer Name**: ANYWAVE Creations
- **Developer Email**: support@anywavecreations.com
- **Developer Website**: https://anywavecreations.com

---

## Screenshots Guide

The following screenshots should be captured for the listing. Google Workspace Marketplace requires at least 1 screenshot, recommends 5.

### Screenshot 1: Gmail Sidebar — Email Drafting
- Open Gmail with a received email visible
- Show the ANYWAVE AI sidebar open on the right
- Display a drafted reply in the sidebar with "Insert" and "Copy" buttons
- Caption: "Draft professional email replies in seconds"

### Screenshot 2: Google Docs — Document Summary
- Open a multi-page Google Docs document
- Show the ANYWAVE AI sidebar with a generated summary
- Caption: "Summarize any document with one click"

### Screenshot 3: Google Sheets — Formula Generation
- Open a Google Sheets spreadsheet with data
- Show the sidebar with a natural language prompt ("Calculate the running average of column B")
- Show the generated formula ready to insert
- Caption: "Generate formulas from plain English"

### Screenshot 4: Settings — Provider Selection
- Show the ANYWAVE AI settings panel
- Display the AI provider dropdown with Gemini, Claude, and OpenAI options
- Show the MOBIUS mesh toggle
- Caption: "Choose your AI provider"

### Screenshot 5: Privacy Dashboard
- Show the settings panel with the privacy section
- Display the data handling summary (content not stored, no data sold)
- Show the "Request Data Deletion" option
- Caption: "Privacy-first design — your data, your control"

### Image Specifications
- Format: PNG
- Resolution: 1280 x 800 pixels (recommended)
- No browser chrome — content area only
- Use realistic sample data (not lorem ipsum)
- Ensure text is legible at thumbnail size

---

## Promotional Tiles

### Small Tile (220 x 140 px)
- ANYWAVE AI logo
- Tagline: "AI for Google Workspace"

### Large Tile (440 x 280 px)
- ANYWAVE AI logo
- Tagline: "AI-powered productivity for Gmail, Docs, Sheets & Slides"
- Subtle icons for each Workspace app
