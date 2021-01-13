<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 颜色
    @created 2020/6/1
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <!-- 色卡选择 -->
        <!--<v-row class="input-row">-->
          <!--<span class="label">{{$t("rightmenu.color.color")}}</span>-->
          <!--<v-text-field outlined single-line v-model.number="color" readonly>-->
            <!--<template v-slot:append>-->
              <!--<v-menu v-model="show_color" top nudge-bottom="105" nudge-left="16"-->
                      <!--:close-on-content-click="false">-->
                <!--<template v-slot:activator="{ on }">-->
                  <!--&lt;!&ndash; 选择色块示例 &ndash;&gt;-->
                  <!--<div :style="color_block_style" v-on="on" />-->
                <!--</template>-->
                <!--&lt;!&ndash; 颜色选择器 &ndash;&gt;-->
                <!--<v-card>-->
                    <!--<v-color-picker flat class="mx-auto" width="180px"-->
                                    <!--v-model="color" mode.sync="hexa" :hide-mode-switch="true"-->
                                    <!--@input="pickColor">-->
                    <!--</v-color-picker>-->
                <!--</v-card>-->
              <!--</v-menu>-->
            <!--</template>-->
          <!--</v-text-field>-->
        <!--</v-row>-->
        <!-- 自定义颜色 -->
        <!--<v-row class="input-row">-->
          <!--<div class="label">-->
            <!--<v-checkbox v-model="is_custom"></v-checkbox>-->
          <!--</div>-->
          <!--<v-text-field outlined single-line v-model="custom_color"-->
                        <!--:disabled="!is_custom" :placeholder="$t('rightmenu.color.custom_color')"></v-text-field>-->
        <!--</v-row>-->
        <v-row class="input-row">
          <div class="label">内/外色</div>
          <v-switch v-model="color_type" color="primary"
                    true-value="inside" false-value="outside"></v-switch>
          <span v-if="color_type=='inside'">内色</span>
          <span v-if="color_type=='outside'">外色</span>
        </v-row>
        <!-- 木纹色卡 -->
        <v-row no-gutters class="ml-n3 mt-3">
          <v-col v-for="(pic, index) in wood_pic_list" :key="index" :cols="6" class="pt-1 pb-2">
            <v-card flat class="wood_card" @click.stop="selectWood(pic)">
              <img :src="`${pic.pic}?x-oss-process=image/resize,p_10,limit_0`" crossorigin="Anonymous" />
              <div class="desc">{{ pic.name }}</div>
              <i class="iconfont iconxuanze1 chosen" v-if="pic[color_type]"></i>
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
    origin_color: "",
    color: "",
    custom_color: "",
    is_custom: false,
    color_type: "outside",
    wood_pic_list: [
      {
        id: "2068", outside: false, inside: false,
        name: "巴西柚木",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/201.png"
      },
      {
        id: "2069", outside: false, inside: false,
        name: "白松木",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/202.png"
      },
      {
        id: "2070", outside: false, inside: false,
        name: "纯白",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/203.png"
      },
      {
        id: "2071", outside: false, inside: false,
        name: "瓷泳灰",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/204.png"
      },
      {
        id: "2075", outside: false, inside: false,
        name: "瓷泳金",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/205.png"
      },
      {
        id: "2076", outside: false, inside: false,
        name: "横纹紫檀",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/206.png"
      },
      {
        id: "2077", outside: false, inside: false,
        name: "红花梨",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/207.png"
      },
      {
        id: "2078", outside: false, inside: false,
        name: "红橡",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/208.png"
      },
      {
        id: "2080", outside: false, inside: false,
        name: "肌肤黑",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/209.png"
      },
      {
        id: "2081", outside: false, inside: false,
        name: "金丝楠",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/210.png"
      },
      {
        id: "2082", outside: false, inside: false,
        name: "金橡",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/211.png"
      },
      {
        id: "2083", outside: false, inside: false,
        name: "沙比利",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/212.png"
      },
      {
        id: "2084", outside: false, inside: false,
        name: "水晶红",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/213.png"
      },
      {
        id: "2085", outside: false, inside: false,
        name: "水曲柳",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/214.png"
      },
      {
        id: "2086", outside: false, inside: false,
        name: "香槟",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/215.png"
      },
      {
        id: "2088", outside: false, inside: false,
        name: "樱桃木",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/216.png"
      },
      {
        id: "2089", outside: false, inside: false,
        name: "柚木",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/217.png"
      },
      {
        id: "2090", outside: false, inside: false,
        name: "原木",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/218.png"
      },
      {
        id: "2091", outside: false, inside: false,
        name: "尊贵白",
        pic: "https://webcc-pro.thinkerx.com/imge/woodcolorpic/219.png"
      }
    ]
  }),
  methods: {
    /** 清除 数据初始化 **/
    dataInitialization() {
      this.is_custom = false;
      this.custom_color = '';
      this.origin_color = this.color_final;
    },
    /** 选择木纹色卡 **/
    selectWood(wood) {
      // 选中
      this.wood_pic_list.forEach(item=> {
        item[this.color_type] = false;
      });
      wood[this.color_type] = true;
      if (this.color_type !== 'outside') return;
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.setAttribute("label", wood.name);
      image.src = wood.pic + "?time=" + new Date().valueOf();
      image.onload = () => {
        this.canvas.shapeManager.barNormal = image;
      };
    },
    /** 颜色选择器选择颜色 **/
    pickColor() {
      // 木纹选中清空
      this.wood_pic_list.forEach(item=> {
        item.outside = false;
      });
      this.canvas.shapeManager.barNormal = this.color;
    },
    /** 重新赋值 **/
    rewriteData(order_data) {
      let outside_color = order_data.color || this.wood_pic_list[1].id;
      let inside_color = order_data.color_two || this.wood_pic_list[0].id;
      this.wood_pic_list.forEach(item=> {
        item.outside = item.id == outside_color;
        item.inside = item.id == inside_color;
      });
      this.origin_color = this.color_final;
    }
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
    color_final() {  // 最后提交的颜色
      // let selected = this.wood_pic_list.filter(item=> { return item.outside; });
      // if (this.is_custom) return `custom-${this.custom_color}`;
      // else if (selected.length) return selected[0].name;
      // else return this.color;
      let selected = this.wood_pic_list.filter(item=> { return item.outside; });
      let outside_color = selected.length ? selected[0].id : '2069';
      selected = this.wood_pic_list.filter(item=> { return item.inside; });
      let inside_color = selected.length ? selected[0].id : '2068';
      return { outside_color, inside_color };
    },
    is_dirty: {
      get() {
        return this.origin_color !== this.color_final;
      },
      set(value) {
        if (value) this.origin_color = '';
        else this.origin_color = this.color_final;
      }
    },
    ...mapState(["canvas"])
  },
  mounted() {
    if (!this.$route.query.order_id)
      this.color = this.canvas.shapeManager.barNormal;
    this.origin_color = this.color_final;
  }
};
</script>

<style scoped lang="scss">
@import "./common.css";
/** 木纹图片部分样式 **/
.wood_card {
  width: 97px; height: 132px;
  border: 1px solid #dddddd;
  position: relative;
  &.v-card { background-color: #fff0 !important; }
  img {
    margin: 10px auto 0;
    width: 75px;
    height: 75px;
    display: block;
  }
  .desc {
    height: 36px;
    margin-top: 10px;
    padding: 0 10px;
    text-align: center;
    line-height: 14px;
  }
  .chosen {
    position: absolute;
    top: 12px;
    right: 0;
    color: #38c088;
    font-size: 45px;
  }
}
</style>