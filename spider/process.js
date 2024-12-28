import 'dotenv/config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { getJobFilename, dirExists, readFile, cacheFeed, createJob, hashText, processJob } from "./lib/index.js"

const args = yargs(hideBin(process.argv))
    .option('dir', {
        describe: 'Directory to use for cache and indexes',
        default: process.env.TWTXT_CACHE_DIR,
    })
    .option('limit', {
        describe: 'Maximum number of records to process',
        default: process.env.TWTXT_PENDING_LIMIT,
    })
    .option('jobId', {
        describe: 'Process a particular job, "limit" is ignored',
        default: null,
    })
    .env()
    .parse();

if(!dirExists(args.dir)) {
    console.log('ABORTING: The cache dir must be defined and must already exist.')
    process.exit(1)
}
let jobFilename
let ix = 1



if(args.jobId) {
  console.log(`Processing jobId: ${args.jobId}`)  
  jobFilename = `${args.dir}/tasks/pending/${args.jobId}.json`
  processJob(jobFilename, args.dir)
} else {
    console.log(`Processing max ${args.limit} jobs`)
    while(ix <= args.limit) {
        try {
            jobFilename = getJobFilename(args.dir)
            processJob(jobFilename, args.dir)
        } catch (e) {
            console.log(e)
        }

        ix++
    }
}



