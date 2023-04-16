<template>
  <Header></Header>
  <div class="data-main">
    <div class="main-t">
      <el-input
          v-model="input"
          class="input"
          placeholder="账号模糊查询"
          :suffix-icon="Search"
          @change="getLog"
      />
      <el-text size="large" style="margin-left: 30px"> 操作类型筛选：</el-text>
      <el-select v-model="logType" @change="getLog">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-text size="large" style="margin-left: 30px"> 操作时间：</el-text>
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
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size=default
              @change="getLog"
          />
        </div>
      </div>
    </div>
    <div class="main-main">
      <div style="height: 90%;width: 100%">
        <el-table v-loading="logTableLoading" :data="logData" style="width: 100%;height: 100%" >
          <el-table-column fixed prop="logAccount" label="操作人账号" width="200"  align="center" />
          <el-table-column prop="logName" label="操作人姓名" width="200" align="center"/>
          <el-table-column prop="logTime" label="操作时间" width="200" align="center"/>
          <el-table-column prop="logType" label="操作类型" width="200" align="center">
            <template #default="scope">
              <div :class="jutType(scope.row.logType)">{{scope.row.logType}}</div>
            </template>
          </el-table-column>
<!--          <el-table-column prop="logContent" label="操作内容" width="200" align="center"/>-->
          <el-table-column fixed="right" label="详情" width="300" align="center">
            <template #default="scope">
