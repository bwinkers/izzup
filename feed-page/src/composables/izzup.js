const useIzzup = () =>  {

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
                parts = val.split(' ')
                links.push(parts)
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

      const feature = {
        feedFetching: {
            enabled: false
        }
    }

    return { 
        feature,
        fetchFeed, 
        twtxtToJson }

}

export {  useIzzup }