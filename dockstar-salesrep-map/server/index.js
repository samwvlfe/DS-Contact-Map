import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import Fastify from 'fastify'
import cors from '@fastify/cors'
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contacts.js'
import listRoutes from './routes/lists.js'

const fastify = Fastify({ logger: true })

// In-memory session store — keyed by UUID session ID
export const sessions = new Map()

// register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true
})

// register routes
fastify.register(authRoutes, { prefix: '/auth' })
fastify.register(contactRoutes, { prefix: '/api' })
fastify.register(listRoutes, { prefix: '/api' })

try {
  const port = process.env.PORT || 3002
  await fastify.listen({ port, host: '0.0.0.0' })
  console.log(`Server running on port ${port}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
