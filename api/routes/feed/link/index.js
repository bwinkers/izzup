export default async function (fastify, opts) {

  // Append a link to a hosted feeds links list
  fastify.post('/', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })

  // Remove a link from a hosted feeds links list
  fastify.delete('/', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })

}
