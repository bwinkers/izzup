<script setup>
import { ref, onMounted } from "vue"

const twtxt = ref();

onMounted(async () => {
  let memberTwtxt = false
  memberTwtxt = await fetch('twtxt.txt')
  // console.log(memberTwtxt)
  const asText = await memberTwtxt.text()
  // console.log(asText)
  const asJson = twtxtToJson(asText)
  twtxt.value = asJson

  // const imgUrl = new URL('../avatar.jpeg', import.meta.url).href
  // console.log('IMG URL', imgUrl)
})

const regexMeta = new RegExp("(^#.*=)")
const regexTab = new RegExp("\\t");

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

  let parts = []

  lines.forEach((line) => {
    parts = [] // reset on loop
    //console.log(line)
    // Check if comment or date.
    if(regexMeta.test(line)){
      // console.log(line)
      // Trim off first comment character
      const metaDef = line.slice(1)
      // Split on '=' 
      const [n, v] = metaDef.split("=", 2)
      const name = n.trim()
      const val = v.trim()
      // console.log(`${name} => ${val}`)
      switch(name) {
        case 'nick':
          profile.nick = val
          break
        case 'avatar':
          profile.avatar = val
          break
        case 'url':
          profile.urls.push(val)
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

    if(regexTab.test(line)){
      parts = line.split('\t')
      const postDate = new Date(parts[0])
      if(postDate.toString() != 'Invalid Date') {
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
</script>

<template>
  <div v-if="twtxt">
    <header>
      <h1>Izzup</h1>
    </header>

    <main>
      
      <img :src="twtxt.profile.avatar"> 
      
      <h2>{{ twtxt.profile.nick }}</h2>  
      <h3>Twtxt feed: <a :href="twtxt.profile.urls[0]">{{ twtxt.profile.urls[0] }}</a></h3>
      
      <h3>Links</h3>
      <ul>
        <li v-for="(link, ix) in twtxt.links" :key="ix">
          <a :href="link[1]">{{ link[0]}}</a>
        </li>
      </ul>

      <h3>Follows</h3>
      <ul>
        <li v-for="(follow, ix) in twtxt.follows" :key="ix">
          {{ follow[0]}} <a :href="follow[1]">{{follow[1]}}</a>
        </li>
      </ul>

      <h3>Tweets</h3>
      <ul>
        <li v-for="(post, ix) in twtxt.posts" :key="ix">
          <span style="font-size: .8em">{{ post[0]}}</span> {{ post[1]}}
        </li>
      </ul>
    </main>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
