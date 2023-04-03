<template>
  <div class="home">
    <div class="home-main" >
      <div class="main-t" v-loading="showTodayLoading">
        <div class="show-card">
          <div class="card-t"></div>
          <div class="card-bm">
            <div class="card-m">
              <div class="card-m-l">
                <div class="icon-box" style="background:rgb(86,175,90) ;">
                  <i class="iconfont icon-DataLine" ></i>
                </div>
              </div>
              <div class="card-m-r">
                <div class="card-title">
                  <div class="title-css">今日录入数据</div>
                  <div class="data-css">{{statisticalData.todayImport}}</div>
                </div>
              </div>
            </div>
            <div class="card-b">
              <div class="card-b-foot">
                <i class="iconfont icon-info" style="font-size: 25px;color:rgb(86,175,90) "></i>
                <div class="info-msg" @click="viewData">查看数据详情</div>
              </div>
            </div>
          </div>

        </div>
        <div class="show-card">
          <div class="card-t"></div>
          <div class="card-bm">
            <div class="card-m">
              <div class="card-m-l">
                <div class="icon-box"  style="background:rgb(231,63,59) ;">
                  <i class="iconfont icon-warning" ></i>
                </div>
              </div>
              <div class="card-m-r">
                <div class="card-title">
                  <div class="title-css">今日上报异常</div>
                  <div class="data-css">{{statisticalData.todayError}}</div>
                </div>
              </div>
            </div>
            <div class="card-b">
              <div class="card-b-foot">
                <i class="iconfont icon-warning" style="font-size: 25px;color:rgb(231,63,59) "></i>
                <div class="info-msg" @click="viewError">查看异常详情</div>
              </div>
            </div>
          </div>

        </div>
        <div class="pieChart">
          <div id="pieChart1" style="width: 100%;height: 100%"></div>
        </div>
      </div>
      <div class="main-b" v-loading="showHistoryLoading">
          <div class="barChart">
            <div id="barChart1" style="width: 100%;height: 100%"></div>
          </div>
          <div class="barChart">
            <div id="barChart2" style="width: 100%;height: 100%"></div>
          </div>
          <div class="pieChart2">
            <div id="pieChart2" style="width: 100%;height: 100%"></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {inject, onMounted, reactive, ref, watch} from "vue";
import message from "../../utils/Message.js";
let echarts = inject("echarts")
import api from '@/api/statistical.js'

const statisticalData = reactive({})

const viewData = () => {
  message.sucess("查看数据详情")
}

const viewError = () => {
  message.sucess("查看异常详情")
}

const todaySource = ref(
    [['今日录入数据',0],['今日上报异常',0]]
)
const historySource = ref(
    [['历史录入数据',0],['历史上报异常',0]]
)


const barOption1 ={
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
}

const barOption2 ={
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
}

const showTodayLoading = ref(true)

const todayData = () => {
  api.todayApi().then( res=>{
    showTodayLoading.value = false
    if (res.success){
      todaySource.value=[
          ['今日录入数据',res.data.statisticalImportData],
          ['今日上报异常',res.data.statisticalErrorData],
      ]
      statisticalData.todayImport = res.data.statisticalImportData;
      statisticalData.todayError = res.data.statisticalErrorData
      PieChartChange1()

    }
  } ).catch(error =>{
    console.log(error)
  })
}
const showHistoryLoading = ref(true)
let barChartSource1 = ref();
const historyData = () => {
  api.historyApi().then( res=>{
    showHistoryLoading.value = false
    if (res.success){
      // message.sucess("ww")
      historySource.value=[
        ['历史录入数据',res.data.historyImport],
        ['历史上报异常',res.data.historyError],
      ]
      barChartSource1.value = JSON.parse(JSON.stringify(res.data.statisticalList))
      console.log(barChartSource1.value)
      PieChartChange2();
      barChartChange1();
      barChartChange2();

    }
  } ).catch(error =>{
    console.log(error)
  })
}

// const pieChart1 = ref(null)

const PieChartChange1 = () => {
  const pieChartBox1 = echarts.init( document.getElementById('pieChart1'));
  const pieOption1 = {   //饼图
    title: {
      text: '今日数据',
      subtext: '上报异常/录入数据',
      left: 'center',
      top:'5%'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      icon:'circle',
      // x:'5%',
      // y:'14%',
    },
    dataset:{
      source:todaySource.value,
    },
    series: [
      {
        name: '今日数据',
        type: 'pie',
        radius: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        color:[
          '#56AF5A',
          '#E73F3B',
        ]
      }
    ]
  }
  document.getElementById('pieChart1').setAttribute('_echarts_instance_', '');
  pieChartBox1.setOption(pieOption1);

}

const PieChartChange2 = () => {
  const pieChartBox1 = echarts.init( document.getElementById('pieChart2'));

  const pieOption2 ={   //饼图
    title: {
      text: '历史数据',
      subtext: '上报异常/录入数据',
      left: 'center',
      top:'5%'
    },
    dataset:{
      source:historySource.value,
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      icon:'circle',
      // x:'5%',
      // y:'14%',
    },
    series: [
      {
        name: '历史数据',
        type: 'pie',
        radius: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        color:[
          '#56AF5A',
          '#E73F3B',
        ]
      }
    ]
  }
  document.getElementById('pieChart2').setAttribute('_echarts_instance_', '');
  pieChartBox1.setOption(pieOption2);

}

