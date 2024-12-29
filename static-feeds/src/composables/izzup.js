
import { blake2b } from '@noble/hashes/blake2b';
import base32Encode from 'base32-encode'
import { DateTime } from "luxon";

const useIzzup = () => {

  const fetchFeed = (url) => {
    console.log(`Fetch ${feed}`)
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

  const hashText = async (txt) => {
    const msgUint8 = new TextEncoder().encode(txt); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }

  const base32 = (payload) => {
    return base32Encode(Buffer.from(payload), 'RFC3548', { padding: false });
  }
  
  const b2params = { dkLen: 32 };

  const blake2b256 = (payload) => {
    return  blake2b(payload, b2params);
  }
  
  const formatRFC3339 = (text) => {
    return DateTime.fromISO(text, { setZone: true, zone: 'utc' })
      .toFormat("yyyy-MM-dd'T'HH:mm:ssZZ")
      .replace(/\+00:00$/, 'Z');
  }

  const twtHash = (feed, post) => {
    
  }
  

  const feature = {
    feedFetching: {
      enabled: false
    }
  }

  return {
    feature,
    hashText,
    fetchFeed,
    twtxtToJson
  }

}

export { useIzzup }