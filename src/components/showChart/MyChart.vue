<template>
  <div :id="uuid" style="width: 93%;height: 100%"></div>
<!--  <div id="test1" style="width: 100%;height: 50%"></div>-->
</template>

<script setup>
import {inject, onBeforeMount, onMounted, ref, watch} from "vue";

let echarts = inject("echarts")

const props = defineProps({   //父组件传入数据，确定要显示的图表
  data: {
    type: Object,
    default() {
      return {};
    },
  },
});

const uuid = ref();

onBeforeMount(()=>{
  uuid.value ="MyChart"+new Date().getTime()+ Math.random()
})

watch(props.data,(newVal)=>{
  console.log("新数据222")
  console.log(newVal)
  let newPromise = new Promise((resolve) => {
    resolve()
  })
  newPromise.then(()=>{

    initChart()
  })
},{immediate:true})

const initChart=()=>{

  let yAxisName = ""
  if (props.data.chartType === "Xbar"){
    yAxisName = "样本均值"
  }else if (props.data.chartType === "R"){
    yAxisName =  "样本极差"
  }

  console.log('initChart')
  document.getElementById(uuid.value).removeAttribute('_echarts_instance_');
  const chart = echarts.init(document.getElementById(uuid.value))

  const Option = {

    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'value',
    },
    // 声明一个 Y 轴，数值轴。
    yAxis: {
      type: 'value'
    },
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [
      {
        type: 'line' ,
        data: props.data.chartData
      },
      {
        type: 'line' ,
        step:'end',
        color:'rgb(0,132,31)',

        data: props.data.chartCL
      },
      {
        type: 'line' ,
        step:'end',
        color:'#931313',
        data: props.data.chartLCL
      },
      {
        type: 'line' ,
        step:'end',
        color:'#931313',
        data: props.data.chartUCL
      },
    ]
  };

  const option = {

    tooltip: {
      trigger: 'axis'
    },
    grid:{
      left:'10%',
      top:20,
      right:'15%',
      bottom:20,
      // 1680540762744
      // 1680541074468


      // x:75,
      // y:30,
      //
      // x2:75,
      // y2:30,
      // right:'90',
      // containLabel:true,
    },

    xAxis: {
      name:'样本',
      nameLocation:'middle',
      nameGap:10,
      type: 'category',
      boundaryGap: true,


      // data:[1,2,3,4,5],
      axisLabel:{
        formatter:function (val){
          // console.log(val)
          return ++val
        }
      },
      axisLine: {
        onZero:false
      },
      axisTick: {
        alignWithLabel:true
      }


    },
    // 声明一个 Y 轴，数值轴。
    yAxis: {
      type: 'value',
      name: yAxisName,
      // name: '样本数据',
      nameLocation:'middle',
      nameGap:30,

      scale:true, //不会强制包含0刻度
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      },
      splitLine:{
        show:false
      }
    },
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [
      {
        name:'数据',
        type: 'line' ,
        // data: [1.5, 3.5, 5.5, 7.5, 9.5],
        data: props.data.chartData,
        color:'rgb(0,84,166)',
        lineStyle:{
          width:1
        },
        showSymbol: true,
        symbol: "circle",
        symbolSize: 6,
      },
      {
        name:'UCL',
        type: 'line' ,
        step:'end',
        showSymbol: true,
        symbol: "circle",
        symbolSize: 1,
        // data: [7.3806, 7.3806, 7.3806, 7.3806, 7.3806],
        data:props.data.chartUCL,
        lineStyle:{
          color:'#931313',
          width:1
        },
        label:{
          show:true,
          position:'right',
          distance:15,
          textStyle:{
            fontSize:12,
            color:'black',
          },
          formatter:(params) =>{
            // console.log(params)
            if (params.dataIndex === props.data.chartUCL.length-1){
              return "UCL= "+params.data
            }else {
              return ""
            }
          }
        },
      },
      {
        name:'CL',
        type: 'line' ,
        step:'end',
        showSymbol: true,
        symbol: "circle",
        symbolSize: 1,
        // data: [5.5,5.5,5.5,5.5,5.5],
        data:props.data.chartCL,
        lineStyle:{
          color:'rgb(0,132,31)',
          width:1
        },
        label:{
          show:true,
          position:'right',
          distance:15,
          textStyle:{
            fontSize:12,
            color:'black',
          },
          formatter:(params) =>{
            // console.log(params)
            if (params.dataIndex === props.data.chartCL.length-1){
              return "CL= "+params.data
            }else {
              return ""
            }
          }
        },

      },
      {
        name:'LCL',
        type: 'line' ,
        step:'end',
        showSymbol: true,
        symbol: "circle",
        symbolSize: 1,
        // data: [3.6194, 3.6194, 3.6194, 3.6194, 3.6194],
        data:props.data.chartLCL,
        lineStyle:{
          color:'#931313',
          width:1
        },
        label:{
          show:true,
          position:'right',
          distance:15,
          textStyle:{
            fontSize:12,
            color:'black',
          },
          formatter:(params) =>{
            // console.log(params)
            if (params.dataIndex === props.data.chartLCL.length-1){
              return "LCL= "+params.data
            }else {
              return ""
            }
          }
        },
      },

    ]
  };

  chart.setOption(option)
}



onMounted(()=>{


})



</script>

<style scoped>

</style>