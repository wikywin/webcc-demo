<!--
    @author qixf@thinkerx.com
    @remark 画图界面
    @created 2020/5/28
-->
<template>
  <div class="full-bg-auto">
    <!-- 画布 -->
    <div class="canvas">
      <div style="height: 100%"
        v-shortkey="short_keys"
        @shortkey="handleKey"
        id="webcc"
      ></div>
    </div>

    <!-- 左侧卡片-菜单栏 -->
    <left-card ref="left_card"></left-card>

    <!-- 右侧卡片-菜单栏 -->
    <right-card ref="right_card"></right-card>

    <!-- 底部鼠标位置 -->
    <v-system-bar
      class="elevation-15 footer"
      v-if="canvas"
    >
      <span v-if="!isMobileDevice">{{$t("drawpagefooter.mouseposition")}}：</span>
      <span v-if="!isMobileDevice">({{Math.round(canvas.toolManager.mousePosition.x)}},</span>
      <span v-if="!isMobileDevice">{{Math.round(canvas.toolManager.mousePosition.y)}})</span>
      <v-spacer></v-spacer>
      <span>{{$t("drawpagefooter.currenttools")}}：{{canvas.toolManager.currentToolText}}</span>
    </v-system-bar>

    <!-- 你有未保存的修改，是否继续 -->
    <comm-dialog :visible="leave_confirm" title="提示" width="500"
        @close="beforeLeave(leave_config,true)"
        @confirm="saveOrder('leave')"
    >
      <template v-slot:content>
        <div class="text-center body-2">
          <p style="font-size: 18px;">是否保存当前的设计方案？</p>
          <p style="color: #999;">点击确定将退出定制门窗模式，并将当前方案覆盖之前的门窗</p>
        </div>
      </template>
    </comm-dialog>

    <!-- 正在保存 loading -->
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <div v-show="false" id="webcc3d"></div>
  </div>
