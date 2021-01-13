<template>
  <v-snackbar v-model="show" :timeout="timeout"
              class="message" :class="`message-${type}`"
              :top="final_position.top" :bottom="final_position.bottom" :left="final_position.left" :right="final_position.right"
              :color="colors.background">
    <span class="content" :style="{color: colors.text}">
      <i class="iconfont message-icon" :style="{color: colors.text}"
        :class="{'iconyiguanzhu': type=='success', 'iconshanchu1': type=='error',
                  'iconjindianzi': type=='info', 'icontishi1': type=='warning' }"></i>
      {{text}}
    </span>

    <v-btn v-show="!hideClose"
          text :color="colors.text" min-width="24"
          @click="close">
      {{closeText}}
      <i v-show="!closeText" class="iconfont iconguanbi close"></i>
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  name: 'v-message',
  props: ["show", "type", "position", "text", "timeout", "hideClose", "closeText", "callback"],
  data() {
    return {

    }
  },
  computed: {
    colors() {
      switch (this.type) {
        case 'success':
          return { background: '#E9F8F5', text: '#1ABC9C'};
        case 'error':
          return { background: '#FDEDEC', text: '#E54C3A'};
        case 'warning':
          return { background: '#FEF5E8', text: '#F39C12'};
        default:
          return { background: '#EBF5FF', text: '#0099FF'};
      }
    },
    final_position() {
      return {
        top: this.position?this.position.includes('top'):false,
        bottom: this.position?this.position.includes('bottom'):false,
        left: this.position?this.position.includes('left'):false,
        right: this.position?this.position.includes('right'):false,
      }
    }
  },
  methods: {
    close() {
      this.show = false;
      if (this.callback) this.callback();
    }
  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
.content {
  font-size: 14px; line-height: 24px;
  i.message-icon { font-size: 24px; float: left; margin-right: 10px; }
}
i.close { font-size: 24px; }
</style>