<template>
  <v-layout class="rounded rounded-md">
    <template v-if="twtxt">
      <v-navigation-drawer>
        <v-list>
          <v-list-item variant="elevated" :title="twtxt.profile.nick"></v-list-item>
          <v-list-item variant="elevated" :slim="true"><img :src="twtxt.profile.avatar" </v-list-item>
        </v-list>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start" cols="4">
                    Links
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item v-for="item, ix in twtxt.links" :key="ix">
                  <a :href="item[1]">{{ item[0] }}</a>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start" cols="4">
                    Follows
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item v-for="item, ix in twtxt.follows" :key="ix">
                  <a :href="`/?url=${item[1]}`">{{ item[0] }}</a>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-navigation-drawer>

      <v-app-bar><div class="text-h4 px-5 font-italic">{{ twtxt.profile.tagline ? twtxt.profile.tagline : remoteFeed ? remoteFeed : `${twtxt.profile.nick} Feed` }}</div></v-app-bar>

      <v-main class="d-flex justify-center" style="min-height: 600px;">
        <div class="d-flex flex-column v-col-12 ga-2 pa-4">
          <v-card v-for="item, ix in twtxt.posts" :key="ix" class="align-end pa-2 rounded w-100">
            <v-card-subtitle>
              {{ item[0] }}
            </v-card-subtitle>
            <v-card-item>
              <vue-markdown :source="item[1]" />
            </v-card-item>
          </v-card>
        </div>
      </v-main>
    </template>
    <template v-else>
      Loading...
    </template>
  </v-layout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

import VueMarkdown from 'vue-markdown-render'

import { useIzzup } from "../composables/izzup.js"

const izzup = useIzzup()

const route = useRoute()

const member = route.path.split('/')[1]
const remoteFeed = route.query.url

console.log('member', member)
console.log('remoteFeed', remoteFeed)

let cacheId

const twtxt = ref()


onMounted(async () => {

  if(remoteFeed)  {
    cacheId = await izzup.hashText(remoteFeed)
  }

  const twtxtUrl = member ? 'twtxt.txt' : remoteFeed ? `cache/${cacheId}/twtxt.txt` : '/twtxt.txt'

  console.log('twxtxtUrl', twtxtUrl)


  let memberTwtxt = false
  memberTwtxt = await fetch(twtxtUrl)
  console.log(memberTwtxt)
  const asText = await memberTwtxt.text()
  console.log(asText)
  const asJson = izzup.twtxtToJson(asText)
  twtxt.value = asJson
})

</script>
