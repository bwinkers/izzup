<template>
  <v-layout class="rounded rounded-md">
    <template v-if="twtxt">
      <v-navigation-drawer>
        <v-list>
          <v-list-item :title="twtxt.profile.nick"></v-list-item>
          <v-list-item><img :src="twtxt.profile.avatar" </v-list-item>
            <v-list-item>
              <div class="font-weight-bold">Links</div>
              <!-- <v-list> -->
              <v-list-item v-for="item, ix in twtxt.links" :key="ix">
                <a :href="item[1]">{{ item[0] }}</a>
              </v-list-item>
              <!-- </v-list>  -->
            </v-list-item>
            <v-list-item>
              <div class="font-weight-bold">Follows</div>
              <!-- <v-list> -->
              <v-list-item v-for="item, ix in twtxt.follows" :key="ix">
                <a v-if="izzup.feature.feedFetching.enabled" :href="`/feed/?url=${item[1]}`">{{ item[0] }}</a>
                <a v-else :href="item[1]">{{ item[0] }}</a>
              </v-list-item>
              </v-list> 
            </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar :title="twtxt.profile.tagline"></v-app-bar>

      <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
        <div class="d-flex flex-column v-col-12 ga-2 pa-4">
              <v-card v-for="item, ix in twtxt.posts" :key="ix" class="align-end pa-2 rounded w-100">
                <v-card-subtitle>
                  {{ item[0] }}
                </v-card-subtitle>
                <v-card-item>
                  {{  item[1] }}
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

import { useIzzup } from "../composables/izzup.js"

const izzup = useIzzup();

const route = useRoute();

const member = route.path.split('/')[1].length;

const twtxtUrl = member ? `https://what.izzup.world/${member}/twtxt.txt` : '/twtxt.txt';

const twtxt = ref();


onMounted(async () => {
  let memberTwtxt = false
  memberTwtxt = await fetch(twtxtUrl)
  console.log(memberTwtxt)
  const asText = await memberTwtxt.text()
  console.log(asText)
  const asJson = izzup.twtxtToJson(asText)
  twtxt.value = asJson
})

</script>
