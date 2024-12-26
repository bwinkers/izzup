import 'dotenv/config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { feedJsonByHash, dirExists, hashText, addFollower, fileExists, createJob } from "./lib/index.js"

const args = yargs(hideBin(process.argv))
    .option('dir', {
        describe: 'Directory to use for cache and indexes',
        default: process.env.TWTXT_CACHE_DIR,
    })
    .env()
    .parse();

console.log(`perform discovery on ${args.url} and index to ${args.dir}`)

if(!dirExists(args.dir)) {
    console.log('ABORTING: The cache dir must be defined and must already exist.')
    process.exit(1)
}

const feedHash = hashText(args.url)

// Use the locally cached version of the feed
const cachedFeed = feedJsonByHash(feedHash, args.dir)

console.log(`Reading\t${args.url} \n from \t${args.dir}`)

console.log(cachedFeed.follows)

for(const feed of cachedFeed.follows) {
    console.log(feed[1])

    // Get the followed feeds hash
    const followedHash = hashText(feed[1])

    // Create follower link
    if(followedHash != feedHash) {
        addFollower(followedHash, feedHash, args.dir) 
    }

    const followedCacheFile = `${args.dir}/feeds/${followedHash}/twtxt.txt`

    if(!fileExists(followedCacheFile)) {
        console.log('Creating process job to fetch a new feed')
        const content = { fetch: feed[1] }

        createJob(followedHash, JSON.stringify(content), args.dir)
    }

}

