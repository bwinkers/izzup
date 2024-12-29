<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Application bar"></v-app-bar>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      Main Content
    </v-main>
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
