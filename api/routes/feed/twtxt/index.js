export default async function (fastify, opts) {

  // Add a post to a hosted feed
  fastify.post('/twtxt', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })

  // Delete a post from hosted feed
  fastify.put('/twtxt', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })

  // Delete a post from hosted feed
  fastify.delete('/twtxt', async function (request, reply) {
    console.log(request.body)
    return 'this is an example'
  })
  
}
