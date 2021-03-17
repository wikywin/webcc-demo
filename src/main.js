import Vue from 'vue'
import vuetify from './plugins/vuetify';
import App from './App.vue'
import router from './router'
import store from './store'
import Tools from '@/components/Tools/index';
import VueI18n from 'vue-i18n';
import cookies from 'vue-cookies';
import axios from './plugins/axios'
import bus from '@/assets/eventBus';
import GL_Component from './plugins/globalComponents';

import './static/css/reset.css';
import './static/css/vuetify-ui.css';

Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.use(require('vue-shortkey'), { prevent: ['input', 'textarea'] });
Vue.prototype.$VAlert = Tools.VAlert;
Vue.prototype.$VMessage = Tools.VMessage;
Vue.prototype.bus = bus;
Vue.use(VueI18n);
Vue.use(GL_Component);
Vue.prototype.$cookies = cookies;

import zh_cn from './static/lang/zh-cn/zh-cn';
import en_us from "./static/lang/en-us/en-us"
const i18n = new VueI18n({
    locale: 'en-US', // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
        'zh-CN': zh_cn, // 中文语言包
        'en-US': en_us // 英文语言包
    },
    silentTranslationWarn: true
});

new Vue({
  router,
  vuetify,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