const barChartChange1 = () => {

  const barChartBox1 = echarts.init( document.getElementById('barChart1'));
  document.getElementById('barChart1').removeAttribute('echarts_instance');
  const barOption1 = {
    title: {
      text: '历史数据',
      subtext: '历史上报异常'
    },

    tooltip: {
      trigger: 'axis'
    },
    dataset:{
      source:barChartSource1.value
    },

    xAxis: {
      type: 'time',
      axisLabel: {
          formatter:'{MM}-{dd}',
          fontStyle:'italic',
          rich: {
              yearStyle: {
                  // 让年度信息更醒目
                  color: '#000',
                  fontWeight: 'bold'
              },
              monthStyle: {
                  color: '#999'
              }
          }
      }

    },
    // 声明一个 Y 轴，数值轴。
    yAxis: {},
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [
      { type: 'bar' ,
        encode:{
          x:'statisticalDate',
          y:'statisticalErrorData',
        },
        color: [
          '#E73F3B'
        ]
      }
    ]
  };
  document.getElementById('barChart1').setAttribute('_echarts_instance_', '');
  barChartBox1.setOption(barOption1);

}

const barChartChange2 = () => {

  const barChartBox1 = echarts.init( document.getElementById('barChart2'));
  document.getElementById('barChart2').removeAttribute('echarts_instance');
  const barOption1 = {
    title: {
      text: '历史数据',
      subtext: '历史录入数据'
    },

    tooltip: {
      trigger: 'axis'
    },
    dataset:{
      source:barChartSource1.value
    },

    xAxis: {
      type: 'time',
      axisLabel: {
        formatter:'{MM}-{dd}',
        fontStyle:'italic',
        rich: {
          yearStyle: {
            // 让年度信息更醒目
            color: '#000',
            fontWeight: 'bold'
          },
          monthStyle: {
            color: '#999'
          }
        }
      }

    },
    // 声明一个 Y 轴，数值轴。
    yAxis: {},
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: [
      { type: 'bar' ,
        encode:{
          x:'statisticalDate',
          y:'statisticalImportData',
        },
        color: [
          '#56AF5A',
        ]
      }
    ]
  };
  document.getElementById('barChart2').setAttribute('_echarts_instance_', '');
  barChartBox1.setOption(barOption1);

}

onMounted(() => {  //页面加载时查询统计数据并渲染图表
  todayData();
  historyData();
  // PieChartChange1();
  // PieChartChange2();

});
let router = useRouter();
watch(()=>router.currentRoute.value.name,(toPath)=>{
  if ( toPath === 'Home') {
    todayData();
    historyData();
  }
},{immediate:true})

</script>

<style scoped>
HomeMain{
  height: 89.5%;
}
.home{
  width: 100%;
  height: 100%;
  background: rgb(238,238,238);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/

}
.main-t{
  display: flex;
  align-items: center;
  height:50%;
  /*border-radius: 11px 11px 0px 0px;*/
  /*background: #3585FF;*/
}

.show-card{
  width: 25%;
  height: 80%;
  margin-left: 70px;
  /*margin-right: 70px;*/
  /*background: green;*/
}
.card-t{
  height: 20%;
  margin-top: 0;
  width: 100%;
  /*opacity:0;*/
  /*background: red;*/
}
.card-bm{
  height: 80%;
  width: 100%;
  border-radius: 6px;
  background: white;
}
.card-m{
  display: flex;
  align-items: center;
  margin-top: 0;
  height: 70%;
  width: 100%;
}
.card-m-l{
  margin-left: 0;
  width: 30%;
  height: 100%;
  /*background: yellow;*/
}
.icon-box{
  display: flex;
  /*align-items: center;*/
  flex-direction: column;
  margin-left: 10px;
  margin-top: -20px;
  height: 100px;
  width: 100px;
  line-height: 100px;
  text-align: center;
  box-shadow: 2px 2px 2px grey;
  border-radius: 15px;

}
.iconfont{
  display: inline-block;
  font-size: 50px;
  color: white;
}
.card-m-r{
  margin-left: 0;
  width: 70%;
  height: 100%;
  /*background: pink;*/
}
.card-title{
  float:right ;
}
.title-css{
  /*float:right ;*/
  margin-top: 20px;
  margin-right: 20px;
  color: #808080;
  font-size: 20px;
}
.data-css{
  float:right;
  margin-right: 30px;
  margin-top: 10px;
  font-size: 40px
}
.card-b{
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
}
.card-b-foot{
  width: 85%;
  margin: 10px auto 0;
  height: 100%;
  border-top: 2px solid rgb(238,238,238);
  display: flex;
  align-items: center;
}
.info-msg{
  display: flex;
  align-items: center;
  margin-left: 3px;
  cursor: pointer;
}
.pieChart{
  width: 30%;
  height: 100%;
  margin-top: 100px;
  margin-left: 70px;
}

.main-b{
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  /*background: red;*/
}
.barChart{
  width: 30%;
  height: 100%;
  /*margin-top: 10px;*/
  margin-left: 35px;

  /*margin-top: 5px;*/
}
.pieChart2{
  width: 30%;
  height: 100%;
  margin-left: -12px;
  /*margin-bottom: 15px;*/
}


</style>