<template>
  <input
    type="number"
    :readonly="readonly"
    :value="value"
    :placeholder="ikey"
    :min="min"
    :max="max"
    :step="step"
    @input="change($event)"
    @dblclick.stop=""
    @pointerdown.stop=""
    @pointermove.stop=""
    @wheel.stop=""
  />
</template>

<script>
export default {
  props: ["readonly", "emitter", "ikey", "onChange", "getData", "putData", "min", "max", "step"],

  data() {
    return {
      value: 0,
    }
  },

  methods: {
    change(e){
      this.value = +e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.value)
      }
      this.emitter.trigger('process');
      if (this.onChange) {
        this.onChange(this.value);
      }
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}
</script>

<style>
</style>


