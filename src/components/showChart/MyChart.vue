<template>
  <div :id="uuid" style="width: 93%;height: 100%" @contextmenu.prevent = "openMenu($event)"></div>
  <ul
    v-show="menu.isShow"
    :style="{left:menu.left+'px',top:menu.top+'px'}"
    class="contextmenu"
  >
    <li @click="removeAllMarkPoint" >删除所有标记点</li>
    <li @click="delPoint">删除有标记的点，重新计算</li>
    <li>恢复被删除的点，重新计算</li>
  </ul>
</template>

<script setup>
import {inject, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import message from "../../utils/Message.js";
import emitter from "../../plugins/Bus.js";

let echarts = inject("echarts")

const props = defineProps({   //父组件传入数据，确定要显示的图表
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  index: {
    type: Number,
    default:-1,
  },
  type:{
    type:String,
    default:'',
  },
  isDel:{
    type:Boolean,
    default() {
      return false;
    }
  }
});

const uuid = ref();
const menu = reactive({
  isShow:false,
  left:0,
  top:0,
})
const markPointIndex = ref([])
// const isShowMenu = ref(false)
// const top = ref(0)
// const left = ref(0);
const errorPoint = ref([])

const removeAllMarkPoint = () =>{
  if (markPointIndex.value.length === 0){
    message.warning("暂无标记点")
    return
  }
  markPointIndex.value = []
  initChart()
}

const delPoint = () =>{
  if (props.isDel){
    message.error("该图已修改，请在原图上修改")
    return;
  }
  if (markPointIndex.value.length === 0){
    message.warning("请先标记要删除的点")
    return
  }


  let delPointIndex = JSON.parse(JSON.stringify(markPointIndex.value))

  if (props.data.chartType === "MR"){
    for (let i =0;i<delPointIndex.length;i++){
      delPointIndex[i] = delPointIndex[i]-1
    }
  }
  let delPoint = {chartIndex:props.index,delPointIndex:delPointIndex,chartType: props.type}
  emitter.emit('delPoint',delPoint);
}

const changeSelect = () => {
  let errorPointIndex = errorPoint.value
  let makeChartData = props.data
  let chartData = []
  for (let i =0;i<makeChartData.chartData.length;i++){
    let obj = {}
    if (errorPointIndex.includes(i+1)){
      obj = {
        value:makeChartData.chartData[i] === -1?'-':makeChartData.chartData[i],
        symbol: "rect",
        symbolSize: 6,
        itemStyle:{
          color:"rgb(206,0,0)"
        }
      }
    }else {
      obj = {
        value:makeChartData.chartData[i] === -1?'-':makeChartData.chartData[i],
        symbol: "circle",
        symbolSize: 6,
        itemStyle:{
          color:"rgb(0,84,166)"
        }
      }
    }
    chartData.push(obj)
  }
  return chartData

}

onBeforeMount(()=>{
  uuid.value ="MyChart"+new Date().getTime()+ Math.random()
})

watch(()=>props.data,(newVal)=>{
  let newPromise = new Promise((resolve) => {
    resolve()
  })
  newPromise.then(()=>{
    initChart()
  })
},{immediate:true,deep:true})
watch(()=>menu.isShow,(newVal) =>{
  // console.log('menu.isShow改变了')
  if (newVal){
    document.body.addEventListener("click",closeMenu)
  }else {
    document.body.removeEventListener("click",closeMenu)
  }
})

const openMenu = (e)=> {
  let x = e.pageX;
  let y = e.pageY;
  menu.top = y;
  menu.left = x;
  menu.isShow = true
}
const closeMenu = () => {
  menu.isShow = false
}
const initChart=()=>{


  let makeChartData = props.data

  let yAxisName = ""
  switch (makeChartData.chartType){
    case "Xbar":
      yAxisName = "样本均值"
          break
    case "R":
      yAxisName =  "样本极差"
          break
    case "S":
      yAxisName =  "样本标准差"
          break
    case "I":
      yAxisName =  "单值"
          break
    case "MR":
      yAxisName =  "移动极差"
          break
    case "P":
      yAxisName =  "比率"
          break
    case "Laney P‘":
      yAxisName =  "比率"
          break
    case "NP":
      yAxisName = "样本计数"
          break
    case "U":
      yAxisName =  "每单位样本计数"
          break
    case "Laney U‘":
      yAxisName =  "每单位样本计数"
          break
    case "C":
      yAxisName = "样本计数"
          break
  }


  document.getElementById(uuid.value).removeAttribute('_echarts_instance_');
  let chartData = []
  const chart = echarts.init(document.getElementById(uuid.value))
  let chartCriterion = makeChartData.chartCriterion
  let errorPointIndex = []
  for (let i =0;i<chartCriterion.length;i++){
    if (chartCriterion[i].fit){
      for (let j =0 ;j<chartCriterion[i].errorPointIndex.length;j++){
        errorPointIndex.push(chartCriterion[i].errorPointIndex[j])
      }
    }
  }
  errorPoint.value = errorPointIndex

  if (makeChartData.chartType === "MR"){
    for (let i =0;i<makeChartData.chartData.length;i++){
      if (makeChartData.chartCL[i] === -1){
        makeChartData.chartCL[i] = '-'
      }
      if (makeChartData.chartUCL[i] === -1){
        makeChartData.chartUCL[i] = '-'
      }
      if (makeChartData.chartLCL[i] === -1){
        makeChartData.chartLCL[i] = '-'
      }
    }
  }
  let subtitle =""
  if (makeChartData.chartType === "Laney P‘" || makeChartData.chartType === "Laney U‘"){
    subtitle = "Sigma Z = "+makeChartData.sigmaZ
  }
  for (let i =0;i<makeChartData.chartData.length;i++){
    let obj = {}
    if (errorPointIndex.includes(i+1)){
      obj = {
        value:makeChartData.chartData[i] === -1?'-':makeChartData.chartData[i],
        symbol: "rect",
        symbolSize: 6,
        itemStyle:{
          color:"rgb(206,0,0)"
        }
      }
    }else {
      obj = {
        value:makeChartData.chartData[i] === -1?'-':makeChartData.chartData[i],
        symbol: "circle",
        symbolSize: 6,
        itemStyle:{
          color:"rgb(0,84,166)"
        }
      }
    }
    chartData.push(obj)
  }


  const option = {

    tooltip: {
      trigger: 'axis'
    },
    grid:{
      left:'10%',
      top:20,
      right:'15%',
      bottom:40,
    },
    title: {
      subtext: subtitle,
      left: 'center'
    },

    xAxis: {
      name:'样本',
      nameLocation:'middle',
      nameGap:20,
      type: 'category',
      boundaryGap: true,
      axisLabel:{
        formatter:function (val){
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
        subTitle:"",
        type: 'line' ,
        data: chartData,
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
        step:'middle',
        showSymbol: true,
        symbol: "circle",
        symbolSize: 1,
        data:makeChartData.chartUCL,
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
            if (params.dataIndex === makeChartData.chartUCL.length-1){
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
        step:'middle',
        showSymbol: true,
        symbol: "circle",
        symbolSize: 1,
        data:makeChartData.chartCL,
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
            if (params.dataIndex === makeChartData.chartCL.length-1){
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
        step:'middle',
        showSymbol: true,
        symbol: "circle",
        symbolSize: 1,
        data:makeChartData.chartLCL,
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
            if (params.dataIndex === makeChartData.chartLCL.length-1){
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

  document.getElementById(uuid.value).oncontextmenu = () => {return false} //屏蔽右键默认事件


  // chart.on('contextmenu',{element: 'uuid'}, function(params) {
  //   console.log('click')
  //   console.log(params)
  //   openMenu(params.event.event)
  // });
  chart.on('click',{ seriesName: '数据' }, function(params) {
    if (markPointIndex.value.includes(params.dataIndex)){
      markPointIndex.value = markPointIndex.value.filter(item => item !== params.dataIndex)
      // markPointIndex.value.splice(markPointIndex.value.indexOf(params.dataIndex),1)
    }else {

      markPointIndex.value.push(params.dataIndex)
    }
    //这里不能直接 chartData=[],这样做是把chartData指向一个新的空数组，
    // 与option中绑定的chartData不是同一个，无法做到数据渲染到图表
    //为了实现数据实时渲染，不能出现 ” chartData = “ 的情况
    chartData.splice(0,chartData.length);

    chartData.push(...changeSelect())
    for (let i = 0;i<markPointIndex.value.length;i++){
      let obj = {
        value:chartData[markPointIndex.value[i]].value,
        symbol: "arrow",
        symbolSize: 10,
        itemStyle:{
          color:"rgb(206,0,0)"
        }
      }
      chartData[markPointIndex.value[i]] = obj
      // console.log(chartData[i])
    }
    // console.log(params)
    // console.log(markPointIndex.value)
    // console.log(chartData)
    // chartData = Array.from(changeSelect())
    // console.log(chartData)
    chart.setOption(option)
  });
  // document.getElementById(uuid.value).click = () =>{ closeMenu() }


}


</script>

<style scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #eee;
}
</style>