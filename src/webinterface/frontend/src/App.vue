<template>
  <div id="app">
    <Rete/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Rete from './components/Rete.vue'
@Component({
  components: {
    Rete
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
}
</style>
