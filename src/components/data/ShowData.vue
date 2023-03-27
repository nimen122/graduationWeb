<template>
  <div class="data-main">
    <div class="main-t">
      <el-button class="upload-btn"  type="success" size="default" @click="dataImport">上传数据</el-button>
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
      <el-table :data="tableData" style="width: 100%;height: 100%;" >
        <el-table-column fixed prop="userAccount" label="账号" width="200"  align="center" />
        <el-table-column prop="name" label="姓名" width="200" align="center"/>
        <el-table-column prop="collectTime" label="录入时间" width="250" align="center"/>
        <el-table-column prop="sourceData" label="数据详情" width="200" align="center">
          <template #default="scope">
            <el-button @click="showDataInfo(scope.$index, scope.row)">点击查看</el-button>
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
            :disabled="disabled"
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

const dataImport = () => {
  message.sucess("点击了数据导入")
}
const input = ref()
const currentPage = ref()
const pageSize = ref()
const disabled = ref(false)
const dateValue = ref()
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

const dataInfo = ref(false)
// const deleteRow = (index) => {
//   tableData.value.splice(index, 1)
// }
const total = ref(0)
const tableData = ref()

const handleSizeChange = (val) => {
  console.log("每页大小改变了")
  message.sucess(val)
}
const handleCurrentChange = (val) => {
  console.log("当前页面改变了")
  message.sucess(val)
}

const showDataInfo = (index,row) => {
  /**
   *需要传Object类型，将其转化为对象
   */
  let data = {sourceData:row.sourceData}
  api.getChartDataInfoApi(data).then( res =>{
    if (res.success){
      message.sucess("getChartDataInfoApi")
      console.log(res.data)
    }
  }).catch(error =>{
    console.log(error)
  })

  // console.log(index,row)
  // console.log(row.sourceData)

}

const getSourceData = () => {
  api.getSourceDataApi().then( res =>{
    console.log(res.data)
    if (res.success){
      message.sucess("sourceData")
      tableData.value = res.data
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
.upload-btn{
  size: 30px;
  margin-left: 5%;

}
.input{
  width: 15%;
  margin-left: 30px;
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