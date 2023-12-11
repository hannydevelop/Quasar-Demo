<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px">
    <q-btn color="secondary" label="Click for Server" @click="clickServer()" />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  methods: {
    clickServer() {
      fetch(`http://localhost:1404/logout`, {
        method: "GET", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response)
        }).catch((error) => {
          console.log("Oops!", `Login verification error: ${error}`, "error");
        })
    }
  }
})
</script>
