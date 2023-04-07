<template>
  <el-aside>
    <el-scrollbar>
      <el-menu
          unique-opened
          style="height: 89.5vh"
          :collapse="isCollapse"
      >
        <div class="aside-top" @click="isCollapse=!isCollapse; ">
          <span>点击收起</span>
          <el-icon style="margin-left: 10px" >
            <ArrowLeftBold  v-show="!isCollapse"/>
            <ArrowRightBold v-show="isCollapse"/>
          </el-icon>
        </div>
        <el-sub-menu index="1">
          <template #title>
            <i class="iconfont icon-bx-bar-chart-square" style="font-size: 23px ;margin-right: 10px" ></i>
            <span>子组的变量控制图</span>
          </template>
          <el-menu-item index="1-1">
            <el-tooltip
                :visible="visible.XbarRVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中具有连续数据时，监视过程的均值和变异（极差）。<br />在子组大小为8或更小时效果最佳。</span>
              </template>
              <span @mouseenter="visible.XbarRVisible = true" @mouseleave="visible.XbarRVisible = false" @click="XbarRDialog = true">
                Xbar-R控制图
              </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="1-2">
            <el-tooltip
                :visible="visible.XbarSVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中具有连续数据时，监视您的过程的均值和变异（标准差）。</span>
              </template>
              <span @mouseenter="visible.XbarSVisible = true" @mouseleave="visible.XbarSVisible = false" @click="XbarSDialog = true">
              Xbar-S控制图
            </span>
            </el-tooltip>
            <!--          <span>Xbar-S控制图</span>-->
          </el-menu-item>
          <el-menu-item index="1-3">
            <el-tooltip
                :visible="visible.XbarVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中具有连续数据时，监视过程的均值。</span>
              </template>
              <span @mouseenter="visible.XbarVisible = true" @mouseleave="visible.XbarVisible = false" @click="XbarDialog = true">
              Xbar控制图
            </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="1-4">
            <el-tooltip
                :visible="visible.RVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中具有连续数据时，监视过程的变异（极差）。<br />在子组大小为8或更小时效果最佳。</span>
              </template>
              <span @mouseenter="visible.RVisible = true" @mouseleave="visible.RVisible = false" @click="RDialog = true">
              R控制图
            </span>
            </el-tooltip>
          </el-menu-item >
          <el-menu-item index="1-5">
            <el-tooltip
                :visible="visible.SVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中具有连续数据时，监视过程的变异（标准差）。<br />在子组大小为8或更小时效果最佳。</span>
              </template>
              <span @mouseenter="visible.SVisible = true" @mouseleave="visible.SVisible = false" @click="SDialog = true">
              S控制图
            </span>
            </el-tooltip>

          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <i class="iconfont icon-chart-" style="font-size: 23px;margin-right: 10px" ></i>
            <span>单值的变量控制图</span>
          </template >
          <el-menu-item index="2-1">
            <el-tooltip
                :visible="visible.IMRVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中没有连续数据（独立观测值）时，<br />监视过程的均值和变异（移动极差）。</span>
              </template>
              <span @mouseenter="visible.IMRVisible = true" @mouseleave="visible.IMRVisible = false" @click="IMRDialog = true">
                I-MR控制图
              </span>
            </el-tooltip>
          </el-menu-item>
