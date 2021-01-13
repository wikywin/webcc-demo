<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 五金
    @created 2020/6/12
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <!-- 色卡选择 -->
        <v-row class="input-row">
          <span class="label">{{$t("rightmenu.color.color")}}</span>
          <v-text-field outlined single-line v-model.number="color" readonly>
            <template v-slot:append>
              <v-menu v-model="show_color" top nudge-bottom="105" nudge-left="16"
                      :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <!-- 选择色块示例 -->
                  <div :style="color_block_style" v-on="on" />
                </template>
                <!-- 颜色选择器 -->
                <v-card>
                  <v-color-picker flat class="mx-auto" width="180px"
                                  v-model="color" mode.sync="hexa" :hide-mode-switch="true"
                                  @input="pickColor">
                  </v-color-picker>
                </v-card>
              </v-menu>
            </template>
          </v-text-field>
        </v-row>
        <!-- 自定义 颜色 -->
        <!--<v-row class="input-row">-->
          <!--<div class="label">-->
            <!--<v-checkbox v-model="is_custom_color"></v-checkbox>-->
          <!--</div>-->
          <!--<v-text-field outlined single-line v-model="hardware.custom_color"-->
                        <!--:disabled="!is_custom_color" :placeholder="$t('rightmenu.color.custom_color')"></v-text-field>-->
        <!--</v-row>-->
        <!-- 自定义 规格 -->
        <!--<v-row class="input-row">-->
          <!--<span class="label">{{$t("rightmenu.wujin.guige")}}</span>-->
          <!--<v-text-field outlined single-line v-model="hardware.productName" @input="inputProduct"></v-text-field>-->
        <!--</v-row>-->
        <!--执手图片列表 -->
        <v-row class="pic-row">
          <v-col v-for="(product, index) in product_list" :key="index" :cols="6">
            <v-card flat class="pic-card" tile @click="selectProduct(product)">
              <v-img :src="product.pic" min-width="75" max-width="75" max-height="75" min-height="75"></v-img>
              <div class="pic-desc">{{ product.name }}</div>
              <i class="iconfont iconxuanze1 chosen" v-if="product.is_active"></i>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    show_color: false,
    color: "",
    product_list: [
      {
        id: "1", name: "执手1", is_active: true,
        pic: require("@/static/images/hardware/pic/2.jpg")
      },
      {
        id: "2", name: "执手2", is_active: false,
        pic: require("@/static/images/hardware/pic/3.jpg")
      },
      {
        id: "3", name: "执手3", is_active: false,
        pic: require("@/static/images/hardware/pic/4.jpg")
      },
      {
        id: "4", name: "执手4", is_active: false,
        pic: require("@/static/images/hardware/pic/5.jpg")
      },
      {
        id: "5", name: "执手5", is_active: false,
        pic: require("@/static/images/hardware/pic/6.jpg")
      },
      {
        id: "6", name: "执手6", is_active: false,
        pic: require("@/static/images/hardware/pic/2.jpg")
      },
      {
        id: "7", name: "执手7", is_active: false,
        pic: require("@/static/images/hardware/pic/3.jpg")
      },
      {
        id: "8", name: "执手8", is_active: false,
        pic: require("@/static/images/hardware/pic/4.jpg")
      },
      {
        id: "9", name: "执手9", is_active: false,
        pic: require("@/static/images/hardware/pic/5.jpg")
      }
    ],
    is_custom_color: false,
    hardware: {
      color: "", // 颜色
      custom_color: "", // 自定义颜色
      productName: "执手1",  // 规格
    },
    origin_hardware: null,
  }),
  methods: {
    /** 选择规格 **/
    selectProduct(product) {
      this.product_list.forEach(item=> {
        item.is_active = false;
      });
      product.is_active = true;
      this.hardware.productName = product.name;
    },
    /** 输入规格 **/
    inputProduct(value) {
      this.product_list.forEach(item=> {
        item.is_active = item.name == value;
      })
    },
    /** 选择颜色 **/
    pickColor(color) {
      this.canvas.shapeManager.handleColor = color;
    },
    /** 重新赋值 **/
    rewriteData(order_data) {
      let hardware_data = order_data.hardware_data;
      for (let key in this.hardware) {
        // 兼容旧逻辑
        if (key === "color" && hardware_data["color"] && hardware_data["color"].includes("custom-")) {
          this.hardware.custom_color = hardware_data["color"].split("custom-")[1];
        } else if (key === "custom_color" && this.hardware.custom_color) {

        } else this.hardware[key] = hardware_data[key];
      }
      if (this.hardware.custom_color) this.is_custom_color = true;
      this.product_list.forEach(item=> {
        item.is_active = item.name == this.hardware.productName;
      });
      this.origin_hardware = JSON.stringify(this.hardware_final);
    },
    /** 清除 数据初始化 **/
    dataInitialization() {
      this.hardware.productName = this.product_list[0].name;
      this.hardware.custom_color = '';
      this.is_custom_color = false;
      this.product_list.forEach((item,index)=> {
        item.is_active = !index;
      });
      this.origin_hardware = JSON.stringify(this.hardware_final);
    },
  },
  computed: {
    color_block_style() {
      return {
        backgroundColor: this.color,
        cursor: "pointer",
        height: "20px",
        width: "20px",
        borderRadius: this.show_color ? "50%" : "4px",
        position: "relative",
        top: "4px",
        right: "0px",
        transition: "border-radius 200ms ease-in-out"
      };
    },
    hardware_final() {
      let hardware_data = JSON.parse(JSON.stringify(this.hardware));
      if (!this.is_custom_color) hardware_data.custom_color = '';
      return hardware_data;
    },
    is_dirty: {
      get() {
        return this.origin_hardware !== JSON.stringify(this.hardware_final);
      },
      set(value) {
        if (value) this.origin_hardware = null;
        else this.origin_hardware = JSON.stringify(this.hardware_final);
      }
    },
    ...mapState(["canvas"])
  },
  mounted() {
    this.color = this.canvas.shapeManager.handleColor;
    this.hardware.color = this.color;
    this.origin_hardware = JSON.stringify(this.hardware_final);
  }
};
</script>

<style scoped lang="scss">
@import "./common.css";
//图片部分样式
.pic-row {
  margin-right: 0; margin-top: 10px;
  .v-card { background-color: #fff0 !important; }
  .col-6 { padding: 6px 0; }
  .pic-card {
    width: 97px;height: 132px;
    border: 1px solid #dddddd;
    position: relative;
    .v-image { margin: 10px auto 0; }
    .pic-desc {
      height: 36px;
      margin-top: 10px;
      padding: 0 10px;
      text-align: center;
      line-height: 14px;
    }
    .chosen {
      position: absolute; top: 12px; right: 0;
      color: #38c088;
      font-size: 45px;
    }
  }
}
</style>