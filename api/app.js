import path from 'path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'url'

import config from './config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Pass --options via CLI arguments in command to enable these options.
export const options = {  exposeRoute: true }

export default async function (fastify, opts) {
  // Place here your custom code!
  await fastify.register(config);

  // await fastify.register(import('@fastify/swagger'))

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  // await fastify.ready()
  // fastify.swagger()

}
