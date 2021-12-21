<template>
<div class="resolution-control">
  <span>{{title}}:</span>
  <input type="number" :readonly="readonly" :value="value.x" placeholder="X" min="0" @input="change($event, 'x')" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>
  <input type="number" :readonly="readonly" :value="value.y" placeholder="Y" min="0" @input="change($event, 'y')" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>
</div>
</template>

<script>
export default {
  props: ["readonly", "emitter", "ikey", "title", "getData", "putData"],

  data() {
    return {
      value: 0,
    }
  },

  methods: {
    change(e, subkey){
      if (this.value == null) {
        // TODO: Fix undefined error message on initial creation of component
        this.value = {};
      }
      if (subkey) {
        this.value[subkey] = +e.target.value;
      }
      else {
        this.value = +e.target.value;
      }
      this.update();
    },
    update() {
      if (this.ikey)
        this.putData(this.ikey, this.value)
      this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}
</script>

<style>
input {
  width: 60px !important;
  margin-left: 5px;
}
.resolution-control {
  display: flex
}

span {
  align-self: center;
}
</style>


