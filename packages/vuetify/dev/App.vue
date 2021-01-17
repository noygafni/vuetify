<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import Playground from './Playground'

  export default {
    components: {
      Playground,
    },
  }
</script>
