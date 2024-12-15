export default async function (fastify, opts) {

  // Append a feed to a hosted feeds follows list
  fastify.post('/', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })

  // Remove a feed from a hosted feeds follows list
  fastify.delete('/', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })
  
}
