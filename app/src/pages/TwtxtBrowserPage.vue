<template>
  <q-page class="flex flex-center">
    <div class="full-width">
      <q-input label="Twtxt Url" v-model="twtxtUrl"></q-input>
      <q-btn label="Open" @click="loadTwtxtUrl()" :disable="!twtxtUrl"></q-btn>
    </div>
   <div v-if="twtxtObj"><pre>{{ twtxtObj }}</pre></div>
  </q-page>
</template>

<script setup>
//
import { ref } from "vue"

const twtxtWorker = new Worker(new URL('../workers/twtxtWork.js', import.meta.url), { type: 'module' }); 

twtxtWorker.onmessage = (e) => {
  const { data } = e
  console.log(data)
  twtxtObj.value = data.feed;
} 

const twtxtUrl = ref('https://elw.sdf.org/twtxt.txt')

const twtxtObj = ref();

const loadTwtxtUrl = async () => {

  twtxtWorker.postMessage({ method: 'spiderFeed', params: { url: twtxtUrl.value } })

}
</script>
