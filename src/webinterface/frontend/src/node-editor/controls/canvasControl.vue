<template>
    <canvas ref="nodeCanvas"></canvas>
</template>


<script>
export default {
    props: ["readonly", "emitter", "ikey", "getData", "putData", "initFunc"],
    data() {
        return {
            value: 0,
        };
    },
    methods: {
        change(e) {
            this.value = e.target.value;
            this.update();
        },
        update() {
            if (this.ikey) this.putData(this.ikey, this.value);
            this.emitter.trigger("process");
        },
    },
    mounted() {
        this.value = this.getData(this.ikey);
        const canvas = this.$refs.nodeCanvas;
        this.initFunc(canvas);
  },
};
</script>

<style>
canvas {
    width: 100%;
    height: auto;
    image-rendering: pixelated;
}
</style>
