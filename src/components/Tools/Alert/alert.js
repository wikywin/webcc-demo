import Vue from 'vue';
import vAlert from './alert.vue';

// 获取组件构造器
const VAlert = Vue.extend(vAlert);
 
function AModal() {
  let VM = '';
  return function(type, text, icon,callback) {
    if (!text) return;
    if (!VM) {
      const oDiv = document.createElement('div');
      // 创建VAlert实例
      VM = new VAlert({ el: oDiv });
      // 并把实例化的模板插入body
      document.body.appendChild(VM.$el);
    }
    // 设置属性
    VM.type = type;
    VM.text = text;
    VM.icon = icon;
    VM.callback = callback;
    
    VM.show = true;
    setTimeout(() => {
      VM.show = false;
    }, 3000);
  };
}

let SHOW = AModal();

function warning(v,callback) {
  SHOW('warning', v, 'fa-question-circle',callback);
}
function info(v,callback) {
  SHOW('info', v, 'fa-info-circle',callback);
} 
function success(v,callback) {
  SHOW('success', v, 'fa-check-circle',callback);
}
function error(v,callback) {
  SHOW('error', v, 'fa-times-circle',callback);
}
export default {
  warning,
  success,
  info,
  error
};
