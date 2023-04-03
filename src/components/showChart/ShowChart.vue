<template>
  <div class="show-main">
    <el-scrollbar height="100%">
      <ul class="main-main">
<!--        <el-button @click="test">按钮</el-button>-->
        <li v-for="(item,index) in chartList" :key="index">
          <div class="box-top">
            <h1 >{{ chartList[index].chartName}}</h1>
          </div>
          <div class="box-main" v-if="chartList[index].chartData.length===1">
            <MyChart :data="chartList[index].chartData[0]"></MyChart>
          </div>
          <div class="box-main" v-else>
            <div class="splitChart">
              <MyChart :data="chartList[index].chartData[0]"></MyChart>
            </div>
            <div class="splitChart">
              <MyChart :data="chartList[index].chartData[1]"></MyChart>
            </div>
          </div>
<!--          <div class="box-bottom"></div>-->
<!--          <div :id="'chart'+index" style="width: 100%;height: 100%"></div>-->
        </li>
      </ul>
    </el-scrollbar>
  </div>

</template>

<script setup>

import {inject, onMounted, reactive, ref, watch} from "vue";
import emitter from "../../plugins/Bus.js";
import MyChart from "./MyChart.vue";

let echarts = inject("echarts")
const chartList = ref([])
const data = reactive({
  chartData:[1.5, 3.5, 5.5, 7.5, 9.5],
  chartCL:[5.5,5.5,5.5,5.5,5.5],
  chartUCL:[7.3806, 7.3806, 7.3806, 7.3806, 7.3806],
  chartLCL:[3.6194, 3.6194, 3.6194, 3.6194, 3.6194],
})


// const chart = () => {
//
//   console.log("chart执行")
//   const chart = echarts.init( document.getElementById("chart0"));
//   // document.getElementById('barChart2').removeAttribute('echarts_instance');
//   console.log(chartList.value[0].chartName)
//   const Option = {
//     title: {
//       text: chartList.value[0].chartName,
//     },
//
//     tooltip: {
//       trigger: 'axis'
//     },
//     xAxis: {
//       type: 'value',
//     },
//     // 声明一个 Y 轴，数值轴。
//     yAxis: {
//       type: 'value'
//
//     },
//     // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
//     series: [
//       {
//         type: 'line' ,
//         data: chartList.value[0].chartData.dataXbar
//       }
//     ]
//   };
//   // const option = {
//   //   xAxis: {
//   //     type: 'category',
//   //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   //   },
//   //   yAxis: {
//   //     type: 'value'
//   //   },
//   //   series: [
//   //     {
//   //       data: [150, 230, 224, 218, 135, 147, 260],
//   //       type: 'line'
//   //     }
//   //   ]
//   // };
//   // document.getElementById("chart"+ 0 ).setAttribute('_echarts_instance_', '');
//   chart.setOption(Option);
//
// }
const test = () => {
  let newPromise = new Promise((resolve) => {
    changeChartList()
    resolve()
  })
  newPromise.then(()=>{

  })
}
const changeChartList = () => {

  chartList.value=[
    {chartName:"1的Xbar控制图",chartData:[1,2,3,4,5]},
    {chartName:1,chartData:[1,2,3,4,5]},
    {chartName:1,chartData:[1,2,3,4,5]},
    {chartName:1,chartData:[1,2,3,4,5]},
    {chartName:1,chartData:[1,2,3,4,5]},
    {chartName:1,chartData:[1,2,3,4,5]},
  ]
}
watch(chartList,(newVal)=>{
  console.log("新数据")
  let newPromise = new Promise((resolve) => {
    chartList.value = newVal
    resolve()
  })
  newPromise.then(()=>{
    // chart()
  })
  // test()
})

onMounted(()=>{
  emitter.on('chart',(e)=>{
    chartList.value = e
  })

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
  height: 4%;
  /*background: red;*/
}
.box-top h1{
  margin-left: 50px;
  font-size: 20px;
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
</style>