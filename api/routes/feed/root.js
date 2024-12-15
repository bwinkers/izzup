export default async function (fastify, opts) {

  // Create a new hosted feed
  fastify.post('/', 
    {
      schema: {
        description: 'post some data',
        tags: ['user', 'code'],
        summary: 'qwerty',
        security: [{ apiKey: [] }],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'user id'
            }
          }
        },
        body: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
            obj: {
              type: 'object',
              properties: {
                some: { type: 'string' }
              }
            }
          }
        },
        response: {
          201: {
            description: 'Successful response',
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          },
          default: {
            description: 'Default response',
            type: 'object',
            properties: {
              foo: { type: 'string' }
            }
          }
        }
      }
    },
    async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })
  
}
