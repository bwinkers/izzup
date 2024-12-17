export default async function (fastify, opts) {

  // Add a post to a hosted feed
  fastify.post('/', 
    {
      schema: {
        description: 'Add a twtxt post to a hosted feed',
        tags: ['posts'],
        summary: "Add a new post to a member's feed",
        body: {
          type: 'object',
          properties: {
            twt: { type: 'string' }
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

  // Update a post from hosted feed
  fastify.put('/', 
    {
      schema: {
        description: 'Updated a post in a hosted feed',
        tags: ['posts'],
        summary: "Update a twtxt post in a member's feed",
        body: {
          type: 'object',
          properties: {
            timestamp: { type: 'string' },
            hash: { type: 'string' },
            twt: { type: 'string' }
          }
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              updatedAt: { type: 'string' }
            }
          }
        }
      }
    }, 
    async function (request, reply) {
      return {
        updatedAt: new Date().toISOString()
      }
    }
  )

  // Delete a post from hosted feed
  fastify.delete('/', 
    {
      schema: {
        description: 'Delete a post in a hosted feed',
        tags: ['posts'],
        summary: "Delete a twtxt post in a member's feed",
        body: {
          type: 'object',
          properties: {
            timestamp: { type: 'string' },
            hash: { type: 'string' }
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
