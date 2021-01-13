<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 玻璃
    @created 2020/6/12
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <!-- 规格 -->
        <v-row class="input-row">
          <span class="label">{{ $t('rightmenu.boli.guige') }}</span>
          <v-text-field outlined single-line v-model="glass.guigelabel"></v-text-field>
        </v-row>
        <!-- 是否磨砂玻璃 -->
        <v-row class="input-row">
          <span class="label">{{ $t('rightmenu.boli.type') }}</span>
          <v-checkbox v-model="glass.mosha" :label="$t('rightmenu.boli.mosha')"></v-checkbox>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    glass: {
      guigelabel: "",
      mosha: false,
    },
    origin_glass: null,
  }),
  methods: {
    /** 重新赋值 **/
    rewriteData(order_data) {
      let glass_data = order_data.glass_data;
      for (let key in this.glass) {
        this.glass[key] = glass_data[key];
      }
      this.origin_glass = JSON.stringify(this.glass);
    },
    /** 清除 数据初始化 **/
    dataInitialization() {
      Object.assign(this.glass,{
        guigelabel: "",
        mosha: false,
      });
      this.origin_glass = JSON.stringify(this.glass);
    },
  },
  computed: {
    is_dirty: {
      get() {
        return this.origin_glass !== JSON.stringify(this.glass);
      },
      set(value) {
        if (value) this.origin_glass = null;
        else this.origin_glass = JSON.stringify(this.glass);
      }
    }
  },
  mounted() {
    this.origin_glass = JSON.stringify(this.glass);
  }
};
</script>

<style scoped lang="scss">
@import "./common.css";
</style>