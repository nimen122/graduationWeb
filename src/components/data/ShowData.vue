<template>
  <div class="data-main">
    <div class="main-t">
      <DataImportForm @getSourceData="getSourceData"></DataImportForm>
      <el-input
          v-model="input"
          class="input"
          placeholder="账号模糊查询"
          :suffix-icon="Search"
          @change="getSourceData"
      />
      <el-text size="large" style="margin-left: 30px"> 采集时间：</el-text>
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
              @change="getSourceData"
          />
        </div>
      </div>
      <el-text size="large" style="margin-left: 30px"> 数据状态筛选：</el-text>
      <el-select v-model="dataState" @change="getSourceData">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>

    <div class="main-main">
<!--      <el-scrollbar style="height: 89%">-->
      <div style="height: 90%;width: 100%">
        <el-table v-loading="sourceDataLoading" :data="tableData" style="width: 100%;height: 100%" >
          <el-table-column fixed prop="userAccount" label="录入者账号" width="200"  align="center" />
          <el-table-column prop="userName" label="录入者姓名" width="200" align="center"/>
          <el-table-column prop="collectTime" label="录入时间" width="250" align="center"/>
          <el-table-column prop="sourceData" label="数据详情" width="200" align="center">
            <template #default="scope">
              <el-popover placement="right" :width="400" trigger="click">
                <template #reference>
                  <el-button style="margin-right: 16px" @click="showDataInfo(scope.$index, scope.row)">点击查看数据详情</el-button>
                </template>
                <div v-loading="dataInfoLoading">
                  <el-table :data="chartDataValue" max-height="400">
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
                    <!--                    <el-table-column  prop="dataValue" label="数据" />-->
                  </el-table>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="dataState" label="数据状态" width="200" align="center">
            <template #default="scope">
              <div :class="jutStatus(scope.row.dataState)" @click="showStateInfo(scope.row)">{{scope.row.dataState}}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="350" align="left">
            <template #default="scope">
              <el-button @click="toChart(scope.$index, scope.row)" type="primary">绘制控制图</el-button>
              <el-button @click="failBtn(scope.$index, scope.row)" v-if="scope.row.dataState !== '异常未处理'" type="danger">上报异常</el-button>
              <el-button @click="passBtn(scope.$index, scope.row)" v-if="scope.row.dataState === '未进行验证'" type="success">验证通过</el-button>
              <el-button @click="handleErrorBtn(scope.$index, scope.row)" v-if="scope.row.dataState === '异常未处理'" type="warning" :disabled="currentUser.userRole === '普通用户' ">处理异常</el-button>
<!--              <el-button @click="toChart(scope.$index, scope.row)">上报异常</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>

