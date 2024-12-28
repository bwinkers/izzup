import { existsSync, mkdirSync, readFileSync, createWriteStream, writeFileSync, readdirSync, renameSync } from "fs"
import path from "path"
import { Readable } from "stream";

import { createHash } from 'crypto';

const reqDirs = ['logs', 'feeds', 'nicks', 'hosts', 'tasks/pending', 'tasks/processing', 'tasks/completed', 'tasks/failed']

const dirExists = (dir) => {
  return existsSync(dir)
}

const fileExists = (filePath) => {
  return existsSync(filePath)
}

const verifyReqDirs = (rootDir) => {

  for (const dir of reqDirs) {
    const fullDir = path.resolve(`${rootDir}/${dir}`)
    if (!existsSync(fullDir)) {
      console.log(`${fullDir} not found...`)
      mkdirSync(fullDir, { recursive: true })
      writeFileSync(`${fullDir}/cache.ix`, JSON.stringify({ "createdAt": new Date().toISOString() }))
      console.log(`${fullDir} CREATED.`)
    } else {
      console.log(`${fullDir} found.`)
    }
  }
}

const ensureDir = (dir) => {
  if (!existsSync(dir)) {
    console.log(`${dir} not found...`)
    mkdirSync(dir, { recursive: true })
    console.log(`${dir} CREATED.`)
  } else {
    console.log(`${dir} found.`)
  }
}

const feedByHash = (hash, dir) => {

  // Full filepath
  const fullPath = path.resolve(`${dir}/feeds/${hash}/twtxt.txt`)

  const feedTxt = readFileSync(fullPath, 'utf8')

  return feedTxt
}

const feedJsonByHash = (hash, dir) => {
  // Get hash of twtxt url to use as unique ID
  const feedTxt = feedByHash(hash, dir)

  // Convert text to JSON
  const feedJson = twtxtToJson(feedTxt)

  return feedJson
}

const twtxtToJson = (txt) => {
  const profile = {
    nick: '',
    avatar: '',
    urls: [],
    description: '',
    bio: '',
  }
  const links = []
  const employment = []
  const follows = []
  const posts = []

  // console.log(txt)
  const lines = txt.split('\n')
  // console.log(lines)

  const regexMeta = new RegExp("(^#.*=)")
  const regexTab = new RegExp("\\t");

  let parts = []

  lines.forEach((line) => {
    parts = [] // reset on loop
    //console.log(line)
    // Check if comment or date.
    if (regexMeta.test(line)) {
      // console.log(line)
      // Trim off first comment character
      const metaDef = line.slice(1)
      // Split on '=' 
      const [n, v] = metaDef.split("=", 2)
      const name = n.trim()
      const val = v.trim()
      // console.log(`${name} => ${val}`)
      switch (name) {
        case 'nick':
          profile.nick = val
          break
        case 'avatar':
          profile.avatar = val
          break
        case 'tagline':
          profile.tagline = val
          break
        case 'url':
          profile.urls.push(val)
          break
        case 'feedTitle':
          profile.feedTitle = val
          break
        case 'link':
          //parts = val.split(' ')
          // Split val on https
          let splitAt
          if (val.indexOf('https://') > 2) {
            splitAt = val.indexOf('https://')
          } else if (splitAt < 2) {
            splitAt = val.indexOf('gemini://')
          }
          else if (splitAt < 2) {
            splitAt = val.indexOf('gopher://')
          }
          else if (splitAt < 2) {
            splitAt = val.indexOf('http://')
          }
          links.push([val.substring(0, splitAt).trim(), val.substring(splitAt)])
          break
        case 'follow':
          parts = val.split(' ')
          follows.push(parts)
          break
        // Izzup extensions
        case 'description':
          profile.description = val
          break
        case 'bio':
          profile.bio = val
          break
        case 'employment':
          employment.push(val)
          break
      }

    }

    if (regexTab.test(line)) {
      parts = line.split('\t')
      const postDate = new Date(parts[0])
      if (postDate.toString() != 'Invalid Date') {
        posts.push(parts)
      }

    }
  })
  return {
    profile: profile,
    links: links,
    follows: follows,
    posts: posts
  }
}

const hashText = (txt) => {
  const hash = createHash('sha256').update(txt).digest('hex')
  return hash
}

