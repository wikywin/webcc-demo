<!--
  @author qixf@thinkerx.com
  @description 公共弹出窗
  @params visible|boolean|false 是否打开弹窗
  @params title|string|'' 标题
  @params width|string|auto 宽度
  @params confirm-btn|boolean|true 是否有确认按钮
  @params confirm-text|string|'确认' 确认按钮文案
  @params cancel-btn|boolean|true 是否有取消按钮
  @params cancel-text|string|'取消' 取消按钮文案
  @event close 关闭事件
  @event confirm 确认事件
  @event cancel 取消事件
-->
<template>
  <v-dialog persistent v-model="show" :width="width">
    <div class="white px-5 pb-5  allcontent" >
      <!-- 标题 -->
      <div class="dialog-title">
        <span>{{title}}</span>
        <i class="iconfont iconguanbi float-right cursor-pointer" @click="close"></i>
      </div>
      <!-- 主要内容 -->
      <div class="content my-5">
        <slot name="content"></slot>
      </div>
      <!-- 底部按钮 -->
      <div class="footer-btn text-right mt-3">
        <!-- 可增加其他按钮 -->
        <slot name="footer-btn"></slot>
        <v-btn
          v-show="cancelBtn"
          :class="{ 'mr-2 mr-md-4': confirmBtn }"
          outlined
          color="#dddddd"
          height="40"
          min-width="90"
          elevation="0"
          @click="cancel"
        >
          <span class="body-2" style="color: #666666;">{{cancelText || $t("alertmessage.cancel")}}</span>
        </v-btn>

        <v-btn
          v-show="confirmBtn"
          color="#1B7AF8"
          height="40"
          min-width="90"
          elevation="0"
          @click="confirm"
        >
          <span class="body-2" style="color: #ffffff">{{confirmText || $t("alertmessage.confirm")}}</span>
        </v-btn>

          <slot name="right-footer-btn"></slot>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "CommDialog",
  props: {
    width: { type: String, default: "auto" },
    visible: { type: Boolean, default: false },
    title: { type: String, default: "" },
    confirmBtn: { type: Boolean, default: true },
    confirmText: { type: String, default: "" },
    cancelBtn: { type: Boolean, default: true },
    cancelText: { type: String, default: "" },
    // inviteBtn: { type: Boolean, default: true },
    // inviteText: { type: String, default: "" }
  },
  data: () => ({
    show: false
  }),
  methods: {
    close() {
      this.show = false;
      this.$emit("close");
    },
    cancel() {
      this.close();
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
    // invite(){
    //   this.$emit("invite");
    // }
  },
  mounted() {},
  watch: {
    visible(val) {
      this.show = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-dialog {
  
  .dialog-title {
    
    color:#000;
    font-size: 18px;
    line-height: 46px;
    i {
      font-size: 28px;
      color: #999999;
    }
  }
  .content{
    color:#000;

  }
  .allcontent{
    position: relative;
  }
  .footer-btn{
    // background-color: black;
    // width: 300px;
    // display: flex;
    // margin-left: 80px;
    // flex-direction:row-reverse;
    justify-content: space-around;
   

  }
  
}
</style>