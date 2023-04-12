<template>
    <el-button class="dataBtn" type="success" size="default" @click="showAdd">新增数据</el-button>
    <el-dialog  width="60%"  v-model="addFormVisible" title="新增">
      <div class="dialog-main" v-loading="sourceDataLoading">
        <el-container>
          <el-button type="success" @click="submitData" style="margin-left: 30px">提交</el-button>
          <el-button type="warning" @click="clearTable" style="margin-left: 30px">清空表格</el-button>
          <div style="margin-left: 30px">
            <el-upload  :limit="1" action="" :multiple="false" :show-file-list="false"
                        accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        :http-request="httpRequest"
            >
              <el-button type="success" ><el-icon><Upload></Upload></el-icon>导入文件</el-button>
            </el-upload>
          </div>
        </el-container>

        <hot-table
            :settings="state.hotSettings"
            ref="hotTableComponent"
            height="400"
            style="margin-top: 20px"
        ></hot-table>
      </div>
    </el-dialog>


</template>

<script setup>
import { HotTable } from '@handsontable/vue3';
import { ContextMenu,DropdownMenu } from 'handsontable/plugins';
import { TextEditor } from 'handsontable/editors/textEditor';
import { registerAllModules } from 'handsontable/registry';
import Key from '@/utils/GenerateLicenseKey.js'
import 'handsontable/dist/handsontable.full.css';
import 'handsontable/languages/zh-CN'; //汉语包

import api from '@/api/dataSource.js'
import {reactive, ref} from "vue";
import message from "../../utils/Message.js";
import readXlsxFile from 'read-excel-file'
import XLSX from 'xlsx'
registerAllModules();
let addFormVisible = ref(false)

const showAdd = () => {

  addFormVisible.value = true

}


class CustomEditor extends TextEditor {
  createElements() {
    super.createElements();

    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.setAttribute('placeholder', 'Custom placeholder');
    this.TEXTAREA.setAttribute('data-hot-input', true);
    this.textareaStyle = this.TEXTAREA.style;
    this.TEXTAREA_PARENT.innerText = '';
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}

//定义handsontable的ref
const hotTableComponent = ref(null);
let state = reactive({
  hotSettings:{
    data: [
      ["示例1", "示例2", "示例3"],
      [2, 3, 12],
      [2, 4, 25],
      [4, 5, 8],
      [5, 6, 7],
      [6, 7, 7],
    ],
    colHeaders: true,
    rowHeaders: ['数据名'],
    minSpareCols: 2, //列留白
    minSpareRows: 2, //行留白
    colWidths: 80,
    licenseKey: Key(null,300),
    maxCols: 100,//最大列
    minRows: 15, //最小行
    minCols: 11,//最小列

    // ContextMenu: true, //右键菜单
    persistentState: true,
    // manualColumnResize
    copyable: true, // 允许键盘复制
    manualColumnMove: false, //列可拖动
    manualRowMove: false, //行可拖动
    manualColumnResize: true, //列可拖拽 调大小
    manualRowResize: true, //行可拖拽 调大小

    fixedRowsTop: 1, //固定上边列数
  }

})

const sourceDataLoading = ref(false)
const httpRequest = (e) =>{
  const file = e.file;
  if (!file) {
    return false
  } else if (!/\.(xls|xlsx|csv)$/.test(file.name.toLowerCase())) {
    message.error('文件格式不正确');
    return false
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    // 读取文件内容
    const data = e.target.result;
    // 解析为 workbook 对象
    const workbook = XLSX.read(data, { type: "binary" });
    // 获取第一个工作表的名称
    const sheetName = workbook.SheetNames[0];
    // 获取第一个工作表的对象
    const sheet = workbook.Sheets[sheetName];
    // 将工作表转换为 JSON 数组
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    hotTableComponent.value.hotInstance.loadData(sheetData)
    console.log(sheetData);
  }
  // 以二进制字符串的形式读取文件
  reader.readAsBinaryString(file);

  // readXlsxFile(file).then((rows) => {
  //   // rows 是一个二维数组，代表 Excel 文件的每一行数据
  //   hotTableComponent.value.hotInstance.loadData(rows)
  // });
}

const submitData = () => {
  sourceDataLoading.value = true;
  // let a = hotTableComponent.value.hotInstance.getSourceData();
  let data = hotTableComponent.value.hotInstance.getData();  //获取数据（数组的数组）
  let dataNum = 0;

  for (let i = 0 ; i<data[0].length;i++){
    if (data[0][i] != null && data[0][i] !== ''){
      dataNum += 1;
    }else break;
  }
  console.log(dataNum);

  let group = [];
  //将表格中数据转置，按行成组变为按列成组
  for ( let j = 1; j < data.length;j++){
    while (data[j][0] !== null && data[j][0] !== ''){
      let oneGroup = [];
      for (let i = 1;i< data.length ;i++){
        // while ()
        if (data[i][0] !== null && data[i][0] !== ''){
          oneGroup.push(data[i].shift())
        }
      }
      group.push(oneGroup);
    }
  }
  console.log(group)
  console.log(data)
  let chartDataList =[];
  for (let i =0;i<dataNum;i++){

    let dataValue = "";
    for (let j =0;j<group[i].length-1;j++){
      dataValue += group[i][j] +" ";
    }
    dataValue += group[i][group[i].length-1]
    let chartData = {dataName:data[0][i],dataValue:dataValue}
    chartDataList.push(chartData)
  }

  let param = {dataJson:JSON.stringify(chartDataList)}
  console.log(param)
  api.addSourceDataApi(param).then( res=>{
    sourceDataLoading.value = false;
    addFormVisible.value = false
    if (res.success){
      message.sucess("数据上传成功")
      emit('getSourceData')
    }
  }).catch( error =>{
    sourceDataLoading.value = false;
    addFormVisible.value = false
    message.error("请求超时，请重试")
    console.log(error)
  })
}

const clearTable = () => {
  hotTableComponent.value.hotInstance.clear();
}

const emit = defineEmits(['getSourceData'])

</script>

<style scoped>

.dataBtn{
  size: 30px;
  margin-left: 5%;
}
.dialog-main{
  width: 100%;
  height: 60vh;
  flex-direction: column;
  /*display: flex;*/
  align-items: center;
}
</style>