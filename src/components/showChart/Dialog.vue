<template>
  <el-dialog width="80%"   v-model="XbarRDialog" title="Xbar-R控制图" style="background: rgb(240,240,240)">
    <div class="dialog">
      <div class="dialog-top">
        <div class="left-area">
          <div class="selectArea">
            <el-scrollbar>
              <ul v-for="(item,index) in cols">
                <li>
                  <el-checkbox
                      v-model="isSelected[index]"
                      :checked="isSelected[index]"
                      :label="item.colName"
                      style="margin-left: 20px"
                      @change="handleChange(item,index)"
                  />
                </li>
              </ul>
            </el-scrollbar>
          </div>
          <el-button style="margin-top: 5px;width: 80%" :disabled="btnDisabled" @click="handleCurrentSelect">确定</el-button>
        </div>
        <div class="main-area">
          <el-container style="margin-left: 30px">
            <el-checkbox
                v-model="selectText[0]"

                @change="selectText[0]=true;selectText[1]=false"
            >样本数据：</el-checkbox>
            <el-input
                v-model="textarea"
                style="width: 40%;margin-right: 10px"
                placeholder="请从左侧选择要计算的数据"
                :disabled="textDisabled"

            >
            </el-input>
            <el-checkbox
                v-model="selectText[1]"
                style="margin-left: 30px;"
                @change="selectText[0]=false;selectText[1]=true"
            >子组大小：</el-checkbox>
            <el-input
                v-model="groupInput"
                placeholder="请从左侧选择子组ID列"
                style="width: 40%; margin-right: 10px"
                :disabled="groupDisabled"
            >
            </el-input>
          </el-container>
          <el-divider content-position="left" >历史参数输入</el-divider>
          <el-container>
            <el-text style="margin-left: 30px">均值：</el-text>
            <el-input v-model="historyAve" placeholder="输入均值（非必填）" style="width: 250px"></el-input>
            <el-text style="margin-left: 30px">标准差：</el-text>
            <el-input v-model="historySigma" placeholder="输入历史标准差（非必填）" style="width: 250px"></el-input>
          </el-container>
          <el-divider content-position="left">参数估计</el-divider>
          <el-container>
            <el-text style="margin-left: 30px" >估计标准差方法：</el-text>
            <el-radio-group v-model="radio" >
              <el-radio :label="1" style="margin-left: 30px">Rbar</el-radio>
              <el-radio :label="2" style="margin-left: 30px">合并标准差</el-radio>
            </el-radio-group>
            <el-checkbox v-model="isUseConstant" :disabled="radio === 1" style="margin-left: 50px;">使用无偏常量</el-checkbox>
          </el-container>
          <el-divider content-position="left">检验</el-divider>
          <el-row>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[0]" style="margin-left: 30px;">1个点，距离中心线大于K个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[0]"
                    :min="1"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[0]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[1]" style="margin-left: 30px;">连续K个点在中心线同一侧</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[1]"
                    :min="7"
                    :max="11"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[1]"
                    @change=""
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[2]" style="margin-left: 30px;">连续K个点，全部递增或递减</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[2]"
                    :min="5"
                    :max="8"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[2]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[3]" style="margin-left: 30px;">连续K个点，上下交错</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[3]"
                    :min="12"
                    :max="14"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[3]"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[4]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于2个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[4]"
                    :min="2"
                    :max="4"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[4]"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[5]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于1个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[5]"
                    :min="3"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[5]"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[6]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）1个标准差以内</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[6]"
                    :min="12"
                    :max="15"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[6]"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="XbarRule[7]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）大于1个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="XbarRuleKey[7]"
                    :min="6" :max="10"
                    style="width: 80px;float: right"
                    :disabled="!XbarRule[7]"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitXbarR">
          绘制控制图
        </el-button>
        <el-button @click="XbarRDialog = false">取消</el-button>
      </span>
    </template>

  </el-dialog>
  <el-dialog width="60%"  v-model="XbarSDialog" title="Xbar-S控制图">

  </el-dialog>
  <el-dialog width="60%"  v-model="XbarDialog" title="Xbar控制图">

  </el-dialog>
  <el-dialog width="60%"  v-model="RDialog" title="R控制图">

  </el-dialog>
  <el-dialog width="60%"  v-model="SDialog" title="S控制图">

  </el-dialog>
</template>

