<template>
  <div class="show-main">
    <el-scrollbar height="100%">
      <ul class="main-main">
        <li v-for="(item,index) in chartList" :key="index">
          <div class="box-top">
            <h1 >{{ chartList[index].chartName}}</h1>
            <div class="toolBox">
              <el-icon @click="delChartBtn(index)" style="font-size: 20px;margin-left: 10px">
                <delete />
              </el-icon>
            </div>
          </div>
          <div class="box-main" v-if="chartList[index].chartData.length===1">
            <MyChart :data="chartList[index].chartData[0]" :index="index" :type="chartList[index].chartType" :is-del="chartList[index].isDel"></MyChart>
          </div>
          <div class="box-main" v-else>
            <div class="splitChart">
              <MyChart :data="chartList[index].chartData[0]" :index="index" :type="chartList[index].chartType" :is-del="chartList[index].isDel"></MyChart>
            </div>
            <div class="splitChart">
              <MyChart :data="chartList[index].chartData[1]" :index="index" :type="chartList[index].chartType" :is-del="chartList[index].isDel"></MyChart>
            </div>
          </div>
        </li>
      </ul>
      <div class="show-bottom">
        <div class="show-msg"
             v-for="(item,index) in errorMsg"
             :key="index"
        >
          <el-container style="margin-left: 20px">
            <el-header style="font-size: 20px;height: 40px;color:rgb(5,110,178) ">{{item.title}}</el-header>
            <el-container
                v-for="(subItem,subIndex) in item.value"
                :key="subIndex"
                style="margin-left: 20px"
            >
              <el-header style="height: 20px;">{{subItem.subtitle}}</el-header>
              <el-main
                  v-for="(minItem,minIndex) in subItem.msg"
                  :key="minIndex"
                  style="margin-left: 20px"
              >{{minItem}}</el-main>
            </el-container>

          </el-container>

        </div>
      </div>
    </el-scrollbar>
    <el-dialog
        title="删除"
        v-model="dialogVisible"
        width="30%"
    >
      <span>是否删除该控制图？</span>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="trueDel">确 定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>

import {inject, onMounted, reactive, ref, watch} from "vue";
import {Delete} from '@element-plus/icons-vue'
import emitter from "../../plugins/Bus.js";
import MyChart from "./MyChart.vue";
import { chartData } from "@/store/chartData.js"
import api from '@/api/groupChart.js'
//
const chartDataStore = chartData();
let echarts = inject("echarts")
const chartList = ref([])
const dialogVisible = ref(false)
const currentChart = ref()
const errorMsg = ref([])


const delChartBtn = (index) =>{
  dialogVisible.value = true
  currentChart.value = index
}
const trueDel = () => {
  chartList.value.splice(currentChart.value,1)
  chartDataStore.chartData = JSON.parse(JSON.stringify(chartList.value))
  dialogVisible.value = false
}

const collectErrorMsg = () => {
  const chart = chartList.value;
  errorMsg.value = []
  for (let i =0;i<chart.length;i++){
    let title = chart[i].chartName +"检验结果"
    let value = []
    for (let j =0;j<chart[i].chartData.length;j++){
      let subtitle = chart[i].chartData[j].chartType +"控制图"
      let msg =[]
      for (let k =0;k<chart[i].chartData[j].chartCriterion.length;k++){
        if (chart[i].chartData[j].chartCriterion[k].fit){
          msg.push(chart[i].chartData[j].chartCriterion[k].msg)
        }
      }
      if (msg.length !==0){
        let subObj = {subtitle:subtitle,msg:msg}
        value.push(subObj)
      }
    }
    if (value.length !==0){
      let obj = {title:title,value:value}
      errorMsg.value.push(obj)
    }
  }
}

// const delXbarR = (delParam) =>{
//   console.log("delXbarR")
//   console.log(delParam)
//
//
//
//
// }

watch(chartList,(newVal)=>{
  let newPromise = new Promise((resolve) => {
    chartList.value = newVal
    resolve()
  })
  newPromise.then(()=>{
    collectErrorMsg()
  })
},{immediate:true,deep:true})

onMounted(()=>{
  const data =JSON.parse(JSON.stringify(chartDataStore.chartData))
  chartList.value = data
  emitter.on('chart',(e) =>{
    chartList.value = e
  })

  // emitter.on('delPoint',(e) =>{
  //   console.log("接受到了")
  //   console.log(e)
  //   switch (e.chartType){
  //     case "XbarR":
  //       delXbarR(e)
  //       break
  //   }
  //
  // })

})

</script>

<style scoped>
.show-main{
  width: 100%;
  height: 100%;
  /*background:red ;*/
  /*flex-wrap: wrap;*/
  /*display: flex;*/
  /*justify-content: space-between;*/

}
.main-main{
  display: flex;
  justify-content: space-between;
  align-items: normal;
  /*justify-content: space-between;*/
  flex-wrap: wrap;
}
.main-main li{
  float: left;
  margin: 10px;

  width: calc(50% - 20px);
  height: 500px;
  /*background: blue;*/
  box-shadow: 1px 3px 3px rgba(27,39,94,0.1);
}
.box-top{
  width: 100%;
  height: 5%;
  display: flex;
  /*background: red;*/
}

.box-top h1{
  margin-left: 50px;
  font-size: 20px;
  width: 70%;
}
.toolBox{
  height: 100%;
  width: 20%;
  margin-left: 30px;
  display: flex;
  float: right;
  /*justify-content: center;*/
  align-items: center;
}
.box-top el-icon{
  margin-left: 20px;
  /*font-size: 20px;*/
}
.box-main{
  width: 100%;
  height: 96%;
  display: flex;
  flex-direction: column;

}
.splitChart{
  width: 100%;
  height: 48%;
  /*margin-top: -40px;*/
}
.show-bottom{
  width: 100%;
  min-height: 200px;
  height: auto;
}
</style>