<template>
  <div id="app">
    <TitleBar />
    <Rete />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Rete from './components/Rete.vue'
import TitleBar from './TitleBar.vue'
@Component({
  components: {
    Rete,
    TitleBar
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

body {
  margin: 0;
  background: #1c1c1c;
}
</style>