<script setup>
import { XbarRDialog,XbarSDialog,XbarDialog,RDialog,SDialog } from "./isShowDialog.js"
import { table } from "@/store/table.js";
import {ref} from "@vue/reactivity";
import {onBeforeMount, onMounted, watch} from "vue";
import message from "../../utils/Message.js";
//表格持久化数据
const tableStore = table();
//表格中非空列数据
const cols = ref([])
//用户选中的列数据
const isSelected = ref([])
//用于标记要输入的是哪个输入框
const selectText = ref([true,false])
//当没有选择列数据时，禁用下方的确认按钮
const btnDisabled =ref(true)
//动态绑定样本数据输入框的输入
const textarea = ref('')
//锁定样本数据输入框
const textDisabled = ref(true)
//动态绑定组大小输入框的输入
const groupInput = ref('')
//锁定子组大小输入框
const groupDisabled = ref(true)
//动态绑定历史平均值输入框的输入
const historyAve = ref('')
//动态绑定历史标准差输入框的输入
const historySigma = ref('')
//绑定估计标准差的方法（二选一）
const radio = ref(1)
//是否使用无偏常量进行估计
const isUseConstant = ref(true)
//分别标识八条判异准则是否选择
const XbarRule = ref([true,false,false,false,false,false,false,false])
//分别对应八条判异准则的Key值
const XbarRuleKey = ref([3,9,6,14,2,4,15,8])
//用户最终选择的列作为样本数据
const colsAsSimple = ref([])
//用户最终选择的列作为子组ID
const colsAsGroup = ref([])
//左侧选择列数据发生改变时的处理，即未选择列数据时禁用确认按钮
const handleChange = (item,index) => {
  btnDisabled.value = true
  for (let i = 0;i<isSelected.value.length;i++){
    if ( isSelected.value[i] === true){
      btnDisabled.value = false
    }
  }
  // console.log(btnDisabled.value)
}
//点击确认按触发，对选择的列数据在输入框中显示
const handleCurrentSelect=()=>{

  if (selectText.value[0]){
    let s = ''
    colsAsSimple.value = []
    for (let i = 0 ;i<isSelected.value.length;i++){
      if (isSelected.value[i]){
        s += cols.value[i].colName +' '
        console.log(cols.value[i].colName)
        colsAsSimple.value.push(cols.value[i])
      }
      isSelected.value[i] = false
    }
    textarea.value = s
  }else {
    colsAsGroup.value = []
    let num = 0;
    let s = ''
    let col ={}
    for (let i = 0 ;i<isSelected.value.length;i++){
      if (isSelected.value[i]){
        s = cols.value[i].colName
        num++
        isSelected.value[i] = false
        col = cols.value[i]
      }
    }
    if (num > 1){
      message.error("ID列只能选择一列")
      groupInput.value = ''
      for (let i =0 ;i < isSelected.value.length;i++){
        isSelected.value[i] = false
      }
    }else {
      groupInput.value = s
      colsAsGroup.value.push(col)
    }
  }

}

//提交Xbar-R控制图数据
const submitXbarR=()=>{
  let rules = ''
  for (let i = 0;i<XbarRule.value.length;i++){
    if (XbarRule.value[i]){
      rules += '1'
    }else {
      rules += '0'
    }
  }
  // console.log("rules")
  // console.log(rules)
  // console.log(XbarRuleKey.value)
  console.log(colsAsSimple.value)
  console.log(colsAsGroup.value)
  if (colsAsSimple.value.length ===0 ){
    message.error("请先选择样本数据")
  }
  if (colsAsGroup.value.length ===0 ){
    message.error("请先选择子组大小")
  }
  const col = tableStore.tableData
  let simpleData = []
  for (let i = 0;i<colsAsSimple.value.length;i++){
    let colDataValue = ''
    for (let j = 1;j<col.length;j++){
      if (col[j][colsAsSimple.value[i].colNum] !== null && col[j][colsAsSimple.value[i].colNum] !== ''){
        colDataValue += col[j][colsAsSimple.value[i].colNum]+' '
      }else break
    }
    colDataValue = colDataValue.slice(0,colDataValue.length-1)
    let colData = {dataName:col[0][colsAsSimple.value[i].colNum],dataValue:colDataValue}
    simpleData.push(colData)
  }
  console.log(simpleData)

  textarea.value=''
  groupInput.value=''
  colsAsSimple.value=[]
  colsAsGroup.value=[]

}

const getCol=()=>{
  cols.value=[]
  const col = tableStore.tableData
  for (let i = 0;i<col[0].length;i++){
    if (col[0][i] !== null && col[0][i] !== ''){
      let currentColObject = {colNum:i,colName:col[0][i]}
      cols.value.push(currentColObject)
      isSelected.value.push(false)
    }
  }
  console.log(cols.value)
}
watch(XbarSDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})
watch(XbarRDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})
watch(XbarDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})
watch(RDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})
watch(SDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})

</script>

<style  scoped>
:deep(.el-divider__text) {
  background: rgb(240, 240, 240);
  position: absolute;
  padding: 0 20px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-size: 12px;
}
:deep(.el-divider--horizontal){
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  border-top: 2px var(--el-border-color) var(--el-border-style);
}
.dialog{
  width: 100%;
  /*height: 500px;*/
  /*height: 400px;*/
}
.dialog-top{
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  /*flex-direction: row;*/
  /*justify-content: center;*/
}
.main-area{
  width: calc(100% - 160px);
  height: 100%;
  margin-left: 10px;
}
.left-area{
  height: 100%;
  width: 150px;
  /*position: absolute;*/
  /*margin-left: 20px;*/
  /*background: white;*/
  display: flex;
  flex-direction: column;

  align-items: center;
}
.selectArea{
  margin-top: 15px;
  height: 400px;
  width: 150px;
  border-radius: 5px;
  background: white;
  flex-wrap: wrap;

}
.selectArea ul{
  display: flex;
  /*flex-direction: column;*/
  flex-wrap: wrap;
}
.selectArea ul li{
  width: 45%;
  /*float: left;*/
  margin-left: 5px;
}

</style>