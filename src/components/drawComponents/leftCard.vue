<!--
    @author qixf@thinkerx.com
    @remark 左侧卡片
    @created 2020/5/29
-->
<template>
  <v-card class="left-card" :class="{ bottom: is_xs_screen }" :elevation="10">

    <v-tabs :vertical="!is_xs_screen" grow :height="is_xs_screen?'42px':''"
            class="elevation-2" v-model="tab_index" v-show="show">
      <v-tabs-slider color="#fff0"></v-tabs-slider>
      <!-- tabs -->
      <v-tab v-for="(item,index) in list" :key="index">
        <span v-if="is_xs_screen">{{$t(item.name)}}</span>
        <v-tooltip v-else bottom>
          <template v-slot:activator="{ on }">
            <i v-on="on" class="iconfont" :class="item.icon"></i>
          </template>
          <span>{{$t(item.name)}}</span>
        </v-tooltip>
      </v-tab>
      <!-- tabs-items -->
      <v-tabs-items v-model="tab_index">
        <v-tab-item v-for="(item,index) in list" :key="index" :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">
          <!-- 大屏 多行纵向排布 -->
          <v-row no-gutters v-if="!is_xs_screen">
            <v-col :cols="4" v-for="(tool,tool_index) in item.content" :key="tool_index" style="padding: 2px;">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-card v-on="on" flat>
                    <div class="iconfont text-center" v-if="!tool.children" :class="tool.icon" :style="tool.is_active?{'box-shadow': `2px 2px 5px ${$vuetify.theme.dark?'#000':'#ccc'}`, color: '#2196f3'}:{}"
                         @click="pickToolByMouse(tool)"></div>
                    <v-menu v-else right offset-x>
                      <template v-slot:activator="{ on }">
                        <div class="iconfont text-center" v-on="on" :class="tool.icon" :style="tool.is_active?{'box-shadow': `2px 2px 5px ${$vuetify.theme.dark?'#000':'#ccc'}`, color: '#2196f3'}:{}" ></div>
                        <i class="iconfont iconjiantou14 moretools" v-on="on" :style="tool.is_active?{color: '#2196f3'}:{}"></i>
                      </template>
                      <v-list class="list" dense>
                        <v-list-item dense
                                     class="list-item"
                                     v-for="(item, index) in tool.children"
                                     :key="index"
                                     @click="pickToolByMouse(item,tool)"
                        >
                          <v-list-item-title dense>
                            <i class="iconfont" style="font-size:20px" :class="item.icon"></i>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card>
                </template>
                <div>
                  <div>{{$t(tool.label)}}</div>
                  <div v-if="tool.tips">{{$t(tool.tips)}}</div>
                  <div v-if="!isMobileDevice">{{$t("leftmenu.qkey")}}{{tool.q_key}}</div>
                </div>
              </v-tooltip>
            </v-col>
          </v-row>

          <!-- 小屏 单行横向排布 -->
          <div class="d-flex" v-else>
            <div v-for="(tool,tool_index) in item.content" :key="tool_index" style="padding: 0 5px;">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-card v-on="on" flat>
                    <div class="iconfont text-center" :class="tool.icon"  @click="pickToolByMouse(tool)"
                         :style="tool.is_active?{'box-shadow': `2px 2px 5px ${$vuetify.theme.dark?'#000':'#ccc'}`, color: '#2196f3'}:{}"></div>
                  </v-card>
                </template>
                <div>
                  <div>{{$t(tool.label)}}</div>
                  <div v-if="tool.tips">{{$t(tool.tips)}}</div>
                  <div v-if="!isMobileDevice">{{$t("leftmenu.qkey")}}{{tool.q_key}}</div>
                </div>
              </v-tooltip>
            </div>
          </div>

        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <!-- 收起/展开 -->
    <div class="expand-arrow" :class="{ 'dark':$vuetify.theme.dark }" @click="show=!show">
      <i class="iconfont iconjiantou13" v-show="show && !is_xs_screen"></i>
      <i class="iconfont iconjiantou14" v-show="!show && !is_xs_screen"></i>
      <i class="iconfont iconjiantou12" v-show="show && is_xs_screen"></i>
      <i class="iconfont iconjiantou11" v-show="!show && is_xs_screen"></i>
    </div>
  </v-card>
