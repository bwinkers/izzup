export default async function (fastify, opts) {

  // Add a feed to the registry to be indexed
  fastify.post('/', 
    {
      schema: {
        description: 'Add a feed to the registry',
        tags: ['registry'],
        summary: "Register a feed in the search index",
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
              addedAt: { type: 'string' }
            }
          }
        }
      }
    }, 
    async function (request, reply) {
      console.log(request.body)
      return {
        addedAt: new Date().toISOString()
      }
    }
  )
}
