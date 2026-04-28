import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contacts.js'
import listRoutes from './routes/lists.js'

const fastify = Fastify({ logger: true })

await fastify.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
})

fastify.register(authRoutes, { prefix: '/auth' })
fastify.register(contactRoutes, { prefix: '/api' })
fastify.register(listRoutes, { prefix: '/api' })

try {
  await fastify.listen({ port: process.env.PORT || 3002 })
  console.log('Server running on http://localhost:3002')
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}