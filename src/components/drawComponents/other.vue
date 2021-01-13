<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 其他
    @created 2020/6/12
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <!-- 标线 -->
        <v-row class="input-row" v-if="action=='wall_settings'">
          <span class="label">{{ $t('rightmenu.other.Arc')}}</span>
          <v-switch v-model="payload.dimHidden" color="primary"
                    :true-value="false" :false-value="true"></v-switch>
        </v-row>
        <!-- 标线位置 -->
        <v-row class="input-row" v-if="action=='wall_settings' && !payload.dimHidden">
          <span class="label">{{$t('rightmenu.other.dimposition')}}</span>
          <v-switch v-model="payload.dimPosition" color="primary"
                    true-value="right" false-value="left"></v-switch>
          <span v-if="payload.dimPosition=='left'">{{$t("rightmenu.other.left")}}</span>
          <span v-if="payload.dimPosition=='right'">{{$t("rightmenu.other.right")}}</span>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    action: '',
    payload: null,
  }),
  computed: {

  }
};
</script>

<style scoped >
@import "./common.css";
</style>