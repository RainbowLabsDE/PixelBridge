<template>
    <div id="app">
      <Rete/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
  import Rete from './components/Rete.vue';

export default defineComponent({
  name: 'App',
  components: {
    Rete
  }
});
</script>

<style>
#app {
}
</style>
