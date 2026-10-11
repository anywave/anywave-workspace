# ANYWAVE Workspace Add-on

A Google Workspace Add-on backend (Node.js, TypeScript, Express, Cards v2) that
adds AI actions to Gmail, Google Docs and Google Sheets.

**Status: Phase 0/1 scaffold. Not published on the Google Workspace Marketplace.**

## What it does today

- Gmail: summarize a message, draft a reply
- Docs: analyze, generate text
- Sheets: formula generation, data analysis
- Provider choice: Gemini, Anthropic Claude or OpenAI, called from the backend
  with keys you supply (`.env.example`)
- Freemium quota and Stripe billing scaffold (`src/services/billing.ts`)

## Planned

- MOBIUS local-inference routing (`MOBIUS_MESH_ENABLED`, `MOBIUS_GATEWAY_URL`):
  the backend forwards the request to a MOBIUS gateway you operate instead of a
  cloud provider. The code path exists but no released MOBIUS gateway serves it
  yet. The request still passes through this backend, which runs on Cloud Run.

## Data flow

Content from the open message or document is sent by Google to this backend,
processed in memory, and forwarded to the selected AI provider. The add-on does
not write that content to storage. Each provider's own terms govern what it
does with requests.

## Setup

See [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md).

## Legal drafts

`docs/privacy-policy.md` and `docs/terms-of-service.md` are unreviewed drafts
and are not in force.

## Security

See [`SECURITY.md`](SECURITY.md).

## License

MIT. See [`LICENSE`](LICENSE).
