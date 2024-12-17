export default async function (fastify, opts) {

  // Create a new hosted feed
  fastify.post('/', 
    {
      schema: {
        description: 'Create a new feed',
        tags: ['feed'],
        summary: 'Allow adding a new feed',
        body: {
          type: 'object',
          properties: {
            nick: { type: 'string' },
            userType: { type: 'string' } // person | entity
          }
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              createdAt: { type: 'string' },
              url: { type: 'string' }
            }
          }
        }
      }
    },
    async function (request, reply) {
    return {
      createdAt: new Date().toISOString(),
      url: `https://www.izzup.com/person/${request.body.nick}`
    }
  })
  
}
