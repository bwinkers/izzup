export default async function (fastify, opts) {

  // Append a feed to a hosted feeds follows list
  fastify.post('/', 
    {
      schema: {
        description: 'Follow a feed',
        tags: ['follows'],
        summary: "Allow adding a new feed to the follow list in a member's twtxt file",
        body: {
          type: 'object',
          properties: {
            nick: { type: 'string' },
            url: { type: 'string' }
          }
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              createdAt: { type: 'string' }
            }
          }
        }
      }
    },
    async function (request, reply) {
      return {
        createdAt: new Date().toISOString()
      }
    }
  )

  // Remove a feed from a hosted feeds follows list
  fastify.delete('/', 
    {
      schema: {
        description: 'Un-follow a feed',
        tags: ['follows'],
        summary: "Remove a feed from the follow list in a member's twtxt file",
        body: {
          type: 'object',
          properties: {
            nick: { type: 'string' }
          }
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              deletedAt: { type: 'string' }
            }
          }
        }
      }
    },
    async function (request, reply) {
      return {
        deletedAt: new Date().toISOString()
      }
    }
  )
  
}
