export default async function (fastify, opts) {

  // Add a feed to the registry to be indexed
  fastify.post('/', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })

  fastify.get('/search', async function (request, reply) {
    console.log(request.query)
    return 'this is an example'
  })

}
