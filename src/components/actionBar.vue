<!--
    @author qixf@thinkerx.com
    @remark 顶部栏，可添加操作按钮
    @params listen_leave Boolean 是否监听离开事件（默认false）
    @event before-leave(type) 离开事件，home 主页 back 返回
    @params action_list Array [{ "icon": "iconchexiao", "label": "撤销", "action": "undo", sm: true }]
    @params action_right_list Array [{ "icon": "iconchexiao", "action": "undo"}]
    @params hide-sm-logo 小屏下隐藏logo
    @params hide-sm-more 小屏下不显示为更多
    @event change-theme 切换主题
    @event do-action(action:object) 点击按钮操作
    @created 2020/5/28
-->
<template>
  <v-app-bar app :collapse="expand_head" height="42" class="elevation-2 action-bar">

    <!-- 顶部收缩 画图页面显示 -->
    <v-btn text @click="expand_head=!expand_head" style="margin-left: -10px;">
      <i class="iconfont" v-show="expand_head">&#xe6f6;</i>
      <i class="iconfont" v-show="!expand_head">&#xe6d0;</i>
    </v-btn>

    <v-spacer></v-spacer>

    <!-- 大屏中部 操作按钮组 -->
    <v-btn v-if="!expand_head" text class="d-sm-flex mx-1" :class="{'d-none': !action.sm}"
           v-for="(action, index) in action_list" :key="index"
           @click="bus.$emit('do-action',action)">
      <i class="iconfont" :class="action.icon"></i>
      <span class="d-none d-md-flex">{{action.label}}</span>
    </v-btn>
    <v-spacer></v-spacer>

    <!-- 小屏下的操作按钮 -->
    <template v-if="!expand_head && action_list.length && !hide_sm_more">
      <v-menu offset-y min-width="100%" nudge-bottom="12">
        <template v-slot:activator="{ on }">
          <v-btn class="d-flex d-sm-none pr-2" text v-on="on">
            <i class="iconfont" style="font-size: 22px;">&#xe742;</i>
          </v-btn>
        </template>
        <v-flex :style="{ background: $vuetify.theme.dark?'#303030':'#fff' }">
          <v-btn text v-for="(action, index) in action_list" :key="`${index}-sm`"
                 @click="bus.$emit('do-action',action)">
            <i class="iconfont baricon" :class="action.icon" style="font-size: 30px;"></i>
            <span class="d-none d-lg-flex d-xl-none d-xl-flex">{{$t(action.label)}}</span>
          </v-btn>
        </v-flex>
      </v-menu>
    </template>

    <!-- 右侧自定义操作按钮 -->
    <v-btn v-if="!expand_head" text v-for="(action,index) in action_right_list" :key="`${index}-right`"
           @click="bus.$emit('do-action',action)">
      <i class="iconfont" :class="action.icon"></i>
    </v-btn>

    <!-- 主题切换 -->
    <v-btn v-if="!expand_head" @click="changeTheme" text>
      <i class="iconfont iconkaideng" v-show="$vuetify.theme.dark"></i>
      <i class="iconfont iconguandeng" v-show="!$vuetify.theme.dark"></i>
    </v-btn>

    <!-- 全屏切换 -->
    <v-btn @click="fullScreen" v-if="!expand_head" text>
      <i class="iconfont" :class="{ 'iconfangda': !is_full, 'iconsuoxiao': is_full }"></i>
    </v-btn>

    <!-- 退出 -->
    <v-btn v-if="!expand_head" @click="leavePage('back')" text>
      <i class="iconfont iconquxiao" style="font-size: 24px;color: #f03d15;"></i>
    </v-btn>

  </v-app-bar>
</template>
<script>
export default {
  name: "action-bar",
  data() {
    return {
      expand_head: false, // 是否收起头部
      is_full: false, // 是否全屏
      action_list: [],
      action_right_list: [],
      listen_leave: false,
      hide_sm_logo: false,
      hide_sm_more: false,
    }
  },
  methods: {
    /** 离开页面 home 主页 back 返回 **/
    leavePage(type) {
      if (this.listen_leave) this.bus.$emit("before-leave",{ type });
      else
        switch (type) {
          case 'home': this.$router.push({ name: 'home' });break;
          default: this.$router.go(-1);
        }
    },
    /** 切换主题 **/
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.bus.$emit("change-theme");
    },
    /** 切换全屏 **/
    fullScreen() {
      this.is_full = !this.is_full;
      if (this.is_full) { // 进入全屏
        if (document.documentElement.RequestFullScreen) document.documentElement.RequestFullScreen();
        //兼容火狐
        if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
        //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
        if (document.documentElement.webkitRequestFullScreen) document.documentElement.webkitRequestFullScreen();
        //兼容IE,只能写msRequestFullscreen
        if (document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
      } else { // 退出全屏
        if (document.exitFullScreen) document.exitFullscreen();
        //兼容火狐
        if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        //兼容谷歌等
        if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        //兼容IE
        if (document.msExitFullscreen) document.msExitFullscreen();
      }
    },
    /** 判断是否全屏 **/
    checkFull() {
      let result = !document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (result === undefined) result = false;
      return result;
    },
  },
  computed: {
    logo(){
      let language = localStorage.getItem("language") || "zh-CN";
      if (language != "zh-CN")
        return "https://webcc-pro.thinkerx.com/imge/web_source/logo-en.png";
      else
        return "https://webcc-pro.thinkerx.com/imge/web_source/logo-zh.png";
    },
  },
  mounted() {
    // 屏幕旋转保持全屏 && 键盘事件全屏
    let self = this;
    window.onresize = ()=> {
      if (!self.checkFull() && self.is_full) self.fullScreen();
    };
    document.onkeydown = (e)=> {
      if (window.event.keyCode === 122) {
        e.preventDefault();
        self.fullScreen();
      }
    };
  }
}
</script>
<style lang="scss" scoped>
/** 修正组件样式 **/
.theme--light.v-app-bar.v-toolbar.v-sheet { background-color: #fff; }
.v-toolbar.v-toolbar--collapsed { max-width: 42px; border-bottom-right-radius: 0;}
.v-btn:not(.v-btn--round).v-size--default { text-transform: none; min-width: 20px; padding: 0 4px; }


.action-bar .iconfont {
  font-size: 20px;
}
</style>