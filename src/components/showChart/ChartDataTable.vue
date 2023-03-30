<template>
  <div class="chart-table">
    <div class="show-table">
      <hot-table
          :settings="state.hotSettings"
          ref="hotTableComponent"
          height="100%"
      ></hot-table>
    </div>


  </div>
</template>

<script setup>
import { HotTable } from '@handsontable/vue3';
import { ContextMenu,DropdownMenu } from 'handsontable/plugins';
import { TextEditor } from 'handsontable/editors/textEditor';
import { registerAllModules } from 'handsontable/registry';
import Key from '@/utils/GenerateLicenseKey.js'
import 'handsontable/dist/handsontable.full.css';
import 'handsontable/languages/zh-CN';//汉语包
import {onMounted, ref, watch} from "vue";

import { toSPC } from "@/store/toSPC.js";
import { table } from "@/store/table.js";

const toSPCStore = toSPC();

const tableStore = table();


registerAllModules();

//定义handsontable的ref
const hotTableComponent = ref(null);
let state = reactive({
  hotSettings:{
    data: [[]],
    colHeaders: true,
    rowHeaders: ['数据名'],
    minSpareCols: 2, //列留白
    minSpareRows: 2, //行留白
    colWidths: 80,
    licenseKey: Key(null,300),
    maxCols: 100,//最大列
    minRows: 26, //最小行
    minCols: 18,//最小列
    contextMenu:{
      items:{
        "row_above": {
          name:'上方插入一行'
        },
        "row_below": {
          name:'下方插入一行'
        },
        "col_left": {
          name:'左方插入列'
        },
        "col_right": {
          name:'右方插入列'
        },
        "hsep1": "---------", //提供分隔线
        "remove_row": {
          name: '删除行',
        },
        "remove_col": {
          name: '删除列',
        },
        "copy":{
          name:'复制'
        },
        "cut":{
          name:'剪切'
        },
      }
    },
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

const saveTableData = () => {
  console.log(hotTableComponent.value.hotInstance.getSourceData())
  tableStore.tableData = hotTableComponent.value.hotInstance.getSourceData()
}

const showData = () => {

  // console.log(store.tableData)
  const oldTableData = JSON.parse(JSON.stringify(tableStore.tableData))
  hotTableComponent.value.hotInstance.loadData(oldTableData)
  const tableData = JSON.parse(JSON.stringify(toSPCStore.tableData));
  toSPCStore.tableData = [];
  console.log(tableData)
  let currentColNum = 0;
  let sourceData = hotTableComponent.value.hotInstance.getSourceData()
  console.log(sourceData)
  for (let i = 0;i<sourceData[0].length;i++){
    if (sourceData[0][i] !== null && sourceData[0][i] !=='' ){
      currentColNum++
    }
  }
  let isChange = false
  console.log(currentColNum)
  for (let i = 0;i<tableData.length;i++){
    hotTableComponent.value.hotInstance.populateFromArray(0,currentColNum,tableData[i])
    hotTableComponent.value.hotInstance.selectColumns(currentColNum,currentColNum+tableData[i][0].length-1)
    currentColNum += tableData[i][0].length
    isChange = true
  }
  // if (isChange){
  //   saveTableData()
  // }

}
onMounted(()=>{
  hotTableComponent.value.hotInstance.addHook("afterChange", saveTableData)
  showData()
  // hotTableComponent.value.hotInstance.getSourceData().push(store.tableData[1])
  // hotTableComponent.value.hotInstance.render()
  // hotTableComponent.value.hotInstance.selectCell(3,5)
  // console.log(hotTableComponent.value.hotInstance.getSourceData())
})

</script>

<style scoped>
.chart-table{
  width: 100%;
  height: 100%;
  overflow: hidden
}
.show-table{
  height: calc(100% - 17px);
  width: calc(100% - 17px);
  /*padding-right: 1px;*/
  /*padding-bottom: 1px;*/
  /*margin-bottom: -20px;*/

  overflow: auto;
}

</style>