const cacheFeed = async (url, dir) => {
  // Get hash of twtxt url to use as unique ID
  const feedHash = hashText(url)

  // Full filepath
  const fullPath = path.resolve(`${dir}/feeds/${feedHash}/twtxt.txt`)
  
  let result = fullPath

  if (!fileExists(fullPath)) {

    // Fetch the feed
    const resp = await fetch(url)

    if (resp.ok && resp.body) {
      ensureDir(`${dir}/feeds/${feedHash}`)
      let writer = createWriteStream(fullPath);
      Readable.fromWeb(resp.body).pipe(writer);
    } else {
      console.log(`Failed fetching ${url}`)
      result = false
    }
    
    return result
  
  } 
}

const addFollower = (followedHash, followerHash, dir) => {

  const followedDir = path.resolve(`${dir}/feeds/${followedHash}/followers/${followerHash}`)

  ensureDir(followedDir)

  writeFileSync(`${followedDir}/cache.ix`, JSON.stringify({ "createdAt": new Date().toISOString() }))
}

const createJob = (name, content, dir) => {
  const jobFilename = path.resolve(`${dir}/tasks/pending/${name}.json`)

  writeFileSync(jobFilename, content)
}

const getRandomJobId = (dir) => {
  const jobDir = path.resolve(`${dir}/tasks/pending/`)

  let dirContents = readdirSync(jobDir)
  dirContents = dirContents.filter(item => item.split('.')[1] != 'ix')

  if (dirContents.length > 0) {

    const jobFilename = dirContents[(Math.random() * dirContents.length) | 0]

    const jobId = jobFilename.split('.')[0]

    const jobFullPath = `${dir}/tasks/pending/${jobFilename}`

    const jobProcessingPath = `${dir}/tasks/processing/${jobFilename}`

    renameSync(jobFullPath, jobProcessingPath)

    console.log(`Moved ${jobFullPath} to ${jobProcessingPath}`)

    return jobId
  }
}

const finishProcessing = (jobId, status, dir) => {
  const currentPath = `${dir}/tasks/processing/${jobId}.json`

  const timestamp = new Date().toISOString()

  const resultPath = `${dir}/tasks/${status}/${jobId}-${timestamp}.json`

  renameSync(currentPath, resultPath)

  console.log(`Moved ${currentPath} to ${resultPath}`)

  return resultPath
}

const readFile = (fullPath) => {
  return readFileSync(fullPath, 'utf8')
}

const processJob = async (jobFilename, dir) => {
  const jobData = readFile(jobFilename)

  const job = JSON.parse(jobData)

  console.log(`perform ${job.process}`)

  let jobDef
  let cacheId = hashText(job.url)

  switch (job.process) {
    case 'fetch':

      let result = await cacheFeed(job.url, dir)
      console.log('Result: ', result)
      if(!result) {
        throw new Error('Unable to cache feed')
      }

      jobDef = JSON.stringify({ process: 'spider', url: job.url })

      createJob(cacheId, jobDef, dir)
      break

    case 'spider':
      spiderFeed(job.url, dir)
      break
  }
}


const spiderFeed = (url, dir) => {

  const feedHash = hashText(url)

  try {

    // Use the locally cached version of the feed
    const cachedFeed = feedJsonByHash(feedHash, dir)

    console.log(`Reading\t${url} \n from \t${dir}`)

    console.log(cachedFeed.follows)

    for (const feed of cachedFeed.follows) {
      console.log(feed[1])

      // Get the followed feeds hash
      const followedHash = hashText(feed[1])

      // Create follower link
      if (followedHash != feedHash) {
        addFollower(followedHash, feedHash, dir)
      }

      const followedCacheFile = `${dir}/feeds/${followedHash}/twtxt.txt`

      if (!fileExists(followedCacheFile)) {
        console.log('Creating process job to fetch a new feed')
        const content = { process: 'fetch', url: feed[1] }

        createJob(followedHash, JSON.stringify(content), dir)
      }

    }
    return true
  } catch (e) {
    console.log(e)
    return false
  }

}

export {
  addFollower,
  cacheFeed,
  createJob,
  dirExists,
  feedJsonByHash,
  fileExists,
  finishProcessing,
  getRandomJobId,
  hashText,
  processJob,
  readFile,
  verifyReqDirs,
}