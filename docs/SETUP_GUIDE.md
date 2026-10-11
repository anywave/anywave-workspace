# ANYWAVE AI Workspace Add-on — Developer Setup Guide

This guide walks you through setting up the ANYWAVE AI Google Workspace Add-on for local development, testing, and deployment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 22+** — [Download](https://nodejs.org/) (LTS recommended)
- **npm 10+** — Included with Node.js
- **Google Cloud CLI (gcloud)** — [Install](https://cloud.google.com/sdk/docs/install)
- **Docker** — [Install](https://docs.docker.com/get-docker/) (required for Cloud Run deployment)
- **Git** — [Install](https://git-scm.com/)
- **A Google Cloud account** with billing enabled
- **A Google Workspace account** (or a free Google account for testing)

Verify your installations:

```bash
node --version    # Should be 22.x or higher
npm --version     # Should be 10.x or higher
gcloud --version  # Should show Google Cloud SDK version
docker --version  # Should show Docker version
```

## 1. Clone and Install

```bash
git clone https://github.com/anywave/anywave-workspace.git
cd anywave-workspace
npm install
```

## 2. Environment Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account.json

# AI Providers (at least one required for development)
GEMINI_API_KEY=your-gemini-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key

# MOBIUS (optional, for mesh integration testing)
MOBIUS_GATEWAY_URL=http://localhost:8090
MOBIUS_MESH_ENABLED=false

# Server
PORT=8080
NODE_ENV=development
```

### Obtaining API Keys

- **Gemini**: [Google AI Studio](https://aistudio.google.com/apikey)
- **Anthropic Claude**: [Anthropic Console](https://console.anthropic.com/)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)

You only need one provider key for development. All three are needed for production.

## 3. Google Cloud Project Setup

### 3.1 Create a Google Cloud Project

```bash
# Create a new project
gcloud projects create anywave-workspace-dev --name="ANYWAVE Workspace Dev"

# Set it as the active project
gcloud config set project anywave-workspace-dev

# Enable billing (required for Cloud Run)
# Visit: https://console.cloud.google.com/billing
# Link the project to a billing account
```

### 3.2 Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  gmail.googleapis.com \
  docs.googleapis.com \
  sheets.googleapis.com \
  slides.googleapis.com
```

### 3.3 Create a Service Account

```bash
# Create the service account
gcloud iam service-accounts create anywave-workspace \
  --display-name="ANYWAVE Workspace Add-on"

# Grant necessary roles
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:<SERVICE_ACCOUNT_NAME>@<PROJECT_ID>.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Generate a key file for local development
mkdir -p credentials
gcloud iam service-accounts keys create credentials/service-account.json \
  --iam-account=<SERVICE_ACCOUNT_NAME>@<PROJECT_ID>.iam.gserviceaccount.com
```

**Important**: Never commit `credentials/service-account.json` to version control. It is already listed in `.gitignore`.

### 3.4 Store API Keys in Secret Manager

For production deployments, store API keys in Google Secret Manager:

```bash
echo -n "your-gemini-key" | gcloud secrets create GEMINI_API_KEY --data-file=-
echo -n "your-anthropic-key" | gcloud secrets create ANTHROPIC_API_KEY --data-file=-
echo -n "your-openai-key" | gcloud secrets create OPENAI_API_KEY --data-file=-
```

## 4. OAuth Consent Screen Configuration

The OAuth consent screen is required for the add-on to access user data.

### 4.1 Configure via Google Cloud Console

1. Go to [APIs & Services > OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Select **External** user type (or **Internal** if using Google Workspace)
3. Fill in the application details:
   - **App name**: ANYWAVE AI
   - **User support email**: support@anywavecreations.com
   - **App logo**: Upload `assets/logo-120x120.png`
   - **Application home page**: https://anywavecreations.com
   - **Privacy policy link**: https://anywavecreations.com/workspace/privacy
   - **Terms of service link**: https://anywavecreations.com/workspace/terms
   - **Developer contact email**: support@anywavecreations.com

### 4.2 Add Required Scopes

Add the following OAuth scopes:

| Scope | Purpose |
|-------|---------|
| `https://www.googleapis.com/auth/gmail.addons.execute` | Run as a Gmail add-on |
| `https://www.googleapis.com/auth/gmail.addons.current.message.readonly` | Read current email |
| `https://www.googleapis.com/auth/gmail.compose` | Draft email replies |
| `https://www.googleapis.com/auth/documents` | Read and edit Google Docs |
| `https://www.googleapis.com/auth/spreadsheets` | Read and edit Google Sheets |
| `https://www.googleapis.com/auth/presentations` | Read and edit Google Slides |
| `https://www.googleapis.com/auth/script.external_request` | Make external API calls |
| `https://www.googleapis.com/auth/userinfo.email` | Identify the user |

### 4.3 Add Test Users

While the app is in "Testing" status, only listed test users can access it:

1. Go to the **Test users** section
2. Add the Google accounts that will be testing the add-on

## 5. Local Development

### 5.1 Start the Development Server

```bash
npm run dev
```

This starts the server on `http://localhost:8080` with hot reloading.

### 5.2 Expose Local Server with ngrok

Google Workspace Add-ons require an HTTPS endpoint. Use ngrok to expose your local server:

```bash
# Install ngrok if you haven't already
npm install -g ngrok

# Start the tunnel
ngrok http 8080
```

Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok-free.app`).

### 5.3 Create a Test Deployment Descriptor

Create or update `deployment.test.json` with your ngrok URL:

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.addons.execute",
    "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  "addOns": {
    "common": {
      "name": "ANYWAVE AI (Dev)",
      "logoUrl": "https://anywavecreations.com/assets/anywave-logo.png",
      "homepageTrigger": {
        "runFunction": "https://YOUR_NGROK_URL/homepage"
      }
    },
    "gmail": {
      "contextualTriggers": [
        {
          "unconditional": {},
          "onTriggerFunction": "https://YOUR_NGROK_URL/gmail/contextual"
        }
      ],
      "composeTrigger": {
        "selectActions": [
          {
            "text": "Draft with ANYWAVE AI",
            "runFunction": "https://YOUR_NGROK_URL/gmail/compose"
          }
        ]
      }
    },
    "docs": {
      "homepageTrigger": {
        "runFunction": "https://YOUR_NGROK_URL/docs/homepage"
      }
    },
    "sheets": {
      "homepageTrigger": {
        "runFunction": "https://YOUR_NGROK_URL/sheets/homepage"
      }
    },
    "slides": {
      "homepageTrigger": {
        "runFunction": "https://YOUR_NGROK_URL/slides/homepage"
      }
    }
  }
}
```

### 5.4 Install the Test Add-on

1. Go to [Google Workspace Developer Hub](https://script.google.com/home/usersettings) — or use the `gcloud` approach below
2. Use the Apps Script API or the Google Cloud Console to register your test deployment

Using `gcloud`:

```bash
# Create the deployment
gcloud workspace-add-ons deployments create anywave-dev \
  --deployment-file=deployment.test.json
```

### 5.5 Verify the Installation

1. Open [Gmail](https://mail.google.com)
2. Look for the ANYWAVE AI icon in the right sidebar
3. Click it to open the add-on panel
4. The add-on should load and display the homepage

## 6. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests (requires API keys)
npm run test:integration

# Lint and type-check
npm run lint
npm run typecheck
```

## 7. Deployment to Cloud Run

### 7.1 Build and Push the Container

```bash
# Build the Docker image
docker build -t gcr.io/anywave-workspace-dev/anywave-workspace:latest .

# Push to Google Container Registry
docker push gcr.io/anywave-workspace-dev/anywave-workspace:latest
```

Or use Cloud Build to build remotely:

```bash
gcloud builds submit --tag gcr.io/anywave-workspace-dev/anywave-workspace:latest
```

### 7.2 Deploy to Cloud Run

```bash
gcloud run deploy anywave-workspace \
  --image gcr.io/anywave-workspace-dev/anywave-workspace:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60
```

Note the service URL from the output (e.g., `https://anywave-workspace-xxxxx-uc.a.run.app`).

### 7.3 Update the Deployment Descriptor

Update `deployment.json` with the Cloud Run service URL and deploy:

```bash
# Replace YOUR_CLOUD_RUN_URL in deployment.json with the actual URL
sed -i "s|YOUR_CLOUD_RUN_URL|https://anywave-workspace-xxxxx-uc.a.run.app|g" deployment.json

# Create or update the deployment
gcloud workspace-add-ons deployments create anywave-prod \
  --deployment-file=deployment.json
```

## 8. Publishing to the Marketplace

### 8.1 Pre-Publication Checklist

Before submitting to the Google Workspace Marketplace, verify:

- [ ] All tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Privacy Policy is published at https://anywavecreations.com/workspace/privacy
- [ ] Terms of Service are published at https://anywavecreations.com/workspace/terms
- [ ] OAuth consent screen is fully configured
- [ ] All required screenshots are prepared (see `MARKETPLACE_LISTING.md`)
- [ ] Cloud Run service is deployed and responsive
- [ ] Add-on works correctly in Gmail, Docs, Sheets, and Slides
- [ ] Free tier quota enforcement is working
- [ ] Error handling and user-facing messages are polished
- [ ] Logo and promotional tiles are prepared (see `MARKETPLACE_LISTING.md`)

### 8.2 Configure the Marketplace Listing

1. Go to [Google Cloud Console > API & Services > Google Workspace Marketplace SDK](https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com)
2. Enable the **Google Workspace Marketplace SDK**
3. Go to the **Configuration** tab
4. Fill in the listing details from `MARKETPLACE_LISTING.md`:
   - App name, descriptions, category
   - Upload screenshots and promotional tiles
   - Set visibility (Public or Organization-only)
   - Add support and policy URLs
5. Go to the **Publish** tab
6. Click **Publish**

### 8.3 Review Process

After submission, Google will review the add-on. The review typically takes:

- **Initial review**: 3-7 business days
- **Re-review after changes**: 1-3 business days

Common review issues to avoid:

- Requesting unnecessary OAuth scopes
- Missing or incomplete privacy policy
- Unclear purpose or functionality description
- Broken functionality in any supported Workspace app
- Missing error handling or confusing error messages

### 8.4 Post-Publication

After approval:

1. Verify the listing appears in [Google Workspace Marketplace](https://workspace.google.com/marketplace)
2. Test the installation flow from the Marketplace listing
3. Monitor the [Cloud Run dashboard](https://console.cloud.google.com/run) for errors
4. Set up alerting for error rates and latency
5. Monitor user feedback and reviews

## 9. Continuous Deployment

No CI/CD workflows are included yet. `deployment/cloudbuild.yaml` builds and deploys the container to Cloud Run when run with `gcloud builds submit`; `npm run deploy` deploys from source.

## Troubleshooting

### Add-on not appearing in Gmail

- Verify the deployment is created: `gcloud workspace-add-ons deployments list`
- Check that your account is listed as a test user
- Try clearing Gmail cache: hard refresh (Ctrl+Shift+R) or open in incognito
- Check the browser console for errors

### "Permission denied" errors

- Verify all required APIs are enabled (Section 3.2)
- Verify the OAuth consent screen includes all required scopes (Section 4.2)
- Verify the service account has the correct roles (Section 3.3)

### "Internal error" from Cloud Run

- Check Cloud Run logs: `gcloud run services logs read anywave-workspace --region us-central1`
- Verify environment variables and secrets are set correctly
- Ensure the container starts and listens on the correct port

### ngrok tunnel disconnects

Free ngrok accounts have session limits. For extended development:
- Use a paid ngrok plan for persistent URLs
- Or redeploy the test descriptor with the new URL each time

## Additional Resources

- [Google Workspace Add-ons documentation](https://developers.google.com/workspace/add-ons)
- [Cloud Run documentation](https://cloud.google.com/run/docs)
- [Google Workspace Marketplace publishing guide](https://developers.google.com/workspace/marketplace)
- [ANYWAVE Creations](https://anywavecreations.com)