<!--      </el-scrollbar>-->

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

  <div v-loading="stateDialogLoading">
    <el-dialog
        title="验证通过"
        v-model="passVisible"
        width="50%"
    >
      <el-text size="large">申请理由：</el-text>
      <el-input
          v-model="textarea"
          :rows="3"
          type="textarea"
          placeholder="请输入备注"
          style="margin-top: 10px;margin-bottom: 10px"
      />
      <el-text size="large" style="margin-top: 20px">上传图片：</el-text>
      <el-upload
          ref="imageUpload"
          action="#"
          :multiple="true"
          :file-list="fileDataList"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="changeFile"
          style="margin-top: 10px"
      >
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passVisible = false">取 消</el-button>
          <el-button type="primary" @click="auditPass">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <div v-loading="stateDialogLoading">
    <el-dialog
      title="上报异常"
      v-model="failVisible"
      width="50%"
  >
      <el-text size="large">申请理由：</el-text>
      <el-input
          v-model="textarea"
          :rows="3"
          type="textarea"
          placeholder="请输入备注"
          style="margin-top: 10px;margin-bottom: 10px"
      />
      <el-text size="large" style="margin-top: 20px">上传图片：</el-text>
      <el-upload
          ref="imageUpload"
          action="#"
          :multiple="true"
          :file-list="fileDataList"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="changeFile"
          style="margin-top: 10px"
      >
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="failVisible = false">取 消</el-button>
          <el-button type="primary" @click="auditFail">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <div v-loading="stateDialogLoading">
    <el-dialog
        title="异常处理"
        v-model="handleVisible"
        width="50%"
    >
      <el-text size="large">处理方法：</el-text>
      <el-input
          v-model="textarea"
          :rows="3"
          type="textarea"
          placeholder="请输入备注"
          style="margin-top: 10px;margin-bottom: 10px"
      />
      <el-text size="large" style="margin-top: 20px">上传图片：</el-text>
      <el-upload
          ref="imageUpload"
          action="#"
          :multiple="true"
          :file-list="fileDataList"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="changeFile"
          style="margin-top: 10px"
      >
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleError">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import message from "../../utils/Message.js";
import {Search,Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
// import { UploadFile } from 'element-plus'
import api from '@/api/dataSource.js'
import uploadApi from '@/api/upload.js'
import {onMounted, reactive, ref} from "vue";
import DataImportForm from "./DataImportForm.vue";
import { storeToRefs } from 'pinia'
import { toSPC } from "@/store/toSPC.js";
import { user } from '@/store/user.js'
import axios from "axios";
const router = useRouter()
const toSPCStore = toSPC();
const userStore = user()
const stateDialogLoading = ref(false)
const stateMsgDialog = ref(false)
//模糊查询输入框
const input = ref('')
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
const currentPage = ref(1)
//每页数据条数
const pageSize = ref(10)
//查询数据总数
const total = ref(0)

const textarea = ref('')

const currentUser = ref()
// const imageUpload = ref(null)
const dialogImageUrl = ref('')
const imgDialogVisible = ref(false)
const fileDataList = ref([])

const stateMsg = ref('')

const currentImages = ref([])

const dataStateInfoDialog = ref(false)

const changeFile = (file,fileList) => {
  fileDataList.value = fileList
}

const handleRemove = (file) => {
  let removeId = file.id
  fileDataList.value.forEach((item, index) => {
    if (item.id === removeId) {
      fileDataList.value.splice(index, 1)
    }
  })
  console.log(fileDataList.value)
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = URL.createObjectURL(file.raw)
  imgDialogVisible.value = true
}

const previewImage = (url) => {
  dialogImageUrl.value = url
  imgDialogVisible.value = true
}

// const handleDownload = (file: UploadFile) => {
//   console.log(file)
// }

const showStateInfo = (row) => {
  stateMsg.value = row.stateMsg
  currentImages.value = row.stateImage
  if (row.dataState !== "未进行验证"){
    dataStateInfoDialog.value = true
  }
}

const handleSizeChange = (val) => {
  getSourceData()
}
const handleCurrentChange = (val) => {
  getSourceData()
}

//页面表格数据
const tableData = ref()

//数据详情查看的列名（数据名）
const chartDataName = ref()
//数据详情查看的数据（数据）
const chartDataValue = ref([])

const passVisible = ref(false)

const failVisible = ref(false)

const handleVisible = ref(false)

const dataState = ref('')
const options = ref([
  {
    value: '全部',
    label: '全部',
  },
  {
    value: '未进行验证',
    label: '未进行验证',
  },
  {
    value: '验证已通过',
    label: '验证已通过',
  },
  {
    value: '异常未处理',
    label: '异常未处理',
  },
  {
    value: '异常已解决',
    label: '异常已解决',
  },
])

const jutStatus = (dataState) =>{
  let result = "data_state"
  switch (dataState){
    case '未进行验证':
      result = "before_audit"
          break
    case '验证已通过':
      result = 'audit_pass'
          break
    case '异常未处理':
      result = 'before_handle'
          break
    case '异常已解决':
      result = 'after_handle'
  }
  return result
}


// 页面表格数据加载动画
const sourceDataLoading = ref(true)

// 数据详情表格数据加载动画
const dataInfoLoading = ref()

const currentRow = ref()
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
  // console.log(data)
  api.getChartDataInfoApi(data).then( res =>{
    dataInfoLoading.value = false
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
      chartDataValue.value = chartdata
      chartDataName.value = tableTile

      // console.log(tableData.value[0][2])
    }
  }).catch(error =>{
    dataInfoLoading.value = false
    message.error("请求超时，请重试")
    console.log(error)
  })
}

