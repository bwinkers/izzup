// Read the .env file.
import * as dotenv from 'dotenv'

// Require the framework
import Fastify from 'fastify'

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace'

// Import your application
import appService from './app.js'

// Dotenv config
dotenv.config()

// Instantiate Fastify with some config
const app = Fastify({
  logger: true
})

await app.register(import('@fastify/swagger'))

await app.register(import('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Izzup API',
      description: 'Izzup Twtxt Platform API',
      version: '1.0.0'
    },
    host: 'api.izzup.com',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'post', description: 'Manage twtxt tweets or posts' },
      { name: 'profile', description: 'Edit a feed profile' },
      { name: 'links', description: 'Manage feed links' },
      { name: 'follows', description: 'Manage feed follows' },
      { name: 'feed', description: 'Create and manage a feed' },
      { name: 'registry', description: 'Allow users to submit feeds to the search registry for indexing.' },
      { name: 'info', description: 'API info' }
    ],
  },

  uiConfig: {
    docExpansion: 'none',
    defaultExpanded: false,
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

// Register your application as a normal plugin.
app.register(appService)

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace({ delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 }, async function ({ signal, err, manual }) {
  if (err) {
    app.log.error(err)
  }
  await app.close()
})

// Start listening.
app.listen({ port: process.env.PORT || 3000 }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
