<template>
  <div id="rete" v-show="visible" ref="rete"></div>
</template>

<script>
import init from "../node-editor";
export default {
  data() {
    return {
      visible: true
    };
  },
  methods: {
  },
  mounted() {
	init(this.$refs.rete);  
  }
};
</script>

<style>
#rete {
  width: 100%;
  height: 100vh;
}
.node .control input, .node .input-control input {
  width: 140px;
}
select, input {
  width: 100%;
  border-radius: 30px;
  background-color: white;
  padding: 2px 6px;
  border: 1px solid #999;
  font-size: 110%;
  width: 170px;
}

/* TODO: get rid of !importants */

:root {
  --color-frame: #bae1a8;
  --color-framearr: #4c8a2f;
  --color-rawpixelsarr: #21e9ce;
  --color-number: #73A8DC;
  --color-text: lightgrey;
  --color-resolution: lightcoral;
}

.socket.frame {
  background: var(--color-frame) !important;
}

.socket.framearr {
  background: var(--color-framearr) !important;
}

.socket.rawpixelsarr {
  background: var(--color-rawpixelsarr) !important;
}

.socket.number {
  background: var(--color-number) !important;
}

.socket.text {
  background: var(--color-text) !important;
}

.socket.resolution {
  background: var(--color-resolution) !important;
}

.socket.anyimage {
  background: linear-gradient(
    135deg,
    var(--color-frame) 0, 
    var(--color-frame)        37%, 
    var(--color-framearr)     37%, 
    var(--color-framearr)     63%, 
    var(--color-rawpixelsarr) 63%
  ) !important;
}

.node.preview-output {
    min-width: 320px !important;
}

</style>