const getSourceData = () => {
  dataInfoLoading.value = true
  if (typeof (dateValue.value) === "undefined" || dateValue.value === null){
    dateValue.value = ['','']
  }
  // if (dateValue.value.length === 0){
  //   dateValue.value = ['','']
  // }
  let data = {
    page:currentPage.value,
    size:pageSize.value,
    startTime:dateValue.value[0],
    endTime:dateValue.value[1],
    userAccount:input.value,
    dataState:dataState.value,
  }
  console.log(data)
  api.getSourceApi(data).then( res =>{
    dataInfoLoading.value = false
    if (res.success){
      console.log(res.data)
      total.value = res.data.total
      tableData.value = res.data.sourceList
      sourceDataLoading.value = false
    }
  }).catch(error =>{
    dataInfoLoading.value = false
    console.log(error)
  })
}

const toChart = (index,row) =>{
  let data = {sourceData:row.sourceData}
  api.getChartDataInfoApi(data).then( res =>{
    if (res.success){
      const tableData = ref([])
      let valueArray = []
      let title = []
      for (let i =0;i < res.data.length;i++){
        title.push(res.data[i].dataName)
        let valueObject = res.data[i].dataValue
        valueArray.push(valueObject)
      }
      tableData.value.push(title)
      for (let j =0;j<valueArray.length;j++){
        while (valueArray[j].length !== 0){
          let ceshi =[]
          for (let i = 0;i<valueArray.length;i++){
            let value = valueArray[i].length === 0?null:valueArray[i].shift()
            ceshi.push(value)
          }
          tableData.value.push(ceshi)
        }
      }
      // let { tableData } = storeToRefs(store);
      // oldTableData.push(tableData.value)
      console.log(tableData.value)
      toSPCStore.$patch(state=>{
        state.tableData.push(tableData.value)
      })

      console.log("toSPCStore")
      console.log(toSPCStore.tableData) //结果：响应式的二维数组
      router.push('/SPCChart')
    }
  }).catch(error =>{
    console.log(error)
  })
}

const passBtn = (index,row) => {
  textarea.value = ''
  dialogImageUrl.value =''
  fileDataList.value = []
  passVisible.value = true
  currentRow.value  = row
}

const failBtn = (index,row) => {
  textarea.value = ''
  dialogImageUrl.value =''
  fileDataList.value = []
  failVisible.value = true
  currentRow.value  = row
}

const handleErrorBtn = (index,row) => {
  textarea.value = ''
  dialogImageUrl.value =''
  fileDataList.value = []
  handleVisible.value = true
  currentRow.value  = row
}

const auditPass = () => {
  stateDialogLoading.value = true

  let stateImage = ''
  if (fileDataList.value.length>0){
    const formData = new FormData()
    for (let i = 0;i<fileDataList.value.length;i++){

      let fileType = fileDataList.value[i].name.substring(fileDataList.value[i].name.lastIndexOf('.')+1)
      if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'jpeg'){
        message.error("图片类型非法")
        return
      }
      let filename = currentUser.value.userAccount+getNowTime()+Math.random()+'.'+fileType
      formData.append('fileList',fileDataList.value[i].raw)
      formData.append('filePath',filename)
      //每个文件名以':'分割，因为文件名中不能有英文冒号，不会冲突
      stateImage += filename+':'
    }
    stateImage = stateImage.slice(0,stateImage.length-1)
    let options = ({
      url:'http://localhost:8888/Upload/upload',
      method:'post',
      data:formData,
    })
    axios(options).then((res) => {
      // console.log(res)
      // if (res.success){
      //   // message.sucess("图片上传成功")
      // }
    }).catch( error => {
      console.log(error)
      message.error("图片上传失败")
    })
  }

  let data = {sourceId:currentRow.value.sourceId,stateMsg:textarea.value,stateImage:stateImage}
  api.auditPassApi(data).then( res => {
    console.log(res.data)
    message.sucess("操作成功")
    stateDialogLoading.value = false
    passVisible.value = false
    getSourceData()
  }).catch( error =>{
    stateDialogLoading.value = false
    passVisible.value = false
    message.error("请求超时,请重试")
    console.log(error)
  })

}

