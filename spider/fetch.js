import 'dotenv/config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { dirExists, cacheFeed } from "./lib/index.js"

const args = yargs(hideBin(process.argv))
    .option('dir', {
        describe: 'Directory to use for cache and indexes',
        default: process.env.TWTXT_CACHE_DIR,
    })
    .env()
    .parse();

console.log(`Fetching ${args.url} and caching to ${args.dir}`)

if(!dirExists(args.dir)) {
    console.log('ABORTING: The cache dir must be defined and must already exist.')
    process.exit(1)
}

// Process the feed
const result = cacheFeed(args.url, args.dir)


