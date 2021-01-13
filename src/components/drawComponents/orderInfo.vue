<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 订单信息
    @created 2020/6/1
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid v-model="shape_manager" style="min-height: 280px;">
        <!-- 窗号 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.window_no")}}</span>
          <v-text-field outlined single-line v-model="order_info.window_no"></v-text-field>
        </v-row>
        <!-- 系列 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.xilie")}}</span>
          <v-text-field outlined single-line v-model="order_info.product_name"></v-text-field>
        </v-row>
        <!-- 总宽 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.zongkuan")}}</span>
          <v-text-field outlined single-line v-model.number="order_info.width.toFixed(2)" disabled suffix="mm"></v-text-field>
        </v-row>
        <!-- 总高 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.zonggao")}}</span>
          <v-text-field outlined single-line v-model.number="order_info.height.toFixed(2)" disabled suffix="mm"></v-text-field>
        </v-row>
        <!-- 面积 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.area")}}</span>
          <v-text-field outlined single-line v-model.number="order_info.area.toFixed(2)" disabled suffix="㎡"></v-text-field>
        </v-row>
        <!-- 樘数 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.tangshu")}}</span>
          <v-text-field outlined single-line v-model.number="order_info.count" @change="setArea"></v-text-field>
        </v-row>
        <!-- 单价 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.danjia")}}</span>
          <v-text-field outlined single-line v-model.number="order_info.price" persistent-hint
                        :hint="`${$t('order_list.money')}=${$t('rightmenu.dingdanxinxi.danjia')}*${$t('rightmenu.dingdanxinxi.area')}`"
          ></v-text-field>
        </v-row>
        <!-- 安装位置 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.install_position")}}</span>
          <v-text-field outlined single-line v-model="order_info.install_position"></v-text-field>
        </v-row>
        <!-- 备注 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.dingdanxinxi.beizhu")}}</span>
          <v-textarea rows="3" outlined single-line no-resize v-model="order_info.note"></v-textarea>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    list:[],
    order_info: {
      window_no: "",
      count: 1,
      price: "",
      height: 0,
      area: 0,
      width: 0,
      product_name: "",
      install_position:"",
      note: ""
    },
    origin_order_info: null,
  }),
  props: {
    paperList: { type: Array, default: ()=> { return []; }}
  },
  methods: {
    /** 更改樘数，重新计算面积 **/
    setArea() {
      this.order_info.area = Number((this.canvas.shapeManager.area * this.order_info.count).toFixed(2));
    },
    /** 重新赋值 **/
    rewriteData(order_data) {
      for (let key in this.order_info) {
        this.order_info[key] = order_data[key];
      }

      this.origin_order_info = JSON.stringify(this.order_info);
    },
    /** 清除 数据初始化 **/
    dataInitialization() {
      Object.assign(this.order_info, {
        height: 0, width: 0, area: 0,
        window_no: `C${this.paperList.length+1}`
      });
      this.origin_order_info = JSON.stringify(this.order_info);
    },
  },
  watch: {
    paperList() {
      if (this.$route.query.order_id) return;
      this.order_info.window_no = `C${this.paperList.length+1}`;
      this.origin_order_info = JSON.stringify(this.order_info);
    }
  },
  computed: {
    shape_manager: {
      get() {
        // 画布未创建，返回空对象
        if (!this.canvas) return {};

        let result = this.canvas.shapeManager;
        // 获取长、宽、面积
        this.order_info.height = Number(result.height.toFixed(2));
        this.order_info.width = Number(result.width.toFixed(2));
        this.order_info.area = Number((result.area * this.order_info.count).toFixed(2));
        return result;
      },
      set() {}
    },
    is_dirty: {
      get() {
        return this.origin_order_info !== JSON.stringify(this.order_info);
      },
      set(value) {
        if (value) this.origin_order_info = null;
        else this.origin_order_info = JSON.stringify(this.order_info);
      }
    },
    ...mapState(["canvas"])
  },
  mounted() {
    // 从开始设计进入，默认窗号为C1
    if (!this.$route.query.contract_id) this.order_info.window_no = "C1";
    this.origin_order_info = JSON.stringify(this.order_info);
  }
};
</script>
<style scoped lang="scss">
@import "./common.css";
</style>
