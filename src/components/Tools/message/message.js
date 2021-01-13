import Vue from 'vue';
import vMessage from './message.vue';

// 获取组件构造器
const VMessage = Vue.extend(vMessage);

let VM = '';
function createdModal(type, text, config) {
    if (!VM) {
      const oDiv = document.createElement('div');
      // 创建VMessage实例
      VM = new VMessage({ el: oDiv });
      // 并把实例化的模板插入body
      document.body.appendChild(VM.$el);
    }
    // 设置属性
    VM.type = type;
    VM.show = true;
    VM.position = config.position?config.position:'top';
    VM.text = text;
    VM.timeout = !config.timeout&&config.timeout!=0?3000:config.timeout;
    VM.hideClose = config.hideClose;
    VM.closeText = config.closeText;
    VM.callback = config.callback;
}

function warning(text, config) {
  createdModal('warning', text, config||{});
}
function info(text, config) {
  createdModal('info', text, config||{});
}
function success(text, config) {
  createdModal('success', text, config||{});
}
function error(text, config) {
  createdModal('error', text, config||{});
}
export default {
  warning,
  success,
  info,
  error
};