<!--              <el-button @click="logInfoBtn(scope.$index, scope.row)" type="primary" >查看详情</el-button>-->
              <el-popover placement="right" :width="400" trigger="click" v-if="scope.row.logType === '数据录入'">
                <template #reference>
                  <el-button @click="importDataInfo(scope.$index, scope.row)" type="info">数据录入详情</el-button>
                </template>
                <div v-loading="importDataLoading">
                  <el-table :data="importDataValue" max-height="400">
                    <el-table-column v-for="(item,i) in chartDataName"
                                     :key = "i"
                                     width="auto" :label="item.tableTitle"
                    >
                      <template #default="scope" >
                        <div>
                          {{ scope.row[i] }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-popover>
              <el-button @click="auditPassInfo(scope.$index, scope.row)" type="primary" v-if="scope.row.logType === '验证通过'">验证通过详情</el-button>
              <el-button @click="auditPassInfo(scope.$index, scope.row)" type="danger" v-if="scope.row.logType === '上报异常'">上报异常详情</el-button>
              <el-button @click="auditPassInfo(scope.$index, scope.row)" type="success" v-if="scope.row.logType === '异常处理'">异常处理详情</el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>
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

    <el-dialog v-model = "imgDialogVisible" width="50%">
      <div style="width: 100%">
        <el-image  :src="dialogImageUrl" fit="fill" />
      </div>
    </el-dialog>

    <el-dialog v-model = "dataStateInfoDialog" width="50%" title="数据状态变更申请">
      <el-scrollbar max-height="400px">
        <el-container >
          <el-row>
            <el-text>申请理由：</el-text>
            <el-input
                autosize
                type="textarea"
                :disabled="true"
                v-model="stateMsg"
                style="margin-top: 10px;width: 300px"

            >
            </el-input>
          </el-row>

        </el-container>
        <el-container style="margin-top: 15px">
          <div v-if="currentImages.length !== 0" >
            <el-text >上传图片（点击图片可大图查看）：</el-text>
          </div>
        </el-container>
        <el-image
            v-for="url in currentImages"
            :key="url"
            :src = "url"
            style="width: 50%;margin-top: 15px"
            fit="contain"
            @click="previewImage(url)"
        />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script setup>
import Header from "../components/common/Header.vue";
import {Search } from '@element-plus/icons-vue'
import api from "@/api/log.js"
import sourceApi from '@/api/dataSource.js'
import {onMounted, reactive, ref} from "vue";
import message from "../utils/Message.js";

const input = ref('')

const logTableLoading = ref(false)

const logData = ref([])

const logType = ref('')

const options = ref([
  {
    value: '全部',
    label: '全部',
  },
  {
    value: '数据录入',
    label: '数据录入',
  },
  {
    value: '验证通过',
    label: '验证通过',
  },
  {
    value: '上报异常',
    label: '上报异常',
  },
  {
    value: '异常处理',
    label: '异常处理',
  },
])

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
//数据录入详情表格加载
const importDataLoading  = ref(false)
//数据录入详情数据
const importDataValue = ref([])
//数据录入详情的列名（数据名）
const chartDataName = ref()

const handleSizeChange = (val) => {
  getLog()
}
const handleCurrentChange = (val) => {
  getLog()
}

const currentPage = ref(1)

const pageSize = ref(10)

const total = ref(0)

const getLog = () => {
  logTableLoading.value = true
  if (typeof (dateValue.value) === "undefined" || dateValue.value === null){
    dateValue.value = ['','']
  }
  let data = {
    page:currentPage.value,
    size:pageSize.value,
    input:input.value,
    logType:logType.value,
    startTime:dateValue.value[0],
    endTime:dateValue.value[1],
  }
  api.getLogApi(data).then( res => {
    logTableLoading.value = false
    if (res.success){
      logData.value = res.data.logList
      total.value = res.data.total
    }
  }).catch( error => {
    logTableLoading.value = false
    message.error("请求超时，请重试")
    console.log(error)
  })
}

// const logInfoBtn = (index,log) => {
//   if (log.logType === "上报异常"){
//     message.sucess("hh")
//   }else {
//     message.error("hh")
//   }
// }

const importDataInfo = (index,row) => {
  importDataValue.value= null
  chartDataName.value = null
  importDataLoading.value = true

  /**
   *需要传Object类型，将其转化为对象
   */
  console.log(row)
  let data = {sourceId:row.logContent}
  sourceApi.getDataById(data).then( res => {
    importDataLoading.value = false
    if (res.success){
      let tableTile =reactive([])
      let valueArray = []
      let title = []
      for (let i =0;i < res.data.length;i++){
        let titleObject = {prop:i,tableTitle:res.data[i].dataName}
        tableTile.push(titleObject)
        title.push(res.data[i].dataName)
        let valueObject = res.data[i].dataValue
        // console.log(valueObject)
        valueArray.push(valueObject)
      }
      // console.log(valueArray)
      let chartdata = []
      const tableData = ref([])
      tableData.value.push(title)


      for (let j =0;j<valueArray.length;j++){
        while (valueArray[j].length !== 0){
          let ceshi =[]
          for (let i = 0;i<valueArray.length;i++){
            let value = valueArray[i].length === 0?null:valueArray[i].shift()
            ceshi.push(value)
          }
          chartdata.push(ceshi)
          tableData.value.push(ceshi)
        }
      }
      importDataValue.value = chartdata
      chartDataName.value = tableTile
    }
  }).catch(error =>{
    importDataLoading.value = false
    message.error("请求超时，请重试")
    console.log(error)
  })

}

const dialogImageUrl = ref('')

const imgDialogVisible = ref(false)

const stateMsg = ref('')

const currentImages = ref([])

const dataStateInfoDialog = ref(false)

const dataStateInfoLoading = ref(false)

const previewImage = (url) => {
  dialogImageUrl.value = url
  imgDialogVisible.value = true
}

const auditPassInfo = (index,row) => {
  console.log(row)
  dataStateInfoDialog.value = true
  dataStateInfoLoading.value = true
  let data = {sourceId:row.logContent}
  sourceApi.getSourceByIdApi(data).then( res => {
    if (res.success){
      stateMsg.value = res.data.stateMsg
      currentImages.value = res.data.stateImage
      dataStateInfoLoading.value = false
      // dataStateInfoDialog.
    }
  }).catch( error => {
    console.log(error)
    message.error("请求超时，请重试")
    dataStateInfoLoading.value = false
  })
  // stateMsg.value = row.stateMsg
  // currentImages.value = row.stateImage
  // dataStateInfoDialog.value = true
}

const jutType = (type) =>{
  let result = "default_type"
  switch (type){
    case '数据录入':
      result = "data_import"
      break
    case '验证通过':
      result = 'audit_pass'
      break
    case '上报异常':
      result = 'audit_fail'
      break
    case '异常处理':
      result = 'handle_error'
  }
  return result
}

onMounted(() => {
  logType.value = options.value[0].value
  getLog()
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
.main-main{
  width: 75%;
  height: 90%;
  flex-direction: column;
  display: flex;
  align-items: center;
}
.input{
  width: 15%;
  margin-left: 200px;
}
.default_type{
  background: rgb(64,158,255);
  border-radius: 50px;
  width: 100px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-left: 35px;
}
.data_import{
  background: rgb(144,147,153);
  border-radius: 50px;
  width: 100px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-left: 37px;
  cursor: pointer;
}
.handle_error{
  background: rgb(103,194,58);
  border-radius: 50px;
  width: 100px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-left: 37px;
  cursor: pointer;
}
.audit_fail{
  background: rgb(245,108,108);
  border-radius: 50px;
  width: 100px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-left: 37px;
  cursor: pointer;
}
.audit_pass{
  background: rgb(64,158,255);
  border-radius: 50px;
  width: 100px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  margin-left: 37px;
  cursor: pointer;
}
</style>