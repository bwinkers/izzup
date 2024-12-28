import 'dotenv/config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { renameSync } from "fs"

import { getRandomJobId, dirExists, finishProcessing, processJob } from "./lib/index.js"

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

if (!dirExists(args.dir)) {
    console.log('ABORTING: The cache dir must be defined and must already exist.')
    process.exit(1)
}

const processOne = async (jobId, dir ) => {
    console.log(`Processing jobId: ${jobId}`)
    const jobFilename = `${dir}/tasks/pending/${jobId}.json`
    const processFilename = `${dir}/tasks/processing/${jobId}.json`
    renameSync(jobFilename, processFilename)

    try {
        await processJob(processFilename, dir)
        finishProcessing(jobId, 'completed', dir)
    } catch (e) {
        console.log(e)
        finishProcessing(jobId, 'failed', dir)
    }
}

const processBatch = async ( limit, dir ) => {
    console.log(`Processing batch of max ${limit} jobs`)
    let ix = 0
    while (ix < limit) {
        const jobId = getRandomJobId(dir)
        const jobFilename = `${dir}/tasks/processing/${jobId}.json`

        try {
            await processJob(jobFilename, dir)
            finishProcessing(jobId, 'completed', dir)
        } catch (e) {
            console.log(e)
            finishProcessing(jobId, 'failed', dir)
        }

        ix++
    }
}

if (args.jobId) {
    processOne(args.jobId, args.dir)
} else {
    processBatch(args.limit, args.dir)
}





