export default async function (fastify, opts) {

  // Search the registry
  fastify.get('/', 
    {
      schema: {
        description: 'Search the registry',
        tags: ['registry'],
        summary: "Search the twtxt-verse, includes hosted and registered feeds.",
        querystring: {
          type: 'object',
          required: ['q'],
          properties: {
            q: {
              type: 'string',
              description: 'Search query string'
            },
            p: {
              type: 'string',
              description: 'Results page number',
              default: 1
            },
            n: {
              type: 'string',
              description: 'Number of results per page',
              default: 20
            }
          }
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              resultsCount: { type: 'number' },
              resultsPage: { type: 'number' },
              results: { type: 'array', items: { type: 'string'} }
            }
          }
        }
      }
    }, 
    async function (request, reply) {
    return {
      resultsCount: 0,
      resultsPage: 1,
      results: ['test','it']
    }
  })

}
