import { existsSync, mkdirSync, readFileSync, createWriteStream, writeFileSync } from "fs"
import path from "path"
import { Readable } from "stream";

import { createHash } from 'crypto';

const reqDirs = ['logs', 'feeds', 'nicks', 'hosts/what.izzup.world', 'tasks/pending', 'tasks/processing', 'tasks/completed', 'tasks/failed']

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

    console.log(fullPath)

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


const getFH = (dir, filename) => {
    let fh

    const fullPath = path.resolve(`${dir}/${filename}`)

    try {
     fh = readFileSync(fullPath, 'utf8')
    } catch(e) {
        // The file not existing yet is an expected state for new feeds, handle other actual errors later.

        // Ensure the directory exists
        ensureDir = (dir) 

        // Create the file handle

    }
    
    return fh
}

const hashText = (txt) => {
    const hash = createHash('sha256').update(txt).digest('hex')
    return hash
}

const cacheFeed = (url, dir) => {
    // Get hash of twtxt url to use as unique ID
    const feedHash = hashText(url)

    // Full filepath
    const fullPath = path.resolve(`${dir}/feeds/${feedHash}/twtxt.txt`)

    if(! fileExists(fullPath)) {
        // Fetch the feed
        const feed = fetch(url)
        .then(resp => {
            if (resp.ok && resp.body) {
                console.log("Writing to file:", fullPath);

                // Make sure the feed cache dir exists
                ensureDir(`${dir}/feeds/${feedHash}`)
                let writer = createWriteStream(fullPath);
                Readable.fromWeb(resp.body).pipe(writer);
            }
    
        })


    }

    return fullPath
}

const addFollower = (followedHash, followerHash, dir) => {
    
    const followedDir = path.resolve(`${dir}/feeds/${followedHash}/followers/${followerHash}`)

    ensureDir(followedDir)
}

const createJob = (name, content, dir) => {
    const jobFilename = path.resolve(`${dir}/tasks/pending/${name}.job`)

    writeFileSync(jobFilename, content)
}

export {
    addFollower,
    createJob,
    dirExists,
    fileExists,
    hashText,
    cacheFeed,
    feedJsonByHash,
    verifyReqDirs
}