<template>
  <v-app id="app" :dark="$vuetify.theme.dark">
    <div style="height: 42px;background:#f8f9fb">
      <action-bar v-if="show_action_bar" ref="action_bar"></action-bar>
    </div>
    <router-view :style="home_style" />
  </v-app>
</template>
<script>
import ActionBar from "@/components/actionBar.vue";

export default {
  name: "App",
  data() {
    return {

    };
  },
  components: { ActionBar },
  computed: {
    is_small_screen() {
      return this.$store.getters.is_small_screen(this.$vuetify);
    },
    home_style() {
      if (this.show_action_bar) return { top: "42px", height: "calc(100% - 42px)" };
      else return {};
    },
    show_action_bar() {
      let show_router_key = ["draw"];
      let router_name = this.$route.name;
      if (!router_name) return false;
      let result = false;
      show_router_key.forEach(item => {
        if (router_name.includes(item)) result = true;
      });
      return result;
    },
  },
  methods: {
  },
  mounted() {
  }
}
</script>
<style lang="scss">

</style>