</template>
<script>
  import { mapGetters, mapState } from "vuex";
  export default {
    name: 'left-card',
    data() {
      return {
        show: true,
        tab_index: 0,
        list: require('@/static/Json/drawLeftCard.json'),
        max_height: 0
      }
    },
    methods: {
      /** 用鼠标选取工具 **/
      pickToolByMouse(tool,parent=null) {
        this.list.forEach(item=> {
          item.content.forEach(data=> {
            this.$set(data, "is_active", false);
          })
        });
        if(parent){
          this.$set(parent, "is_active", true);
        }else{
          this.$set(tool, "is_active", true);
        }
        this.canvas.toolManager.takeTool(tool.action);
      },
      /** 用键盘选取工具 **/
      /** 在 draw.vue 的 handleKey 方法中通过 ref 调用 **/
      pickToolByKeyboard(tool_text) {
        // 选中相应的工具及其所属tab
        this.list.forEach((item,index)=> {
          item.content.forEach(data=> {
            this.$set(data, "is_active", data.action === tool_text);
            if (data.is_active) this.tab_index = index;
          })
        })
      },
      /** 根据屏幕高度，计算左侧菜单最大高度 **/
      renderResize() {
        this.max_height = document.documentElement.clientHeight - 90;
      }
    },
    computed: {
      is_xs_screen() {
        let break_point = this.$vuetify.breakpoint.name;
        if (break_point === 'xs') return true;
        else return false;
      },
      ...mapGetters(["isMobileDevice"]),
      ...mapState(["canvas"])
    },
    mounted() {
      this.renderResize();
      window.addEventListener("resize", this.renderResize, false);
    }
  }
</script>
<style lang="scss" scoped>
  .left-card {
    position: fixed; left: 0; z-index: 1;
    max-width: 200px;
    background-color: #fff0 !important;
    .v-tab {
      min-width: 42px; max-width: 42px;
      min-height: 42px; max-height: 42px;
      background-color: #fff0 !important;
      .iconfont { font-size: 24px; }
    }
    .v-tabs-items {
      width: 158px;
      border-left: 1px solid #dddddd;
      background-color: #fff0 !important;
      .iconfont { font-size: 30px; }
      .moretools{
        font-size: 12px;
        position: absolute;
        // top: 15px;
        right: 0;
        bottom: 0;
      }
    }
    /** 收起/展开 箭头 **/
    .expand-arrow {
      position: absolute; top: 0; right: -20px;
      background: rgba(255, 255, 255, 0.6);
      color: #333333;
      border-radius: 0 30px 30px 0 !important;
      height: 62px;
      width: 20px;
      box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
      line-height: 62px;
      text-indent: -5px;
      i { font-size: 30px; }
      &.dark {
        background: rgba(30, 30, 30, 0.6);
        color: #ddd;
      }
    }
    /** 透明效果 **/
    .v-card { background-color: #fff0 !important; }
    .theme--light .v-tabs>.v-tabs-bar { background-color: #fff0 !important; }
    /** 小屏底部 **/
    &.bottom {
      bottom: 24px; max-width: 100%; width: 100%;
      .v-tab { min-width: inherit; max-width: inherit; }
      .v-tabs-items {
        width: 100%;
        border-top: 1px solid #dddddd; border-left: none;
        .iconfont { padding: 0 5px; }
      }
      .expand-arrow {
        top: -20px; right: calc(50% - 31px);
        width: 62px; height: 20px;
        line-height: 20px; text-align: center; text-indent: 0;
        border-radius: 10px 10px 0 0 !important;
      }
    }
  }
  /** tooltip **/
  .v-tooltip__content {
    font-size: 12px;
    padding: 2px 4px;
  }
</style>