<!--          <el-menu-item index="2-2">-->
<!--            <el-tooltip-->
<!--                :visible="visible.ZMRVisible"-->
<!--                effect="light"-->
<!--                placement="right-start"-->
<!--            >-->
<!--              <template #content>-->
<!--                <span>在为某个部件设置相对较少的单位（如短期过程）时，<br />监视不同部件的均值和变异（移动极差）。</span>-->
<!--              </template>-->
<!--              <span @mouseenter="visible.ZMRVisible = true" @mouseleave="visible.ZMRVisible = false">-->
<!--                Z-MR控制图-->
<!--              </span>-->
<!--            </el-tooltip>-->
<!--          </el-menu-item>-->
          <el-menu-item index="2-3">
            <el-tooltip
                :visible="visible.IVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中没有连续数据（独立观测值）时，监视过程的均值。</span>
              </template>
              <span @mouseenter="visible.IVisible = true" @mouseleave="visible.IVisible = false" @click="IDialog = true">
                单值控制图
              </span>
            </el-tooltip>
          </el-menu-item >
          <el-menu-item index="2-4">
            <el-tooltip
                :visible="visible.MRVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中没有连续数据（独立观测值）时，监视过程的变异（移动极差）。</span>
              </template>
              <span @mouseenter="visible.MRVisible = true" @mouseleave="visible.MRVisible = false" @click="MRDialog = true">
                移动极差控制图
              </span>
            </el-tooltip>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <i class="iconfont icon-chart" style="font-size: 20px;margin-right: 10px"></i>
            <span>属性控制图</span>
          </template>
          <el-menu-item index="3-1">
            <el-tooltip
                :visible="visible.PVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>在子组中没有连续数据（独立观测值）时，监视过程的变异（移动极差）。</span>
              </template>
              <span @mouseenter="visible.PVisible = true" @mouseleave="visible.PVisible = false" @click="PDialog = true">
                P控制图
              </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="3-2">
            <el-tooltip
                :visible="visible.LaneyPVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>创建可更正过度离散或欠离散问题的P控制图。</span>
              </template>
              <span @mouseenter="visible.LaneyPVisible = true" @mouseleave="visible.LaneyPVisible = false" @click="LaneyPDialog = true">
                Laney P’控制图
              </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="3-3">
            <el-tooltip
                :visible="visible.NPVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>监视每个子组的不良品数，在将每个不良品分类为<br/>两种类别之一（如通过或失败）时使用。</span>
              </template>
              <span @mouseenter="visible.NPVisible = true" @mouseleave="visible.NPVisible = false" @click="NPDialog = true">
                NP控制图
              </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="3-4">
            <el-tooltip
                :visible="visible.UVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>监视每个单位的缺陷数，在将每个不良品具有多个缺陷时使用。</span>
              </template>
              <span @mouseenter="visible.UVisible = true" @mouseleave="visible.UVisible = false" @click="UDialog = true">
                U控制图
              </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="3-5">
            <el-tooltip
                :visible="visible.LaneyUVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>创建可更正过度离散或欠离散问题的U控制图。</span>
              </template>
              <span @mouseenter="visible.LaneyUVisible = true" @mouseleave="visible.LaneyUVisible = false" @click="LaneyUDialog = true">
                Laney U’控制图
              </span>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item index="3-6">
            <el-tooltip
                :visible="visible.CVisible"
                effect="light"
                placement="right-start"
            >
              <template #content>
                <span>监视每个子组的缺陷数，在将每个不良品具有多个缺陷时使用。</span>
              </template>
              <span @mouseenter="visible.CVisible = true" @mouseleave="visible.CVisible = false" @click="CDialog = true">
                C控制图
              </span>
            </el-tooltip>
          </el-menu-item>
        </el-sub-menu>

      </el-menu>
    </el-scrollbar>

  </el-aside>
  <Dialog></Dialog>
  <SingleValueDialog></SingleValueDialog>
  <AttributeDialog></AttributeDialog>

</template>

<script setup>
import {reactive, ref} from "vue";
import { XbarRDialog,XbarSDialog,XbarDialog,RDialog,SDialog,
  IMRDialog,IDialog,MRDialog,
  PDialog,LaneyPDialog,NPDialog,UDialog,LaneyUDialog,CDialog
} from "./isShowDialog.js"
import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'
import Dialog from "./Dialog.vue";
import SingleValueDialog from "./SingleValueDialog.vue";
import { table } from "@/store/table.js";
import emitter from "../../plugins/Bus.js";
import AttributeDialog from "./AttributeDialog.vue";
const visible =reactive({
  XbarRVisible:false,
  XbarSVisible:false,
  XbarVisible:false,
  SVisible:false,
  RVisible:false,
  IMRVisible:false,
  ZMRVisible:false,
  IVisible:false,
  MRVisible:false,
  PVisible:false,
  LaneyPVisible:false,
  NPVisible:false,
  UVisible:false,
  LaneyUVisible:false,
  CVisible:false,
})
const tableStore = table();
let isCollapse = ref(false)

// const XbarR = () => {
//   XbarRDialog.value = true
//   const tableData = tableStore.tableData
//   emitter.emit('tableData',tableData);
// }

</script>

<style lang="scss" scoped>
.el-aside{
  background: rgb(238,238,238);
  height: 100%;
  width: auto;
}
.el-menu{
  background: rgb(238,238,238);
  border-right: none;
  width: 200px;
  height: 100%;
  &.el-menu--collapse{
    width: 60px;
    background: rgb(238,238,238);
    & span{
      display: none;
    }
  }

}
.aside-top{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

}

</style>