</template>
<script>
import webccCreator from "@/plugins/webcc";
import * as webcc from "webcc";
import * as webcc3d from "webcc3d";
import { mapState, mapGetters } from "vuex";
import LeftCard from "@/components/drawComponents/leftCard.vue";
import RightCard from "@/components/drawComponents/rightCard.vue";
export default {
  name: "draw",
  data() {
    return {
      action_list: [
        {
          icon: "iconchexiao",
          label: this.$t("drawpage.btn.revoke"),
          action: "undo", sm:true
        }, // 撤销
        {
          icon: "iconzhongzuo",
          label: this.$t("drawpage.btn.redo"),
          action: "redo", sm:true
        }, // 恢复
        {
          icon: "iconRectangleCopy11",
          label: this.$t("drawpage.btn.delete"),
          action: "delete", sm:true
        }, // 删除
        {
          icon: "iconqingchu",
          label: this.$t("drawpage.btn.clean"),
          action: "clean", sm:true
        }, // 清除
        {
          icon: "iconwenjianjia1",
          label: this.$t("drawpage.btn.import"),
          action: "import"
        }, // 导入
        {
          icon: "icondaochu",
          label: this.$t("drawpage.btn.export"),
          action: "export"
        }, // 导出
        // {
        //   icon: "iconbaocun-copy",
        //   label: this.$t("drawpage.btn.save"),
        //   action: "save", sm:true
        // }, // 保存
      ],
      leave_confirm: false,
      leave_config: "",
      paper_list: [], // 图纸列表
      loading: false,
      isnumber: 1, //初始是数值。改变了就为文字
      url: this.$route.name,
      copy_event: null,
      threeScene: null,
      pic_url:"",
      open_id:"",
      token:"",
      bgid:""
    };
  },
  methods: {
    /** 初始化操作头部 **/
    initActionBar() {
      let action_bar = this.$parent.$parent.$refs["action_bar"];
      action_bar.action_list = this.action_list;
      action_bar.listen_leave = true;
      action_bar.action_right_list = this.action_right_list;
      action_bar.hide_sm_logo = true;
      action_bar.hide_sm_more = true;
      this.bus.$on("change-theme", () => {
        this.canvas.shapeManager.darkMode = this.$vuetify.theme.dark;
      });
      this.bus.$on("before-leave", this.beforeLeave);
      this.bus.$on("do-action", this.doBarAction);
      // //获取openid、token
      // if (localStorage.getItem('open_id')&&localStorage.getItem('token')) {
      //   this.open_id = localStorage.getItem('open_id');
      //   this.token = localStorage.getItem('token');
      // }else {
      //   this.$VMessage.error("缺少open_id!");
      // }
    },
    /** 离开页面事件 **/
    beforeLeave(config, is_continue = false) {
      if ((this.is_dirty || this.canvas.shapeManager.isDirty) && !is_continue) {
        // 有修改，弹出保存提示
        this.leave_confirm = true;
        this.leave_config = config;
      } else {
        // 无修改 || 已提示同意继续
        this.leave_confirm = false;
        switch (config.type) {
          // 退出、返回
          default:
            console.log(this.isIOS);
            if (sessionStorage.getItem("saved")) {
              if (this.isIOS) {
                // WKWebView使用
                // 使用下方方法,会报错,为使界面执行逻辑通畅,因此使用try-catch
                try {
                  window.webkit.messageHandlers.onSave.postMessage(JSON.parse(sessionStorage.getItem("saved_data")));
                } catch(error) { console.log(error); }
              } else onSave(JSON.parse(sessionStorage.getItem("saved_data")));
            } else {
              if (this.isIOS) {
                // WKWebView使用
                // 使用下方方法,会报错,为使界面执行逻辑通畅,因此使用try-catch
                try {
                  window.webkit.messageHandlers.onExit.postMessage();
                } catch(error) { console.log(error); }
              } else onExit();
            }
        }
      }
    },
    /** 头部按钮点击事件 **/
    doBarAction(action_obj) {
      let action = action_obj.action;
      switch (action) {
        case "clean": // 清除
          this.canvas.shapeManager.clear();
          this.$refs["right_card"].clearTabItemData();
          break;
        case "delete": // 删除
          this.canvas.shapeManager.remove();
          break;
        case "export": // 导出
          if (this.canvas.shapeManager.isEmpty)
            this.$VMessage.info(this.$t("alertmessage.bopic"));
          else this.canvas.shapeManager.exportJson();
          break;
        case "undo": // 撤销
          this.canvas.mometoManager.undo();
          break;
        case "redo": // 恢复
          this.canvas.mometoManager.redo();
          break;
        case "import": // 导入
          let input = document.createElement("input");
          input.type = "file";
          input.accept = "application/json ";
          input.onchange = event => {
            let files = event.target.files;
            let reader = new FileReader();
            reader.onload = event => {
              let config = event.target.result;
              this.canvas.shapeManager.openFile(config, false);
              input = null;
            };
            reader.readAsText(files[0]);
          };
          input.click();
          sessionStorage.setItem("orderchange", "1");
          break;
        case "export":
          if (this.canvas.shapeManager.isEmpty)
            this.$VMessage.info(this.$t("alertmessage.bopic"));
          else this.canvas.shapeManager.exportJson();
          //this.canvas.shapeManager.exportDxf(true);
          break;
        case "save": // 保存
          this.saveOrder();
          break;
      }
    },
    /** 画布键盘事件 **/
    handleKey(event) {
      this.canvas.toolManager.handleKey(event.srcKey);
      this.$refs["left_card"].pickToolByKeyboard(
        this.canvas.toolManager.currentToolText
      );
    },
    /** 在刷新和关闭之前询问 **/
    beforeRefreshClose() {
      let self = this;
      window.onbeforeunload = function(e) {
        if (self.$route.name == "draw") {
          e = e || window.event;
          // 兼容IE8和Firefox 4之前的版本
          if (e) e.returnValue = "关闭提示1";
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return "关闭提示2";
        } else window.onbeforeunload = null;
      };
    },
    /** 监听画布事件 **/
    initCanvasEvent() {
      // 外框 （连接方式）
      this.canvas.eventBus.select(webcc.EventType.frame_joint_way).subscribe(
        event => {
          this.$refs["right_card"].changeTab("outer_frame");
          this.$refs["right_card"].$refs["outer_frame"].action =
            "frame_joint_way";
          this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
        }
      );
      // 外框 （切割方式，固定点）
      this.canvas.eventBus.select(webcc.EventType.bar_endpoint).subscribe(
        event => {
          this.$refs["right_card"].changeTab("outer_frame");
          this.$refs["right_card"].$refs["outer_frame"].action = "bar_endpoint";
          this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
        }
      );
      // 外框 （单耳窗）
      this.canvas.eventBus.select(
        webcc.EventType.ear_frame_settings
      ).subscribe(event => {
        this.$refs["right_card"].changeTab("outer_frame");
        this.$refs["right_card"].$refs["outer_frame"].action =
          "ear_frame_settings";
        this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
      });
      // 外框 （双耳窗）
      this.canvas.eventBus.select(
        webcc.EventType.double_ears_frame_settings
      ).subscribe(event => {
        this.$refs["right_card"].changeTab("outer_frame");
        this.$refs["right_card"].$refs["outer_frame"].action =
          "double_ears_frame_settings";
        this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
      });
      // 外框 （弧高、标线）
      this.canvas.eventBus.select(webcc.EventType.frame_bar_dim).subscribe(
        event => {
          this.$refs["right_card"].changeTab("outer_frame");
          this.$refs["right_card"].$refs["outer_frame"].action =
            "frame_bar_dim";
          this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
        }
      );
      // 外框 （中挺）
      this.canvas.eventBus.select(webcc.EventType.bar_modifier).subscribe(
        event => {
          this.$refs["right_card"].changeTab("outer_frame");
          this.$refs["right_card"].$refs["outer_frame"].action = "bar_modifier";
          this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
        }
      );
      // 外框 （正多边形）
      this.canvas.eventBus.select(
        webcc.EventType.regular_frame_settings
      ).subscribe(event => {
        this.$refs["right_card"].changeTab("outer_frame");
        this.$refs["right_card"].$refs["outer_frame"].action =
          "regular_frame_settings";
        this.$refs["right_card"].$refs["outer_frame"].payload = event.payload;
      });

      // 开扇 （合页边、执手边）
      this.canvas.eventBus.select(
        webcc.EventType.sash_bar_settings
      ).subscribe(event => {
        if (event.payload.isArc) return; // 圆弧边不能作为合页、执手边
        this.$refs["right_card"].changeTab("window");
        this.$refs["right_card"].$refs["window"].action = "sash_bar_settings";
        this.$refs["right_card"].$refs["window"].payload = event.payload;
      });
      // 开扇 （多个扇、纱扇、防盗框、折叠、推拉、百叶窗）
      this.canvas.eventBus.select(
        webcc.EventType.sash_group_settings
      ).subscribe(event => {
        this.$refs["right_card"].changeTab("window");
        this.$refs["right_card"].$refs["window"].is_single = false;
        this.$refs["right_card"].$refs["window"].payload_origin = event.payload;
        this.$refs["right_card"].$refs["window"].action = "sash_settings";
      });
      // 开扇 （单个扇、纱扇）
      this.canvas.eventBus.select(webcc.EventType.sash_settings).subscribe(
        event => {
          this.$refs["right_card"].changeTab("window");
          this.$refs["right_card"].$refs["window"].is_single = true;
          this.$refs["right_card"].$refs["window"].payload_origin =
            event.payload;
          this.$refs["right_card"].$refs["window"].action = "sash_settings";
        }
      );
      // 其他 （墙体）
      this.canvas.eventBus.select(webcc.EventType.wall_settings).subscribe(
        event => {
          this.$refs["right_card"].changeTab("other");
          this.$refs["right_card"].$refs["other"].action = "wall_settings";
          this.$refs["right_card"].$refs["other"].payload = event.payload;
        }
      );
      // 复制事件
      this.canvas.eventBus.select(webcc.EventType.frame_settings).subscribe(
        e => {
          this.copy_event = e.payload;
        }
      );
    },
    /** 保存 添加、编辑订单 **/
    async saveOrder(next_action) {
      if (this.open_id==''||this.token=='') {
        this.$VMessage.error("缺少open_id!");
        return;
      }
      if (this.canvas.shapeManager.isEmpty) { //判断是否有图片
        this.$VMessage.info(this.$t("alertmessage.bopic"));
        return;
      }
      // 关闭提示窗
      this.leave_confirm = false;

      let params = {};
      let three_data = this.canvas.shapeManager.export3dJson(); // webcc 3d 序列化数据

      if (JSON.parse(three_data).unsupported) {
        this.$VMessage.error("暂不支持该窗型！");
        return;
      }

      this.loading = true;
      // 上传图片
      let image = await this.uploadOrderImage(this.canvas.shapeManager.toData(),"https://zzc-serv-dev.thinkerx.com/api/dxf-upload-order");
      if (image.code) this.pic_url = image.data;
      else {
        // 图片上传失败
        this.$VMessage.error("保存失败");
        this.loading = false;
        return;
      }
      if(!this.threeScene) {
        this.threeScene = new webcc3d.ThreeScene();
      }
      this.canvas.dimManager.initDimName();
      params.drawing_data = this.canvas.shapeManager.serialize(true); // webcc 序列化数据
      const name = `webcc${new Date().getSeconds()}`;
      this.threeScene.AsyncWebCCToKJLFromJson(three_data, {
                name,
                previewImg_url:this.pic_url
              })
              .then((kjljson) => {
                this.overlay = false;
                params.name = name;
                params.open_id = this.open_id;
                params.token = this.token;
                params.data = kjljson;
                //console.log(params);
                this.$axios
                        .post("/post_to_kjl", params)
                        .then((res) => {
                          if(this.bgid){
                            localStorage.removeItem('bgid');
                          }
                          this.loading = false;
                          this.$VMessage.success("保存成功");
                          console.log(res);
                          // 有未保存修改，用户选择自动保存，然后继续执行剩余操作
                          if (next_action == "leave") this.beforeLeave(this.leave_config, true);
                        })
                        .catch((e) => {
                          this.loading = false;
                          this.$VMessage.error("保存失败");
                          // this.$VMessage.error(this.$t("alertmessage.failed_send"));
                        });
              })
              .catch(() => (this.overlay = false));
    },
    /** 上传图片 **/
    uploadOrderImage(file,api) {
      let form_data = new FormData();
      form_data.append("file", file);
      return this.$axios
        .post(api, form_data)
        .then(res => {
          return res;
        })
        .catch(e => {
          return { code: 0 };
        });
    },
    /** 如果url携带尺寸信息，则同步修改外框尺寸 **/
    resizeFrame(draw_frame=false) {
      if (!this.$route.query.three_dimension_x || !this.$route.query.three_dimension_y) return;
      // 画一个矩形框
      if (draw_frame) {
        let drawing_data = require("@/static/Json/frame_rectangle.json");
        this.canvas.shapeManager.openFile(JSON.stringify(drawing_data), true);
      }
      this.canvas.shapeManager.setFrameSize(Number(this.$route.query.three_dimension_x),Number(this.$route.query.three_dimension_y));
      // 需要自动保存
      if (this.$route.query.auto == 1)
        setTimeout(()=> { this.saveOrder('leave'); },2000);
    },
    /** 初始画布数据 **/
    initDrawingData(){
      if(!this.bgid){
        return;
      }
      this.$axios.post("/get_kjl_dd", {"good_id":this.bgid}).then((res) => {
              if(res.code==1){
                //console.log(res.data.drawing_data);
                  this.canvas.shapeManager.openFile(res.data.drawing_data, true);
                }else{
                  this.$VMessage.error(res.message);
                }
              })
              .catch((e) => {
                this.$VMessage.error("获取数据失败");
              });
    },
  },
  computed: {
    short_keys() {
      return webcc.ShortkeyHelper.shortKeys;
    },
    is_dirty: {
      get() {
        return this.$refs["right_card"].is_dirty;
      },
      set(value) {
        this.$refs["right_card"].is_dirty = value;
      }
    },
    ...mapState(["canvas"]),
    ...mapGetters(["isMobileDevice","isMobilePhone","isIOS"])
  },
  mounted() {
    //存在wid时，初始化2D数据
     if(localStorage.getItem('bgid')){
      this.bgid = localStorage.getItem('bgid');
      this.initDrawingData();
     }
    this.initActionBar();
    // 初始化画布
    this.$store.commit("setCanvas", webccCreator.create());
    this.initCanvasEvent();
    if(this.isMobilePhone){
      this.canvas.setCanvasScale(0.15,0.15);
    }
    if (sessionStorage.getItem("drawing_data")) {
      this.canvas.shapeManager.openFile(sessionStorage.getItem("drawing_data"), false);
      sessionStorage.removeItem("drawing_data");
      sessionStorage.removeItem("3d_data");
    }
    else this.resizeFrame(true);
    // 加载3d颜色
    if (sessionStorage.getItem("colors")) {
      let colors = JSON.parse(sessionStorage.getItem("colors"));
      let new_colors = JSON.parse(sessionStorage.getItem("3d_colors"));
      setTimeout(()=> {
        this.$refs['right_card'].$refs['color'].rewriteData({ color: colors.outside, color_two: colors.inside });
        this.$refs['right_card'].$refs['color'].wood_pic_list.forEach(item=> {
          item.outside = item.id == new_colors.outside;
          item.inside = item.id == new_colors.inside;
        });
      },1000);
      sessionStorage.removeItem("colors");
      sessionStorage.removeItem("3d_colors");
    }

    this.beforeRefreshClose();
  },
  components: { LeftCard, RightCard },
  beforeDestroy() {
    this.bus.$off("change-theme");
    this.bus.$off("do-action");
    this.bus.$off("before-leave");
    if (this.threeScene) this.threeScene.Close();
  }
};
</script>
<style lang="scss" scoped>
.theme--light .full-bg-auto {
  background-color: #f8f9fb;
}
.canvas {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
}
.footer {
  position: fixed;
  bottom: 0;
  z-index: 1;
  height: 28px;
  width: 100%;
  &.theme--light.v-system-bar {
    background-color: #fff;
    color: #333333;
  }
}
</style>