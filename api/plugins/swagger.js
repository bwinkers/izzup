import fp from "fastify-plugin";

import swagger from "@fastify/swagger"
import swaggerUi from '@fastify/swagger-ui';

export default fp(async function(server, opts) {
  await server.register(swagger);

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    stripBasePath: false,
    swagger: {
        info: {
          title: 'Izzup API',
          description: 'Izzup Platform API',
          version: '0.1.0'
        },
        host: 'api.izzup.com',
        schemes: ['https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'accounts', description: 'Account related endpoints' },
          { name: 'orgs', description: 'Org related endpoints' }
        ],
        
      },

    uiConfig: {
      docExpansion: 'none',
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
})
