import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    canvas: null
  },
  mutations: {
    setCanvas(state, data) {
      state.canvas = data
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isMobileDevice() {//判断当前设备是否为移动端
      const ua = navigator.userAgent.toLowerCase();
      const t1 = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          ua
      );
      const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
      return t1 || t2;
    },
    isMobilePhone() {//判断当前设备是手机
      const ua = navigator.userAgent.toLowerCase();
      const t1 = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          ua
      );
      // const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
      return t1 ;
    },
    isIOS() {
      const ua = navigator.userAgent;
      return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    is_small_screen: () => (vuetify) => {
      switch (vuetify.breakpoint.name) {
        case 'xs':
            return true;
        case 'sm':
            return true;
        case 'md':
            return false;
        case 'lg':
            return false;
        case 'xl':
            return false;
      }
    },
  }
})
