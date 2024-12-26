import 'dotenv/config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { verifyReqDirs } from "./lib/index.js"

const args = yargs(hideBin(process.argv))
    .option('dir', {
        describe: 'Directory to use for cache and indexes',
        default: process.env.TWTXT_CACHE_DIR,
    })
    .env()
    .parse();

console.log(`INITIALIZING twtxt cache indexed cache dir: ${args.dir}`)

verifyReqDirs(args.dir)

console.log(`COMPLETED initializion of: ${args.dir}`)