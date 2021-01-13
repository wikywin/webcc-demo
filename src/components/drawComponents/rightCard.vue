<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片
    @created 2020/6/1
-->
<template>
  <v-card class="right-card" :elevation="10">

    <v-tabs vertical class="elevation-2" v-model="tab_index">
      <v-tabs-slider color="#fff0"></v-tabs-slider>
      <!-- tabs -->
      <v-tab v-for="(item,index) in list" :key="index" v-show="item.show" @click="changeTab(item.key)">
        <span>{{$t(item.name)}}</span>
      </v-tab>
      <!-- tabs-items -->
      <v-tabs-items v-model="tab_index" v-show="show">
        <!-- 图纸 -->
        <!--<v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">-->
          <!--<paper ref="paper_list" @update-order="updateOrder" @set-paper-list="setPaperList"></paper>-->
        <!--</v-tab-item>-->
        <!-- 订单 -->
        <!--<v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">-->
          <!--<order-info v-if="canvas" ref="order_info" :paper-list="paper_list"></order-info>-->
        <!--</v-tab-item>-->
        <!-- 颜色 -->
        <v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">
          <color v-if="canvas" ref="color"></color>
        </v-tab-item>
        <!-- 外框 -->
        <v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">
          <outer-frame v-if="canvas" ref="outer_frame"></outer-frame>
        </v-tab-item>
        <!-- 开扇 -->
        <v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">
          <window v-if="canvas" ref="window"></window>
        </v-tab-item>
        <!-- 五金 -->
        <v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">
          <hardware v-if="canvas" ref="hardware"></hardware>
        </v-tab-item>
        <!-- 玻璃 -->
        <!--<v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">-->
          <!--<glass v-if="canvas" ref="glass"></glass>-->
        <!--</v-tab-item>-->
        <!-- 其他 -->
        <v-tab-item eager :style="{ maxHeight: `${max_height}px`, overflow: 'auto' }">
          <other v-if="canvas" ref="other"></other>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <!-- 收起/展开 -->
    <div class="expand-arrow" :class="{ 'dark':$vuetify.theme.dark }"
         @click="show=!show">
      <i class="iconfont iconjiantou14" v-show="show"></i>
      <i class="iconfont iconjiantou13" v-show="!show"></i>
    </div>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import OrderInfo from './orderInfo.vue';
import Color from './color.vue';
import OuterFrame from './outerFrame.vue';
import Window from './window.vue';
import Hardware from './hardware.vue';
import Glass from './glass.vue';
import Other from './other.vue';
import Paper from './paper.vue';
export default {
  name: 'right-card',
  data() {
    return {
      show: false,
      tab_index: 0,
      list: [
        // { "name": "rightmenu.paper.paper", "show": true, "fixed": true, "key": "paper_list" },
        // { "name": "rightmenu.dingdanxinxi.dingdanxinxi", "show": true, "fixed": true, "key": "order_info" },
        { "name": "rightmenu.yanse.yanse", "show": true, "fixed": true, "key": "color" },
        { "name": "rightmenu.waikuang.waikuang", "show": false, "fixed": false, "key": "outer_frame" },
        { "name": "rightmenu.kaishan.kaishan", "show": false, "fixed": false, "relation": "hardware&window", "key": "window" },
        { "name": "rightmenu.wujin.wujin", "show": false, "fixed": false, "relation": "hardware&window", "key": "hardware" },
        // { "name": "rightmenu.boli.boli",  "show": true, "fixed": true, "key": "glass" },
        { "name": "rightmenu.other.other", "show": false, "fixed": false, "key": "other" },
      ],
      max_height: 0,
      paper_list: [], // 订单列表
      ref_list: ["color", "outer_frame", "window", "hardware", "other"]
    }
  },
  methods: {
    /** 根据屏幕高度，计算左侧菜单最大高度 **/
    renderResize() {
      this.max_height = document.documentElement.clientHeight - 90;
    },
    /** 清除各tab页数据 **/
    clearTabItemData() {
      this.ref_list.forEach(name=> {
        if (this.$refs[name].dataInitialization)
            this.$refs[name].dataInitialization();
      })
    },
    /** 手动、编码 选中tab，更改tab显示/隐藏 **/
    changeTab(tab_key) {
      // 将右侧 tab 展开
      this.show = true;
      let tab = this.list.filter(item=> { return item.key == tab_key; })[0];
      let relation = tab.relation;
      let tab_index = 0;
      this.list.forEach((item, index) => {
        if (item.fixed) item.show = true;
        else if (item.key === tab.key) { item.show = true; tab_index = index; }
        else if (item.relation === relation && relation) item.show = true;
        else item.show = false;
      });
      this.tab_index = tab_index;
    },
    /** 构架各个组件要提交的数据 **/
    buildSaveData() {
      // 订单信息
      // let order_info = this.$refs["order_info"].order_info;
      // 颜色信息
      let color = this.$refs["color"].color_final;
      // 玻璃信息
      // let glass_data = this.$refs["glass"].glass;
      // 五金信息
      // let hardware_data = this.$refs["hardware"].hardware_final;

      // return {
      //   ...order_info, color,
      //   attr_data: { glass_data, hardware_data }
      // };
      return { ...color };
    },
    /** 获取 paper 中的订单列表 **/
    setPaperList(list) {
      this.paper_list = list;
    },
    /** 获取已保存的订单详情，分配至各个组件 **/
    updateOrder(order_data) {
      // 画图
      // this.canvas.shapeManager.openFile(order_data.drawing_data, true);
      // 订单
      // this.$refs["order_info"].rewriteData(order_data);
      // 颜色
      this.$refs["color"].rewriteData(order_data);
      // 玻璃
      // this.$refs["glass"].rewriteData(order_data);
      // 五金
      // this.$refs["hardware"].rewriteData(order_data);
    }
  },
  computed: {
    is_dirty: {  // 判断数据是否有更改
      get() {
        // 可用于调试，看哪个组件有修改
        // console.log({
        //   order_info: this.$refs["order_info"].is_dirty,
        //   color: this.$refs["color"].is_dirty,
        //   glass: this.$refs["glass"].is_dirty,
        //   hardware: this.$refs["hardware"].is_dirty,
        //   windoor_type_info:this.$refs["windoor_type_info"].is_dirty
        // });
        return this.$refs["color"].is_dirty ||
          this.$refs["hardware"].is_dirty;
      },
      set(value) {
        this.$refs["color"].is_dirty = value;
        this.$refs["hardware"].is_dirty = value;
      }
    },
    ...mapState(["canvas"])
  },
  mounted() {
    this.renderResize();
    window.addEventListener("resize", this.renderResize, false);
  },
  components: { OrderInfo, Color, OuterFrame, Window, Hardware, Glass, Other, Paper }
}
</script>
<style lang="scss" scoped>
.right-card {
  position: fixed; right: 0; z-index: 1;
  max-width: 282px;
  background-color: #fff0 !important;
  .v-tab {
    min-width: 42px; max-width: 42px;
    min-height: 42px; max-height: 42px;
    background-color: #fff0 !important;
    .iconfont { font-size: 24px; }
  }
  .v-tabs-items {
    width: 240px;
    border-left: 1px solid #dddddd;
    background-color: #fff0 !important;
    .iconfont { font-size: 30px; }
  }
  /** 收起/展开 箭头 **/
  .expand-arrow {
    position: absolute; top: 0; left: -20px;
    background: rgba(255, 255, 255, 0.6);
    color: #333333;
    border-radius: 30px 0 0 30px !important;
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
}
</style>