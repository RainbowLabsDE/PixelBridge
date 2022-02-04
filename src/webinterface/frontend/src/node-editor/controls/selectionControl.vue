<template>
  <select
    :readonly="readonly"
    :value="value"
    @input="change($event)"
    @dblclick.stop=""
    @pointerdown.stop=""
    @pointermove.stop=""
  >
    <option value="" disabled selected>{{ title }}</option>
    <option
      v-for="option in selectOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.name }}
    </option>
  </select>
</template>


<script>
export default {
  props: [
    "readonly",
    "emitter",
    "ikey",
    "title",
    "selectOptions",
    "getData",
    "putData",
  ],
  data() {
    return {
      value: 0,
    };
  },
  methods: {
    change(e) {
      this.value = e.target.value;
      console.log(this.value);
      this.update();
    },
    update() {
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger("process");
    },
  },
  mounted() {
    this.value = this.getData(this.ikey);
  },
};
</script>

<style>
select,
input {
  width: 100%;
  border-radius: 30px;
  background-color: white;
  padding: 2px 6px;
  border: 1px solid #999;
  font-size: 110%;
  width: 170px;
}
</style>

