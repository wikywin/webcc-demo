<template>
  <v-alert :type="type" :icon="icon" v-if="show">
    <strong v-if="!callback">{{text}}</strong>
    <strong @click="onclick()" v-if="callback">{{text}}</strong>
  </v-alert>
</template>

<script>
export default {
  props: ["show", "text", "type", "icon", "callback"],
  methods: {
    onclick() {
      if (this.callback) this.callback();
    }
  }
};
</script>

<style>
.v-alert {
  position: fixed;
  left: 50%;
  top: 30%;
  z-index: 1999;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.success {
  background: #4caf50 !important;
}
.info {
  background: #2196f3 !important;
}
.warning {
  background: #ffc107 !important;
}
.error {
  background: #ff1744 !important;
}
</style>
