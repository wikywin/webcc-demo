<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 外框
    @created 2020/6/1
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <!-- 单独修改连接方式 -->
        <v-row
          class="input-row"
          v-if="action == 'frame_joint_way'"
        >
          <span class="label">{{ $t('rightmenu.waikuang.lianjiefangshi') }}</span>
          <v-select
            outlined
            color="primary"
            single-line
            v-model="frame_joint_way"
            return-object
            :items="frame_list"
            item-text="name"
            item-value="id"
          >
          </v-select>
        </v-row>
        <!-- 批量修改连接方式 -->
        <v-row class="input-row" v-if="action == 'frame_settings'">
                    <span class="label">{{ $t('rightmenu.waikuang.lianjiefangshi') }}</span>
          <v-select outlined single-line v-model="payload.jointWay" :items="frame_list" item-value="id" item-text="name"></v-select>
        </v-row>

        <!-- 单耳窗方向设置 -->
        <v-row class="input-row" v-if="action == 'ear_frame_settings'">
          <span class="label">{{ $t('rightmenu.waikuang.direction') }}</span>
          <v-select outlined color="primary" single-line
            v-model="ear_position" return-object
            :items="ear_position_list" item-text="name" item-value="value">
          </v-select>
        </v-row>

        <!-- 单耳窗 小窗镜像位置 -->
         <v-row class="input-row" v-if="action == 'ear_frame_settings'">
          <span class="label">{{ $t('rightmenu.waikuang.acoustic') }}</span>
          <v-switch v-model="ear_float_reverse" color="primary"></v-switch>
        </v-row>

        <!-- 双耳窗方向设置 -->
        <v-row class="input-row" v-if="action == 'double_ears_frame_settings'">
          <span class="label">{{ $t('rightmenu.waikuang.direction') }}</span>
          <v-select outlined color="primary" single-line
            v-model="ear_position" return-object
            :items="ear_position_list" item-text="name" item-value="value">
          </v-select>
        </v-row>

        <!-- 单轨推拉 -->
        <v-row class="input-row" v-if="action == 'frame_single_track'">
          <span class="label">类型</span>
          <v-select outlined color="primary" single-line
            v-model="payload.hidden" 
            :items="single_track_list" item-text="name" item-value="value">
          </v-select>
        </v-row>
        <!-- 切割 -->
        <v-row class="input-row" v-if="action == 'bar_endpoint'">
          <span class="label">{{ $t('rightmenu.waikuang.split') }}</span>
          <v-switch
            v-model="frame_split"
            color="primary"
          ></v-switch>
        </v-row>
        <!-- 固定 -->
        <v-row class="input-row" v-if="action == 'bar_endpoint' && payload.hasFixedProperty">
          <span class="label">{{ $t('rightmenu.waikuang.fixed') }}</span>
          <v-switch
            v-model="frame_fixed"
            color="primary"
          ></v-switch>
        </v-row>

        <!-- 标线 非圆弧/ 弧高 圆弧 -->
        <v-row
          class="input-row"
          v-if="action=='frame_bar_dim'"
        >
          <span class="label">{{ $t('rightmenu.waikuang.Arc')}}</span>
          <v-switch
            v-model="payload.dimShow"
            color="primary"
          ></v-switch>
        </v-row>
        <!-- 弦长 圆弧 -->
        <v-row
          class="input-row"
          v-if="action=='frame_bar_dim' && payload.isArc"
        >
          <span class="label">{{ $t('rightmenu.waikuang.Chord')}}</span>
          <v-switch
            v-model="payload.chordDimShow"
            color="primary"
          ></v-switch>
        </v-row>

        <!-- 均分 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier'"
        >
          <span class="label">{{$t('rightmenu.waikuang.average')}}</span>
          <v-switch
            v-model="payload.equalSplit"
            color="primary"
          ></v-switch>
        </v-row>
         <!-- 固定起点 -->
        <!-- <v-row class="input-row" v-if="action=='bar_modifier' && payload.hasFixedProperty">
          <span class="label">{{$t('rightmenu.waikuang.startFixed')}}</span>
          <v-switch v-model="payload.startFixed" color="primary"></v-switch>
        </v-row> -->
          <!-- 固定终点 -->
        <!-- <v-row class="input-row" v-if="action=='bar_modifier' && payload.hasFixedProperty">
          <span class="label">{{$t('rightmenu.waikuang.endFixed')}}</span>
          <v-switch v-model="payload.endFixed" color="primary"></v-switch>
        </v-row> -->
        <!-- 宽度 || 边长 name为spin_mullion的中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='spinLine'"
        >
          <span
            class="label"
            v-if="payload.side==4"
          >{{$t('rightmenu.waikuang.width')}}</span>
          <span
            class="label"
            v-if="payload.side!=4"
          >{{$t('rightmenu.waikuang.edgelen')}}</span>
          <v-text-field
            outlined
            single-line
            v-model.number="payload.width"
            :rules="[v => !!v || 'required',v=>(v&&v>=50)||'must >50']"
          >
          </v-text-field>
        </v-row>
        <!-- 高度 name为spin_mullion的中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='spinLine' && payload.side==4"
        >
          <span class="label">{{$t('rightmenu.waikuang.height')}}</span>
          <v-text-field
            outlined
            single-line
            v-model.number="payload.height"
            :rules="[v => !!v || 'required',v=>(v&&v>=50)||'must >50']"
          >
          </v-text-field>
        </v-row>
        <!-- 边数 name为spin_mullion的中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='spinLine'"
        >
          <span class="label">{{$t('rightmenu.waikuang.count')}}</span>
          <v-select
            outlined
            single-line
            v-model="payload.side"
            :items="[4, 5, 6, 7, 8]"
          ></v-select>
        </v-row>
        <!-- 方向 name为spin_mullion的中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='spinLine'"
        >
          <span class="label">{{$t('rightmenu.waikuang.direction')}}</span>
          <v-switch
            v-model="bar_modifier_orien"
            color="primary"
          ></v-switch>
          <span v-if="bar_modifier_orien">{{$t('rightmenu.waikuang.Clockwise')}}</span>
          <span v-else>{{$t('rightmenu.waikuang.anticlockwise')}}</span>
        </v-row>
        <!-- 边数 name为compoundcircle的中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='compoundLineCircle'"
        >
          <span class="label">{{$t('rightmenu.waikuang.count')}}</span>
        </v-row>
        <!-- 边数 - 滑块操作 name为compoundcircle的中挺 -->
        <v-row
          class="slider-row"
          v-if="action=='bar_modifier' && payload.type=='compoundLineCircle'"
        >
          <v-slider
            type="number"
            v-model.number="payload.side"
            :max="12"
            :min="2"
            :thumb-size="24"
            step="1"
            hide-details
            thumb-label
            color="#37ACFC"
          >
            <template v-slot:append>
              <v-text-field
                class="mt-0 pt-0" 
                type="number"
                v-model.number="payload.side"
                step="1"
                hide-details
                single-line
              >
              </v-text-field>
            </template>
          </v-slider>
        </v-row>
        <!-- 中梃角度 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier'"
        >
          <span class="label">{{$t('rightmenu.waikuang.angle')}}</span>
        </v-row>
        <!-- 中梃角度 - 滑块操作 -->
        <v-row
          class="slider-row"
          v-if="action=='bar_modifier'"
        >
          <v-slider
            type="number"
            v-model.number="payload.angle"
            :max="360"
            :min="0"
            :thumb-size="24"
            step="1"
            hide-details
            thumb-label
            color="#37ACFC"
          >
            <template v-slot:append>
              <v-text-field
                type="number"
                v-model.number="payload.angle"
                step="1"
                outlined
                hide-details
                single-line
              >
              </v-text-field>
            </template>
          </v-slider>
        </v-row>
        <!-- 弧高 圆弧中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='simpleInnerArc'"
        >
          <span class="label">{{$t('rightmenu.waikuang.Arch')}}</span>
          <v-text-field
            outlined
            single-line
            v-model.number="simple_inner_arc_height"
            :rules="[v => !!v || 'required',v=>(v&&v>0)||'must >0']"
          >
          </v-text-field>
        </v-row>
        <!-- 宽度 圆弧中挺 -->
        <v-row
          class="input-row"
          v-if="action=='bar_modifier' && payload.type=='simpleInnerArc'"
        >
          <span class="label">{{$t('rightmenu.waikuang.width')}}</span>
          <v-text-field
            outlined
            single-line
            v-model.number="simple_inner_arc_width"
            :rules="[v => !!v || 'required',v=>(v&&v>0)||'must >0']"
          >s
          </v-text-field>
        </v-row>
        <!-- 边数 -->
        <v-row
          class="input-row"
          v-if="action=='regular_frame_settings'"
        >
          <span class="label">{{$t('rightmenu.waikuang.count')}}</span>
        </v-row>
        <!-- 边数 - 滑块操作 -->
        <v-row
          class="slider-row"
          v-if="action=='regular_frame_settings' && regular_frame_settings"
        >
          <v-slider
            type="number"
            v-model.number="slider_edges_count"
            :max="10"
            :thumb-size="24"
            :min="3"
            step="1"
            hide-details
            color="#37ACFC"
            thumb-label
          >
            <template v-slot:append>
              <v-text-field
                ref="input"
                class="mt-0 pt-0"
                type="number"
                v-model.number="input_edges_count"
                step="1"
                single-line
                hide-details
                @input="inputEdgesCount"
              >
              </v-text-field>
            </template>
          </v-slider>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    input_edges_count: null,
    slider_edges_count: null,
    action: "",
    payload: null,
    timer: ms => new Promise(resolve => setTimeout(resolve, ms)),
    input_count: 0
  }),
  watch: {
    slider_edges_count(value) {
      if (this.input_edges_count > 10) return;
      this.input_edges_count = value;
      this.payload.edgesCount = value;
    }
  },
  methods: {
    /** 清除 数据初始化 **/
    dataInitialization() {
      this.action = "";
    },
    /** 多边形边数限制 **/
    async inputEdgesCount(value) {
      this.input_count++;
      await this.timer(1000);
      // 取最后一次触发的值
      if (this.input_count > 1) {
        this.input_count--;
        return;
      }
      if (value < 3) this.$VMessage.warning("多边形边数不能小于3");
      else if (value > 20) this.$VMessage.warning("多边形边数不能大于20");

      this.slider_edges_count = value < 3 ? 3 : value > 10 ? 10 : value;
      this.input_edges_count = value < 3 ? 3 : value > 20 ? 20 : value;
      this.payload.edgesCount = this.input_edges_count;
      this.input_count = 0;
    }
  },
  computed: {
    single_track_list(){//单轨推拉
      return [
        {name:'左侧隐藏',value:['left']},
        {name:'左下隐藏',value:['left','down']},
        {name:'右侧隐藏',value:['right']},
        {name:'右下隐藏',value:['right','down']},
        {name:'下侧隐藏',value:['down']},
        {name:'仅留上侧',value:['left','right','down']}
      ]
    },
    frame_list() {
      // 连接方式 - 列表
      return [
        { name: this.$t("rightmenu.waikuang.xie"), id: 0 },
        { name: this.$t("rightmenu.waikuang.heng"), id: 1 },
        { name: this.$t("rightmenu.waikuang.shu"), id: 2 }
      ];
    },
    frame_joint_way: {
      // 连接方式 - 获取 & 设置
      get() {
        return { name: "", id: this.payload.jointWay };
      },
      set(value) {
        this.payload.jointWay = value.id;
      }
    },
    bar_modifier_orien: {
      // 中挺方向 - 获取 & 设置
      get() {
        return this.payload.orien;
      },
      set(value) {
        this.payload.orien = value;
      }
    },
    frame_split: {
      // 切割方式 - 获取 & 设置
      get() {
        return this.payload.split;
      },
      set(value) {
        this.payload.split = value;
      }
    },
    frame_fixed: {
      // 固定 - 获取 & 设置
      get() {
        return this.payload.fixed;
      },
      set(value) {
        this.payload.fixed = value;
      }
    },
    edges_count: {
      get() {
        return this.payload.edgesCount;
      },
      set(value) {
        this.payload.edgesCount = value;
      }
    },
    regular_frame_settings() {
      // 正多边形边数 - 获取
      this.input_edges_count = this.payload.edgesCount;
      this.slider_edges_count = this.payload.edgesCount;
      return true;
    },
    simple_inner_arc_height: {
      // 圆弧中挺-弧高
      get() {
        if (this.payload.simpleInnerArcHeight)
          return this.payload.simpleInnerArcHeight.toFixed(1);
        else return 0;
      },
      set(value) {
        this.payload.simpleInnerArcHeight = value;
      }
    },
    simple_inner_arc_width: {
      // 圆弧中挺-宽度
      get() {
        if (this.payload.simpleInnerArcWidth)
          return this.payload.simpleInnerArcWidth.toFixed(1);
        else return 0;
      },
      set(value) {
        this.payload.simpleInnerArcWidth = value;
      }
    },
    ear_position: { //单耳窗方向
      get(){
        return this.payload.earPosition;
      },
      set(value){
        this.payload.earPosition=value.value
      }
    },
    double_ear_position: { //双耳窗方向
      get(){
        return this.payload.earPosition;
      },
      set(value){
        this.payload.earPosition=value.value
      }
    },
    ear_position_list(){//耳窗
      return [
        { name: this.$t("rightmenu.waikuang.left"), value:'left' },
        { name: this.$t("rightmenu.waikuang.right"), value: "right" },
        { name: this.$t("rightmenu.waikuang.up"), value:"up" },
        { name: this.$t("rightmenu.waikuang.down"), value: "down" }
      ];
    },
    ear_float_reverse: { //耳窗镜像
      get(value){
        return this.payload.floatReverse;
      },
      set(value){
        this.payload.floatReverse=value
      }

    }
  }
};
</script>
<style scoped>
@import "./common.css";
</style>