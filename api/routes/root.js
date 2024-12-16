export default async function (fastify, opts) {
  fastify.get('/', 
    {
      schema: {
        description: 'API Info',
        tags: ['info'],
        summary: "Used to provide API meta info to the client",
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              privacyPolicyUrl: { type: 'string' },
              termsOfServiceUrl: { type: 'string' }
            }
          }
        }
      }
    },   
    async function (request, reply) {
    return { 
      privacyPolicyUrl: 'https://www.izzup.com/docs/privacy-policy',
      termsOfServiceUrl: 'https://www.izzup.com/docs/terms-of-service',
    }
  })
}
