import express from 'express'
import dotenv from 'dotenv'
import { gmailRouter } from './routes/gmail'
import { docsRouter } from './routes/docs'
import { sheetsRouter } from './routes/sheets'
import { homepageRouter } from './routes/homepage'
import { config } from './config'

dotenv.config()

const app = express()
app.use(express.json())

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'anywave-workspace', version: '0.1.0' })
})

// Google Workspace Add-on routes
app.use('/gmail', gmailRouter)
app.use('/docs', docsRouter)
app.use('/sheets', sheetsRouter)
app.use('/homepage', homepageRouter)

// Webhook endpoints
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  // TODO: Stripe webhook handler
  res.sendStatus(200)
})

const port = config.port
app.listen(port, () => {
  console.log(`ANYWAVE Workspace add-on listening on port ${port}`)
})
