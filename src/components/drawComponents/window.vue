<!--
    @author qixf@thinkerx.com
    @remark 右侧卡片 - 开扇
    @created 2020/6/1
-->
<template>
  <v-card flat>
    <v-card-text>
      <v-tabs v-model="tab_index" height="40">
        <v-tabs-slider></v-tabs-slider>
        <v-tab class="sm-tab" flat
               v-for="(tab,index) in window_tab_show_list" :key="index" :href="`#tab-${tab.key}`"
               @click="resetPayload(tab,index)">
          {{tab.label}}
        </v-tab>
        <!-- 防盗框 -->
        <v-tab-item value="tab-AntiTheft">
          <v-container fluid>
            <!-- 间隔 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.interval")}}</span>
              <v-text-field outlined single-line v-model.number="payload.gap"></v-text-field>
            </v-row>
            <!-- 执手距离 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.handledistance")}}</span>
              <v-text-field outlined single-line v-model.number="payload.handleW"></v-text-field>
            </v-row>
            <!-- 方向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.direction")}}</span>
              <v-switch v-model="payload.orientation" color="primary"
                        true-value="horizon" false-value="vertical"></v-switch>
              <span v-if="payload.orientation=='horizon'">{{$t("rightmenu.kaishan.horizon")}}</span>
              <span v-if="payload.orientation=='vertical'">{{$t("rightmenu.kaishan.vertical")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 玻扇 -->
        <v-tab-item value="tab-Sash">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开启方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide && !payload.isFold">
              <span class="label">{{ $t('rightmenu.kaishan.kaiqifangshi') }}</span>
              <v-autocomplete v-model="payload.openDirection" outlined single-line
                              :items="open_direction_list" item-text="label" item-value="value">
                <template v-slot:selection="data">
                  <span>{{ data.item.label }}</span>
                </template>
                <template v-slot:item="data">
                  <i class="iconfont" :class="data.item.icon"></i>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.label"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-row>

            <!-- 显示隐藏执手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && ( payload.isFold || payload.isPush )">
              <span class="label">{{$t("rightmenu.kaishan.handleDisplay")}}</span>
              <v-switch v-model="payload.handleHidden" color="primary"
                :true-value="false" :false-value="true"></v-switch>
            </v-row>
             <!-- 执手标线 -->
            <v-row class="input-row" v-if="action=='sash_settings' && ( payload.isFold || payload.isPush )&&!payload.handleHidden">
              <span class="label">{{$t('rightmenu.kaishan.dimToGroundHidden')}}</span>
              <v-switch v-model="payload.dimToGroundHidden" color="primary"
                :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 合叶边 -->
            <v-row class="input-row" v-if="action=='sash_bar_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingeedge")}}</span>
              <v-switch v-model="payload.isHingeEdge" color="primary"
                :readonly="payload.isHingeEdge||payload.isHandleEdge"></v-switch>
            </v-row>
            <!-- 执手边 -->
            <v-row class="input-row" v-if="action=='sash_bar_settings'">
              <span class="label">{{$t("rightmenu.kaishan.handleedge")}}</span>
              <v-switch v-model="payload.isHandleEdge" color="primary"
                :readonly="payload.isHandleEdge||payload.isHingeEdge"></v-switch>
            </v-row>
            <!-- 折叠 扶手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isFold && !payload.handleForFoldHidden">
              <span class="label">{{$t("rightmenu.kaishan.handleForFold")}}</span>
              <v-text-field outlined single-line v-model.number="payload.handleForFoldOffset"></v-text-field>
            </v-row>
            <!-- 推拉 是否是固定扇 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.isfixed")}}</span>
              <v-switch v-model="payload.isFixed" color="primary"></v-switch>
            </v-row>
            <!-- 推拉 显示拉手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.ShowHidden")}}</span>
              <v-switch v-model="payload.slideHandleHidden" color="primary"
                :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 推拉 宽度 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.width")}}</span>
              <v-text-field outlined single-line v-model.number="payload.width"></v-text-field>
            </v-row>
            <!-- 开窗 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward"  color="primary"
                true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 合页类型 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.hingetp")}}</span>
              <v-switch v-model="payload.hingeType" color="primary"
                true-value="HingePro" false-value="Hinge"></v-switch>
              <span v-if="payload.hingeType=='Hinge'">{{$t("rightmenu.kaishan.TwoPartsStyle")}}</span>
              <span v-if="payload.hingeType=='HingePro'">{{$t("rightmenu.kaishan.ThreePartsStyle")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 执手位置 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide&&!payload.handleHidden">
              <span class="label">{{$t("rightmenu.kaishan.handleposition")}}</span>
              <v-text-field outlined single-line v-model.number="payload.handleOffset"></v-text-field>
            </v-row>
            <!-- 合页个数 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.hingeno")}}</span>
              <v-select outlined single-line v-model="payload.hingeCount" :items="[0,2,3,4,5]"></v-select>
            </v-row>

            <!-- 合页位置 -->
            <template v-if="action=='sash_settings' && !payload.isSlide">
              <v-row class="input-row"
                     v-for="(hinge,index) in payload.hingeOffsets" :key="index">
                <span class="label">{{$t("rightmenu.kaishan.hinge")}}{{index+1}}</span>
                <v-text-field outlined single-line v-model.number="payload.hingeOffsets[index].toFixed(2)"
                  @input="(value)=> { changeHingeOffset(value,index); }"></v-text-field>
              </v-row>
            </template>
          </v-container>
        </v-tab-item>
        <!-- 对开玻扇 -->
        <v-tab-item value="tab-DoubleSash">
          <v-container fluid>
             <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.opened!=undefined">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 均分 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.average")}}</span>
              <v-switch v-model="payload.autoSplit" color="primary"></v-switch>
            </v-row>

            <!-- 合页个数 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingeno")}}</span>
              <v-select outlined single-line v-model="payload.hingeCount" :items="[0,2,3,4,5]"></v-select>
            </v-row>

            <!-- 合叶类型 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingetp")}}</span>
              <v-switch v-model="payload.hingeType" color="primary"
                        true-value="HingePro" false-value="Hinge"></v-switch>
              <span v-if="payload.hingeType=='Hinge'">{{$t("rightmenu.kaishan.TwoPartsStyle")}}</span>
              <span v-if="payload.hingeType=='HingePro'">{{$t("rightmenu.kaishan.ThreePartsStyle")}}</span>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 折叠玻扇 -->
        <v-tab-item value="tab-FoldSash">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>

            <!-- 折叠方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.foldtype")}}</span>
              <div class="fold">
                <v-select outlined single-line v-model.number="fold_type.left"
                          :items="fold_type_list" @change="changeFold"></v-select>+
                <v-select outlined single-line v-model.number="fold_type.right"
                          :items="fold_type_list" @change="changeFold"></v-select>
              </div>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 纱扇 -->
        <v-tab-item value="tab-Screen">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开启方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide && !payload.isFold">
              <span class="label">{{ $t('rightmenu.kaishan.kaiqifangshi') }}</span>
              <v-autocomplete outlined single-line v-model="payload.openDirection"
                              :items="open_direction_list" item-text="label" item-value="value">
                <template v-slot:selection="data">
                  <span>{{ data.item.label }}</span>
                </template>
                <template v-slot:item="data">
                  <i class="iconfont" :class="data.item.icon"></i>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.label"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-row>
            <!-- 推拉 是否固定扇 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.isfixed")}}</span>
              <v-switch v-model="payload.isFixed" color="primary"></v-switch>
            </v-row>
            <!-- 推拉 显示拉手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.ShowHidden")}}</span>
              <v-switch v-model="payload.slideHandleHidden" color="primary"
                        :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 显示隐藏执手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && ( payload.isFold || payload.isPush )">
              <span class="label">{{$t("rightmenu.kaishan.handleDisplay")}}</span>
              <v-switch v-model="payload.handleHidden" color="primary"
                :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 执手标线 -->
            <v-row class="input-row" v-if="action=='sash_settings' && (payload.isFold || payload.isPush)&&!payload.handleHidden">
              <span class="label">{{$t('rightmenu.kaishan.dimToGroundHidden')}}</span>
              <v-switch v-model="payload.dimToGroundHidden" color="primary"
                :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 推拉 宽度 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.width")}}</span>
              <v-text-field outlined single-line v-model.number="payload.width"></v-text-field>
            </v-row>
            <!-- 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.opened!=undefined">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 合页边 -->
            <v-row class="input-row" v-if="action=='sash_bar_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingeedge")}}</span>
              <v-switch v-model="payload.isHingeEdge" color="primary"
                        :readonly="payload.isHingeEdge||payload.isHandleEdge"></v-switch>
            </v-row>
            <!-- 执手边 -->
            <v-row class="input-row" v-if="action=='sash_bar_settings'">
              <span class="label">{{$t("rightmenu.kaishan.handleedge")}}</span>
              <v-switch v-model="payload.isHandleEdge" color="primary"
                        :readonly="payload.isHandleEdge||payload.isHingeEdge"></v-switch>
            </v-row>
            <!-- 折叠 扶手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isFold && !payload.handleForFoldHidden">
              <span class="label">{{$t("rightmenu.kaishan.handleForFold")}}</span>
              <v-text-field outlined single-line v-model.number="payload.handleForFoldOffset"></v-text-field>
            </v-row>
            <!-- 合叶类型 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.hingetp")}}</span>
              <v-switch v-model="payload.hingeType" color="primary"
                        true-value="HingePro" false-value="Hinge"></v-switch>
              <span v-if="payload.hingeType=='Hinge'">{{$t("rightmenu.kaishan.TwoPartsStyle")}}</span>
              <span v-if="payload.hingeType=='HingePro'">{{$t("rightmenu.kaishan.ThreePartsStyle")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 执手位置 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide&&!payload.handleHidden">
              <span class="label">{{$t("rightmenu.kaishan.handleposition")}}</span>
              <v-text-field outlined single-line v-model.number="payload.handleOffset"></v-text-field>
            </v-row>
            <!-- 合页个数 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.hingeno")}}</span>
              <v-select outlined single-line v-model="payload.hingeCount" :items="[0,2,3,4,5]"></v-select>
            </v-row>
            <!-- 合页位置 -->
            <template v-if="action=='sash_settings' && !payload.isSlide">
              <v-row class="input-row"
                     v-for="(hinge,index) in payload.hingeOffsets" :key="index">
                <span class="label">{{$t("rightmenu.kaishan.hinge")}}{{index+1}}</span>
                <v-text-field outlined single-line v-model.number="payload.hingeOffsets[index].toFixed(2)"
                              @input="(value)=> { changeHingeOffset(value,index); }"></v-text-field>
              </v-row>
            </template>
          </v-container>
        </v-tab-item>
        <!-- 对开纱扇 -->
        <v-tab-item value="tab-DoubleScreen">
          <v-container fluid>
             <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.opened!=undefined">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 均分 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.average")}}</span>
              <v-switch v-model="payload.autoSplit" color="primary"></v-switch>
            </v-row>
            <!-- 合页类型 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingetp")}}</span>
              <v-switch v-model="payload.hingeType" color="primary"
                        true-value="HingePro" false-value="Hinge"></v-switch>
              <span v-if="payload.hingeType=='Hinge'">{{$t("rightmenu.kaishan.TwoPartsStyle")}}</span>
              <span v-if="payload.hingeType=='HingePro'">{{$t("rightmenu.kaishan.ThreePartsStyle")}}</span>
            </v-row>
            <!-- 合页个数 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingeno")}}</span>
              <v-select outlined single-line v-model="payload.hingeCount" :items="[0,2,3,4,5]"></v-select>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 折叠纱扇 -->
        <v-tab-item value="tab-FoldScreen">
          <v-container fluid>
            <!-- 折叠方向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.zhexiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.infold")}}</span>
              <span v-if="payload.openToward=='outfold'">{{$t("rightmenu.kaishan.ou tside")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
             <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 折叠方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.foldtype")}}</span>
              <div class="fold">
                <v-select outlined single-line v-model.number="fold_type.left"
                          :items="fold_type_list" @change="changeFold"></v-select>+
                <v-select outlined single-line v-model.number="fold_type.right"
                          :items="fold_type_list" @change="changeFold"></v-select>
              </div>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 推拉扇 -->
        <v-tab-item value="tab-Slide">
          <v-container fluid>
            <!-- 复位操作 -->
            <v-row class="input-row">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary" :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
             <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 推拉方式设置 -->
            <v-row class="input-row">
              <span class="label">{{$t('rightmenu.kaishan.SlideOption')}}</span>
            </v-row>
            <v-row class="pic-row">
              <v-col v-for="(slide, index) in slide_type_list" :key="index" :cols="6">
                <v-card flat class="pic-card" @click.stop="selectSlide(slide)" tile>
                  <img :src="slide.url" crossorigin="Anonymous" />
                  <i class="iconfont iconxuanze1 chosen" v-if="slide.is_selected"></i>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 肯德基 -->
        <v-tab-item value="tab-KfcSash">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开启方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{ $t('rightmenu.kaishan.kaiqifangshi') }}</span>
              <v-autocomplete v-model="payload.openDirection" outlined single-line
                              :items="open_direction_list" item-text="label" item-value="value">
                <template v-slot:selection="data">
                  <span>{{ data.item.label }}</span>
                </template>
                <template v-slot:item="data">
                  <i class="iconfont" :class="data.item.icon"></i>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.label"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-row>
            <!-- 开窗 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward"  color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 执手类型 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.handleType")}}</span>
              <v-select outlined single-line v-model="payload.handleType" :items="kfc_handle_types" item-value="value" item-text="text"></v-select>
              <!--<v-switch v-model="payload.handleType" color="primary"-->
                        <!--true-value="cross" false-value="default"></v-switch>-->
              <!--<span v-if="payload.handleType=='default'">{{$t("rightmenu.kaishan.handleTypeDefault")}}</span>-->
              <!--<span v-if="payload.handleType=='cross'">{{$t("rightmenu.kaishan.handleTypeCross")}}</span>-->
            </v-row>
            <!-- 执手标线 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t('rightmenu.kaishan.dimToGroundHidden')}}</span>
              <v-switch v-model="payload.dimToGroundHidden" color="primary"
                        :true-value="false" :false-value="true"></v-switch>
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 对开肯德基 -->
        <v-tab-item value="tab-DoubleKfcSash">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.opened!=undefined">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 执手类型 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.handleType")}}</span>
              <v-select outlined single-line v-model="payload.handleType" :items="kfc_handle_types" item-value="value" item-text="text"></v-select>
              <!--<v-switch v-model="payload.handleType" color="primary"-->
                        <!--true-value="cross" false-value="default"></v-switch>-->
              <!--<span v-if="payload.handleType=='default'">{{$t("rightmenu.kaishan.handleTypeDefault")}}</span>-->
              <!--<span v-if="payload.handleType=='cross'">{{$t("rightmenu.kaishan.handleTypeCross")}}</span>-->
            </v-row>
          </v-container>
        </v-tab-item>
        <!-- 百叶窗 -->
        <v-tab-item value="tab-ShadePushSash">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开启方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide && !payload.isFold">
              <span class="label">{{ $t('rightmenu.kaishan.kaiqifangshi') }}</span>
              <v-select v-model="payload.openDirection" outlined single-line
                        :items="open_direction_list" item-text="label" item-value="value">
                <template v-slot:selection="data">
                  <span>{{ data.item.label }}</span>
                </template>
                <template v-slot:item="data">
                  <i class="iconfont" style="font-size:40px" :class="data.item.icon"></i>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.label" style="font-size:12px"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-row>
            <!-- 一字锁 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide && JSON.stringify(payload.slideLockHidden)!=''">
              <span class="label">一字锁</span>
              <v-switch v-model="payload.slideLockHidden" color="primary" :true-value="false" :false-value="true"
              ></v-switch>
            </v-row>
            <!-- 显示月牙锁 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">月牙锁</span>
              <v-select outlined single-line v-model="payload.crescentLockShown" :items="slide_lockType_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 显示隐藏执手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && ( payload.isFold || payload.isPush )">
              <span class="label">{{$t("rightmenu.kaishan.handleDisplay")}}</span>
              <v-switch v-model="payload.handleHidden" color="primary"
                        :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 执手标线 -->
            <v-row class="input-row" v-if="action=='sash_settings' && ( payload.isFold || payload.isPush )&&!payload.handleHidden">
              <span class="label">{{$t('rightmenu.kaishan.dimToGroundHidden')}}</span>
              <v-switch v-model="payload.dimToGroundHidden" color="primary"
                        :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 合叶边 -->
            <v-row class="input-row" v-if="action=='sash_bar_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingeedge")}}</span>
              <v-switch v-model="payload.isHingeEdge" color="primary"
                        :readonly="payload.isHingeEdge||payload.isHandleEdge"></v-switch>
            </v-row>
            <!-- 执手边 -->
            <v-row class="input-row" v-if="action=='sash_bar_settings'">
              <span class="label">{{$t("rightmenu.kaishan.handleedge")}}</span>
              <v-switch v-model="payload.isHandleEdge" color="primary"
                        :readonly="payload.isHandleEdge||payload.isHingeEdge"></v-switch>
            </v-row>
            <!-- 折叠 扶手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isFold && !payload.handleForFoldHidden">
              <span class="label">{{$t("rightmenu.kaishan.handleForFold")}}</span>
              <v-text-field outlined single-line v-model.number="payload.handleForFoldOffset"></v-text-field>
            </v-row>
            <!-- 推拉 是否是固定扇 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.isfixed")}}</span>
              <v-switch v-model="payload.isFixed" color="primary"></v-switch>
            </v-row>
            <!-- 推拉 显示拉手 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.ShowHidden")}}</span>
              <v-switch v-model="payload.slideHandleHidden" color="primary"
                        :true-value="false" :false-value="true"></v-switch>
            </v-row>
            <!-- 推拉 宽度 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.width")}}</span>
              <v-text-field outlined single-line v-model.number="payload.width"></v-text-field>
            </v-row>
            <!-- 开窗 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward"  color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 合页类型 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.hingetp")}}</span>
              <v-switch v-model="payload.hingeType" color="primary"
                        true-value="HingePro" false-value="Hinge"></v-switch>
              <span v-if="payload.hingeType=='Hinge'">{{$t("rightmenu.kaishan.TwoPartsStyle")}}</span>
              <span v-if="payload.hingeType=='HingePro'">{{$t("rightmenu.kaishan.ThreePartsStyle")}}</span>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 打孔高度 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide&&!payload.handleHidden">
              <span class="label">打孔位置</span>
              <v-text-field outlined single-line v-model.number="payload.readableHandleOffset"></v-text-field>
            </v-row>
            <!-- 合页个数 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">{{$t("rightmenu.kaishan.hingeno")}}</span>
              <v-select outlined single-line v-model="payload.hingeCount" :items="[0,2,3,4,5]"></v-select>
            </v-row>

            <!-- 合页位置 -->
            <template v-if="action=='sash_settings' && !payload.isSlide">
              <v-row class="input-row"
                     v-for="(hinge,index) in payload.hingeOffsets" :key="index">
                <span class="label">{{$t("rightmenu.kaishan.hinge")}}{{index+1}}</span>
                <v-text-field outlined single-line v-model.number="payload.hingeOffsets[index].toFixed(2)"
                              @input="(value)=> { changeHingeOffset(value,index); }"></v-text-field>
              </v-row>
            </template>
          </v-container>
        </v-tab-item>
        <!-- 对开百叶窗 -->
        <v-tab-item value="tab-DoubleShadePushSash">
          <v-container fluid>
            <!-- 连接方式 -->
            <v-row class="input-row" v-if="action=='sash_settings' && !payload.isSlide">
              <span class="label">连接方式</span>
              <v-select outlined single-line v-model="payload.jointWay" :items="edge_joint_way_list" item-value="value" item-text="label"></v-select>
            </v-row>
            <!-- 开向 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.kaixiang")}}</span>
              <v-switch v-model="payload.openToward" color="primary"
                        true-value="inward" false-value="outward"></v-switch>
              <span v-if="payload.openToward=='inward'">{{$t("rightmenu.kaishan.inside")}}</span>
              <span v-if="payload.openToward=='outward'">{{$t("rightmenu.kaishan.outside")}}</span>
            </v-row>
            <!-- 开窗 -->
            <v-row class="input-row" v-if="action=='sash_settings' && payload.opened!=undefined">
              <span class="label">{{$t('rightmenu.kaishan.openwindow')}}</span>
              <v-switch v-model="payload.opened" color="primary"></v-switch>
            </v-row>
            <!-- 复位操作 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span class="label">{{$t("rightmenu.kaishan.fuwei")}}</span>
                  <v-switch v-on="on" v-model="payload.hasOffset" color="primary"
                            :readonly="!payload.hasOffset"></v-switch>
                </template>
                <span>{{$t("rightmenu.kaishan.fuweidesc")}}</span>
              </v-tooltip>
            </v-row>
            <!-- 均分 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.average")}}</span>
              <v-switch v-model="payload.autoSplit" color="primary"></v-switch>
            </v-row>

            <!-- 合页个数 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingeno")}}</span>
              <v-select outlined single-line v-model="payload.hingeCount" :items="[0,2,3,4,5]"></v-select>
            </v-row>

            <!-- 合叶类型 -->
            <v-row class="input-row" v-if="action=='sash_settings'">
              <span class="label">{{$t("rightmenu.kaishan.hingetp")}}</span>
              <v-switch v-model="payload.hingeType" color="primary"
                        true-value="HingePro" false-value="Hinge"></v-switch>
              <span v-if="payload.hingeType=='Hinge'">{{$t("rightmenu.kaishan.TwoPartsStyle")}}</span>
              <span v-if="payload.hingeType=='HingePro'">{{$t("rightmenu.kaishan.ThreePartsStyle")}}</span>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      fold_type_list: Array.from(Array(30), (v,k) =>k),
      action: '',
      payload: null, payload_list: [], payload_origin: null,
      is_single: false,
      window_tab_list: [
        { key: 'AntiTheft', label: this.$t('rightmenu.kaishan.AntiTheft') },  // 防盗框
        { key: 'Sash', label: this.$t('rightmenu.kaishan.kaishan') },  // 玻扇
        { key: 'DoubleSash', label: this.$t('rightmenu.kaishan.DoubleSash') },  // 对开玻扇
        { key: 'FoldSash', label: this.$t('rightmenu.kaishan.FoldSash') },  // 折叠玻扇
        { key: 'Screen', label: this.$t('rightmenu.kaishan.Screen') },  // 纱扇
        { key: 'DoubleScreen', label: this.$t('rightmenu.kaishan.DoubleScreen') },  // 对开纱扇
        { key: 'FoldScreen', label: this.$t('rightmenu.kaishan.FoldScreen') },  // 折叠纱扇
        { key: 'Slide', label: this.$t('rightmenu.kaishan.Slide') },  // 推拉扇
        { key: 'KfcSash', label: this.$t('rightmenu.kaishan.KfcSash') },  // 肯德基
        { key: 'DoubleKfcSash', label: this.$t('rightmenu.kaishan.DoubleKfcSash') },  // 对开肯德基
        { key: 'ShadePushSash', label: "百叶窗" },  // 百叶窗
        { key: 'DoubleShadePushSash', label: "对开百叶窗" },  // 对开百叶窗
      ],
      tab_index: '',
      slide_type_list: [
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/2-1-2.png",
          "applied_option_index": 0, is_selected: true },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/5-1-2.png",
          "applied_option_index": 1, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/5-1-5.png",
          "applied_option_index": 8, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/4-1-3.png",
          "applied_option_index": 2, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/4-1-4.png",
          "applied_option_index": 3, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/5-1-1.png",
          "applied_option_index": 4, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/5-1-4.png",
          "applied_option_index": 5, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/5-1-3.png",
          "applied_option_index": 6, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/2.png",
          "applied_option_index": 7, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/9.png",
          "applied_option_index": 9, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/10.png",
          "applied_option_index": 10, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/11.png",
          "applied_option_index": 11, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/12.png",
          "applied_option_index": 12, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/1-3.png",
          "applied_option_index": 13, is_selected: false },
        { "url": "https://webcc-pro.thinkerx.com/imge/slideoption/1-4.png",
          "applied_option_index": 14, is_selected: false }
      ],
      window_tab_cache: [],
      kfc_handle_types: [
        { value: "default", text: this.$t("rightmenu.kaishan.handleTypeDefault") },
        { value: "cross", text: this.$t("rightmenu.kaishan.handleTypeCross") },
        { value: "waist", text: this.$t("rightmenu.kaishan.handleTypeWaist") },
      ]
    }
  },
  computed: {
    window_tab_show_list() {
      if (!this.payload_origin) return [];
      if (this.action === 'sash_bar_settings') return this.window_tab_cache;
      let result = [];
      if (this.is_single) {  // 对多个扇中的一个扇进行操作
        let tab_key = this.payload_origin.target.type;
        let tab = this.window_tab_list.filter(item=> { return item.key === tab_key; })[0];
        result.push(tab);
        this.tab_index = `tab-${tab_key}`;
        this.payload = this.payload_origin;
      } else {
        let tab_keys = [];
        this.payload_origin.settings.forEach(item=> {
          tab_keys.push(item.target.type);
        });
        tab_keys.forEach((tab_key,index)=> {
          let tab = this.window_tab_list.filter(item=> { return item.key === tab_key; })[0];
          result.push(tab);
          if (this.payload_origin.activeIndex === index)
            this.tab_index = `tab-${tab_key}`;
        });
        this.payload_list = this.payload_origin.settings;
        // 获取当前选中部件的 payload
        this.payload = this.payload_origin.settings[this.payload_origin.activeIndex];
      }
      // 合页执手边 tab 暂存
      this.window_tab_cache = result;
      return result;
    },
    fold_type() {  // 折叠方式
      if (!this.payload || !this.payload.foldWay) return {};
      let left = parseInt(this.payload.foldWay.split("+")[0]);
      let right = parseInt(this.payload.foldWay.split("+")[1]);
      return { left, right };
    },
    open_direction_list() {  // 开启方向列表
      return [
        { label: this.$t("rightmenu.kaishan.zuokai"), value: "left", icon: "iconzuokai" }, // 左开
        { label: this.$t("rightmenu.kaishan.youkai"), value: "right", icon: "iconyoukai" }, // 右开
        { label: this.$t("rightmenu.kaishan.shangxuean"), value: "up", icon: "iconshchang" }, // 上悬
        { label: this.$t("rightmenu.kaishan.neidao"), value: "down", icon: "iconxia" }, // 内倒
        { label: this.$t("rightmenu.kaishan.left_with_up"), value: "left_with_up", icon: "iconshcha" }, // 上悬-左
        { label: this.$t("rightmenu.kaishan.right_with_up"), value: "right_with_up", icon: "iconshcha1" }, // 上悬-右
        { label: this.$t("rightmenu.kaishan.left_with_down"), value: "left_with_down", icon: "iconneidao-zuo" }, // 内倒-左
        { label: this.$t("rightmenu.kaishan.right_with_down"), value: "right_with_down", icon: "iconneidao-you" }, // 内倒-右
      ];
    },
    edge_joint_way_list(){//连接方式
      return [
        {label:this.$t("rightmenu.waikuang.xie"),value:0},
        {label:this.$t("rightmenu.waikuang.heng"),value:1},
        {label:this.$t("rightmenu.waikuang.shu"),value:2},
      ]
    }
  },
  methods: {
    /** 设置合叶位置 **/
    changeHingeOffset(value,index) {
      if (!value || value=='-') return;
      let cache = JSON.parse(JSON.stringify(this.payload.hingeOffsets));
      cache[index] = Number(value);
      this.payload.hingeOffsets = cache;
    },
    /** 设置折叠方式 **/
    changeFold() {
      let fold_way = `${this.fold_type.left}+${this.fold_type.right}`;
      this.payload.foldWay = fold_way;
    },
    /** 选择推拉方式 **/
    selectSlide(slide) {
      this.slide_type_list.forEach(item=> {
        item.is_selected = false;
      });
      slide.is_selected = true;
      this.payload.appliedOptionIndex = slide.applied_option_index;
    },
    /** 清除 数据初始化 **/
    dataInitialization() {
      this.action = '';
    },
    /** 多个组件tab 切换 payload **/
    resetPayload(tab,index) {
      // 会触发 window_tab_show_list computed
      this.payload_origin.activeIndex = index;
    }
  }
};
</script>

<style scoped lang="scss">
@import "./common.css";
.v-tabs:not(.v-tabs--vertical) .v-tab {
  white-space: inherit;
}
.v-tabs-items { background-color: #fff0 !important; }
.pic-row {
  margin-right: 0; margin-top: 10px;
  .v-card { background-color: #fff0 !important; }
  .col-6 { padding: 6px 0; }
  .pic-card {
    width: 97px; height: 46px;
    border: 1px solid #dddddd;
    img {
      margin: 10px auto 0;
      width: 78px;height: 26px;
      display: block;
    }
    .chosen {
      position: relative; top: -30px; right: -62px;
      color: #38c088;
      font-size: 35px;
    }
  }
}
</style>