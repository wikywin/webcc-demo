<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 图纸
    @created 2020/6/15
-->
<template>
  <v-card flat class="pb-3">
    <v-card flat v-for="item in list" :key="item.id"
            class="paper-card" :class="{ 'active': item.is_active}" v-show="item.type==0"
            @click="changeOrder(item)">
      <v-img  :src="`${item.pic_url}?${OSS_ZIP}`" contain 
              max-height="190" max-width="190"
              min-height="190" min-width="190"></v-img>
      <!-- 删除 -->
      <span class="delete" @click="readyDelete(item)"><!-- deleteOrder(item) -->
        <i class="iconfont iconRectangleCopy11"></i>
      </span>
    </v-card>

    <comm-dialog
      :visible="confirm_delete"
      :title="$t('alertmessage.warning')"
      :cancelText="$t('alertmessage.cancel')"
      :confirmText="$t('alertmessage.confirm')"   
      width="420"
      @close="confirm_delete=false"
      @cancel="confirm_delete=false"
      @confirm="deleteOrder()"   
    >

      <template v-slot:content>
        <div class="text-center body-2 dialog-warning all-content">
          <i class="iconfont icontishi1"></i>
          <span style="font-size: 16px;">{{$t('alertmessage.deleteorder')}}</span>
        </div>
      </template>
      
    </comm-dialog>
    
  </v-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    list: [],
    selected_order_id: 0,
    confirm_delete:false,
    contract_id: 0,
    item:null,
    OSS_ZIP:process.env.VUE_APP_OSS_ZIP
  }),
  methods: {
    /** 获取订单列表 **/
    getOrderList() {
      this.$axios.get(`contracts/${this.$route.query.contract_id}`).then(res => {
        if (!res.code) this.$VMessage.error(res.message);
        this.list = res.data.order;
        this.list.forEach(item=> {
          this.$set(item,"is_active", item.id == this.selected_order_id);
        });
        this.$emit("set-paper-list",this.list);
      })
    },
    // 订单删除前确认
    readyDelete(item){
      this.confirm_delete=true
      this.$set(this,"item",item)
    },
    /** 删除订单 **/
    deleteOrder() {
      let order=this.item
      this.$axios.delete(`orders/${order.id}`).then(res=> {
        if (res.code) {
          this.$VMessage.success(this.$t("alertmessage.success_delete"));
          // 判断被删除订单是否是当前选中订单
          // 若是，则调用draw.vue 的 doBarAction clean
          // 清空画布并去除路由上的order_id
          let select_order = this.list.filter(item=> { return item.id==order.id; })[0];
          if (select_order.is_active)
            this.bus.$emit('do-action',{ action: "clean" });

          this.getOrderList();
        } else this.$VMessage.error(this.$t("alertmessage.failed_delete"));
        this.confirm_delete=false
      }).catch(e=> {
        this.$VMessage.error(this.$t("alertmessage.failed_delete"));
      })
    },
    /** 切换显示订单 **/
    changeOrder(order, is_callback = false) {
      if (order.is_active) return;
      if (is_callback) {
        this.list.forEach(item=> {
          item.is_active = false;
        });
        order.is_active = true;
        this.selected_order_id = order.id;
        this.$router.replace({ path: "/draw",
          query: { contract_id: order.contract_id, order_id: order.id }
        });
      } else this.bus.$emit("before-leave",{ type: "change_order", order });
    },
    /** 获取订单详情 **/
    getOrderDetail() {
      this.$axios.get(`orders/${this.selected_order_id}`).then(res=> {
        // 提交订单信息至父组件
        if (!res.code) this.$VMessage.error(res.message);
        else this.$emit("update-order", res.data.order);
      })
    },
  },
  watch: {
    $route() {
      if (!this.order_id) this.selected_order_id = this.$route.query.order_id;
      let order_id = this.$route.query.order_id;
      if (order_id) this.getOrderDetail();
      else this.list.forEach(item=> { item.is_active = false; });
    }
  },
  mounted() {
    this.contract_id = this.$route.query.contract_id;
    this.selected_order_id = this.$route.query.order_id;
    if (this.contract_id) this.getOrderList();
    if (this.selected_order_id) this.getOrderDetail();
  }
};
</script>

<style lang="scss" scoped>
@import "./common.css";
.paper-card {
  width: 210px; height: 210px;
  margin: 20px auto 0;
  padding: 10px;
  border: 2px solid #dddddd;
  text-align: center;
  position: relative;
  &.active, &:hover {
    padding: 10px;
    border: 2px solid #0077ff !important;
  }
  .delete {
    width: 40px; height: 40px;
    background: #797979; color: #fff;
    display: block;
    position: absolute; top: 0; right: 0;
    font-size: 24px;
    border-radius: 0 !important;
  }
}
</style>