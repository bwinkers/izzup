export default async function (fastify, opts) {

    // Append a feed to a hosted feeds follows list
    fastify.post('/', 
      {
        schema: {
          description: 'Add a link to a feed',
          tags: ['links'],
          summary: "Add a new feed to the follow list in a member's twtxt file",
          body: {
            type: 'object',
            properties: {
              tag: { type: 'string' },
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
  
    // Remove a link from a hosted feeds links list
    fastify.delete('/', 
      {
        schema: {
          description: 'Unlink a site',
          tags: ['links'],
          summary: "Remove a link from a member's twtxt file",
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
