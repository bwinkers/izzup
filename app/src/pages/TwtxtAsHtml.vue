<template>
  <div class="bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Fetching member's twtxt...
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>
      <div class="full-width justify-left text-left align-left">
      Twtxt:
      <pre>
      {{ twtxt }}
    </pre>
  </div>

      <!-- <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

const route = useRoute();

const member = route.path.split('/')[1];

console.log(member);

const twtxt = ref();

onMounted(async () => {
  let memberTwtxt = false
  memberTwtxt = await fetch(`https://www.localhost:9443/${member}/twtxt.txt`)
  const asText = await memberTwtxt.text()
  console.log(asText)
  const asJson = twtxtToJson(asText)
  twtxt.value = asJson
})

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

  console.log(txt)
  const lines = txt.split('\n')
  console.log(lines)

  const regexMeta = new RegExp("(^#.*=)")
  const regexTab = new RegExp("\\t");

  let parts = []

  lines.forEach((line) => {
    parts = [] // reset on loop
    //console.log(line)
    // Check if comment or date.
    if(regexMeta.test(line)){
      console.log(line)
      // Trim off first comment character
      const metaDef = line.slice(1)
      // Split on '=' 
      const [n, v] = metaDef.split("=", 2)
      const name = n.trim()
      const val = v.trim()
      console.log(`${name} => ${val}`)
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
      posts.push(parts)
    }

    

    // Comments get checked for meta and dates are posts.
    // Ignore everything else.

    // Check if line is Meta, a comment with a "name = value" pair.
    // If meta type is nick, avatar, or url[s], add to profile.

    // If meta link, add to links array.

    // If meta follow, add to follows array.

    // If post/tweet, add to posts array.

  })

  
  return {
    profile: profile,
    links: links,
    follows: follows,
    posts: posts
  }
}




</script>
