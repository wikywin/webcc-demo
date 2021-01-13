import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false, 
    themes: {
      light: {
        primary: '#0077ff',
        secondary:  "#1B7AF8",//colors.blue.lighten4
        accent: '#3f51b5',
        error: colors.red.accent3,
        info: colors.blue.base,
        success: colors.green.base,
        warning: colors.amber.base
      },
      dark: {
        primary: '#0077ff',
        accent: colors.grey.darken4
      }
    }
  }
});
