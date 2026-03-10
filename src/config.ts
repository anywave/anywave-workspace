export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  google: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
  },

  ai: {
    geminiKey: process.env.GEMINI_API_KEY || '',
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
    openaiKey: process.env.OPENAI_API_KEY || '',
    defaultProvider: 'gemini' as 'gemini' | 'claude' | 'openai',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  mobius: {
    gatewayUrl: process.env.MOBIUS_GATEWAY_URL || '',
    enabled: process.env.MOBIUS_MESH_ENABLED === 'true',
  },
}