const auditFail = () => {

  stateDialogLoading.value = true

  let stateImage = ''
  if (fileDataList.value.length>0){
    const formData = new FormData()
    for (let i = 0;i<fileDataList.value.length;i++){

      let fileType = fileDataList.value[i].name.substring(fileDataList.value[i].name.lastIndexOf('.')+1)
      if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'jpeg'){
        message.error("图片类型非法")
        return
      }
      let filename = currentUser.value.userAccount+getNowTime()+Math.random()+'.'+fileType
      formData.append('fileList',fileDataList.value[i].raw)
      formData.append('filePath',filename)
      //每个文件名以':'分割，因为文件名中不能有英文冒号，不会冲突
      stateImage += filename+':'
    }
    stateImage = stateImage.slice(0,stateImage.length-1)
    let options = ({
      url:'http://localhost:8888/Upload/upload',
      method:'post',
      data:formData,
    })
    axios(options).then((res) => {
      // console.log(res)
      // if (res.success){
      //   // message.sucess("图片上传成功")
      // }
    }).catch( error => {
      console.log(error)
      message.error("图片上传失败")
    })
  }

  let data = {sourceId:currentRow.value.sourceId,stateMsg:textarea.value,stateImage:stateImage}
  api.auditFailApi(data).then( res => {
    message.sucess("操作成功")
    failVisible.value = false
    stateDialogLoading.value = false
    getSourceData()
  }).catch( error =>{
    stateDialogLoading.value = false
    failVisible.value = false
    message.error("请求超时,请重试")
    console.log(error)

  })
  // console.log(currentRow.value)
}

const handleError = () => {
  // console.log(textarea.value)
  stateDialogLoading.value = true
  let stateImage = ''
  if (fileDataList.value.length>0){
    const formData = new FormData()
    for (let i = 0;i<fileDataList.value.length;i++){

      let fileType = fileDataList.value[i].name.substring(fileDataList.value[i].name.lastIndexOf('.')+1)
      if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'jpeg'){
        message.error("图片类型非法")
        return
      }
      let filename = currentUser.value.userAccount+getNowTime()+Math.random()+'.'+fileType
      formData.append('fileList',fileDataList.value[i].raw)
      formData.append('filePath',filename)
      //每个文件名以':'分割，因为文件名中不能有英文冒号，不会冲突
      stateImage += filename+':'
    }
    stateImage = stateImage.slice(0,stateImage.length-1)
    let options = ({
      url:'http://localhost:8888/Upload/upload',
      method:'post',
      data:formData,
    })
    axios(options).then((res) => {
      // console.log(res)
      // if (res.success){
      //   // message.sucess("图片上传成功")
      // }
    }).catch( error => {
      console.log(error)
      message.error("图片上传失败")
    })
  }

  let data = {sourceId:currentRow.value.sourceId,stateMsg:textarea.value,stateImage:stateImage}
  api.errorHandleApi(data).then( res => {
    console.log(res.data)
    message.sucess("操作成功")
    stateDialogLoading.value = false
    handleVisible.value = false
    getSourceData()
  }).catch( error =>{
    stateDialogLoading.value = false
    handleVisible.value = false
    message.error("请求超时,请重试")
    console.log(error)
  })
  // console.log(currentRow.value)
}
/*获取当前时间，为图片提供名称 */
const getNowTime = () => {
  const yy = new Date().getFullYear()
  const MM =
      new Date().getMonth() + 1 < 10
          ? '0' + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1
  const dd =
      new Date().getDate() < 10
          ? '0' + new Date().getDate()
          : new Date().getDate()
  const HH =
      new Date().getHours() < 10
          ? '0' + new Date().getHours()
          : new Date().getHours()
  const mm =
      new Date().getMinutes() < 10
          ? '0' + new Date().getMinutes()
          : new Date().getMinutes()
  const ss =
      new Date().getSeconds() < 10
          ? '0' + new Date().getSeconds()
          : new Date().getSeconds()
  return yy + MM + dd + '-' + HH + mm + ss
}

onMounted(()=>{
  dataState.value = options.value[0].value
  currentUser.value = userStore.user
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
  /*width: 30%;*/
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 0 0;
  text-align: center;
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}
.main-main{
  width: 95%;
  height: 90%;
  flex-direction: column;
  display: flex;
  align-items: center;
}
.demo-pagination-block {
  margin-top: 10px;
  /*display: flex;*/

}
.data_state{
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
.before_audit{
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
.after_handle{
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
.before_handle{
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