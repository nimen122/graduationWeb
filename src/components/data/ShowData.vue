<template>
  <div class="data-main">
    <div class="main-t">
      <DataImportForm></DataImportForm>
<!--      <el-button class="upload-btn"  type="success" size="default" @click="dataImport">上传数据</el-button>-->
      <el-input
          v-model="input"
          class="input"
          placeholder="账号模糊查询"
          :suffix-icon="Search"
      />
      <div class="demo-date-picker">
        <div class="block">
          <el-date-picker
              v-model="dateValue"
              type="daterange"
              unlink-panels
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="shortcuts"
              size=default
          />
        </div>
      </div>
    </div>
    <div class="main-main">
      <el-table v-loading="sourceDataLoading" :data="tableData" style="width: 100%;height: 100%;" >
        <el-table-column fixed prop="userAccount" label="账号" width="200"  align="center" />
        <el-table-column prop="userName" label="姓名" width="200" align="center"/>
        <el-table-column prop="collectTime" label="录入时间" width="250" align="center"/>
        <el-table-column prop="sourceData" label="数据详情" width="200" align="center">
<!--          <template #default="scope">-->
<!--            <el-button @click="showDataInfo(scope.$index, scope.row)">点击查看</el-button>-->
<!--          </template>-->

              <template #default="scope">

                  <el-popover placement="right" :width="400" trigger="click">
                    <template #reference>
                      <el-button style="margin-right: 16px" @click="showDataInfo(scope.$index, scope.row)">点击查看数据详情</el-button>
                    </template>
                      <div v-loading="dataInfoLoading">
                        <el-table :data="chartDataValue" max-height="400">
                          <el-table-column v-for="(item,i) in chartDataName"
                                           :key = "item.id"
                                           width="auto" :label="item.tableTitle"

                          >
                            <template #default="scope" >
                              <div>
                                {{ scope.row[i] }}
                              </div>

                            </template>

                          </el-table-column>
                          <!--                    <el-table-column  prop="dataValue" label="数据" />-->
                        </el-table>
                      </div>
                  </el-popover>

              </template>
        </el-table-column>
        <el-table-column prop="dataState" label="数据状态" width="200" align="center"/>
        <el-table-column fixed="right" label="Operations" width="400" align="center">
          <template #default="scope">
            <el-button>上报异常</el-button>
            <el-button>上报异常</el-button>
            <el-button>上报异常</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :page-sizes="[10, 20, 30, 40 , 50]"
            :disabled="false"
            :background = true
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import message from "../../utils/Message.js";
import {Search } from '@element-plus/icons-vue'
import api from '@/api/dataSource.js'
import {onMounted, reactive} from "vue";
import DataImportForm from "./DataImportForm.vue";


//模糊查询输入框
const input = ref()
//日期选择器
const dateValue = ref()
//自定义便捷时间选择
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  },
  {
    text: '三天内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
      return [start, end]
    },
  },
  {
    text: '一周内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

//当前页面
const currentPage = ref()
//每页数据条数
const pageSize = ref()
//查询数据总数
const total = ref(0)

const handleSizeChange = (val) => {
  console.log("每页大小改变了")
  message.sucess(val)
}
const handleCurrentChange = (val) => {
  console.log("当前页面改变了")
  message.sucess(val)
}


// const deleteRow = (index) => {
//   tableData.value.splice(index, 1)
// }
//页面表格数据
const tableData = ref()

//数据详情查看的列名（数据名）
const chartDataName = ref()
//数据详情查看的数据（数据）
const chartDataValue = ref([])

// const chartDataValue = ref(
// [    [1,1,1,1],
//     [2,2,2,1],
//     [3,3,3,2],
//     [4,4,4,2],
//     [5,5,5,3],
//     [6,6,6,3],
//     [7,7,7,4],
//     [8,8,8,4],
//     [9,9,9,5],
//     [10,10,10,5],]
// )

// 页面表格数据加载动画
const sourceDataLoading = ref(true)

// 数据详情表格数据加载动画
const dataInfoLoading = ref()

//点击“查看数据详情”按钮的响应事件
/**
 * 访问后端接口，获取sourceData对应的数据ChartData并渲染到表格中
 */
const showDataInfo = (index,row) => {
  chartDataValue.value= null
  chartDataName.value = null
  dataInfoLoading.value = true
  /**
   *需要传Object类型，将其转化为对象
   */
  let data = {sourceData:row.sourceData}
  console.log(data)
  api.getChartDataInfoApi(data).then( res =>{
    dataInfoLoading.value = false
    if (res.success){
      let tableTile =reactive([])
      let valueArray = []
      for (let i =0;i < res.data.length;i++){
        let titleObject = {prop:i,tableTitle:res.data[i].dataName}
        tableTile.push(titleObject)
        let valueObject = res.data[i].dataValue
        valueArray.push(valueObject)
      }
      let chartdata = []
      for (let j =0;j<valueArray.length;j++){
        while (valueArray[j].length !== 0){
          let ceshi =[]
          for (let i = 0;i<valueArray.length;i++){
            let value = valueArray[i][0] === null?'':valueArray[i].shift()
            ceshi.push(value)
          }
          chartdata.push(ceshi)
        }
      }
      chartDataValue.value = chartdata
      chartDataName.value = tableTile

    }
  }).catch(error =>{
    console.log(error)
  })
}

const getSourceData = () => {
  api.getSourceDataApi().then( res =>{
    if (res.success){
      tableData.value = res.data
      sourceDataLoading.value = false
    }
  }).catch(error =>{
    console.log(error)
  })
}

onMounted(()=>{
  getSourceData();
})

</script>

<style scoped>
.data-main{
  width: 100%;
  height: 89.5%;
  background: rgb(238,238,238);
  display: flex;
  flex-direction: column;
  align-items: center;

}
.main-t{
  width: 100%;
  height: 10%;
  margin: 0 auto;
  display: flex;
  align-items: center;

}

.input{
  width: 15%;
  margin-left: 50px;
}
.demo-date-picker {
  display: flex;
  width: 30%;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}
.main-main{
  width: 95%;
  flex-direction: column;
  display: flex;
  align-items: center;

}
.demo-pagination-block {
  margin-top: 10px;
  /*display: flex;*/

}


</style>