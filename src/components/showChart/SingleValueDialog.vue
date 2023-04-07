<template>
  <el-dialog width="80%"  v-model="IMRDialog" title="I-MR 控制图" style="background: rgb(240,240,240)">
    <div class="dialog" v-loading="dialogLoading">
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
            <el-text>变量：</el-text>
            <el-input
                v-model="textarea"
                style="width: 40%;margin-right: 10px"
                placeholder="请从左侧选择要计算的数据"
                :disabled="textDisabled"
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
            <el-row>
              <el-text style="margin-left: 30px" >估计标准差方法：</el-text>
              <el-radio-group v-model="radio" >
                <el-radio :label="1" style="margin-left: 30px">移动极差平均值</el-radio>
                <el-radio :label="2" style="margin-left: 30px">移动极差中位数</el-radio>
              </el-radio-group>
            </el-row>
          </el-container>
          <el-container style="margin-top: 20px">
            <el-row>
              <el-text style="margin-left: 30px" >移动极差长度： </el-text>
              <el-input-number
                  controls-position="right"
                  v-model="movingRangeLength"
                  :min="2"
                  :max="100"
                  style="width: 80px;"
              />
            </el-row>
          </el-container>

          <el-divider content-position="left">检验</el-divider>
          <el-row>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[0]" style="margin-left: 30px;">1个点，距离中心线大于K个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[0]"
                    :min="1"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!rules[0]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[1]" style="margin-left: 30px;">连续K个点在中心线同一侧</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[1]"
                    :min="7"
                    :max="11"
                    style="width: 80px;float: right"
                    :disabled="!rules[1]"
                    @change=""
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[2]" style="margin-left: 30px;">连续K个点，全部递增或递减</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[2]"
                    :min="5"
                    :max="8"
                    style="width: 80px;float: right"
                    :disabled="!rules[2]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[3]" style="margin-left: 30px;">连续K个点，上下交错</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[3]"
                    :min="12"
                    :max="14"
                    style="width: 80px;float: right"
                    :disabled="!rules[3]"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[4]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于2个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[4]"
                    :min="2"
                    :max="4"
                    style="width: 80px;float: right"
                    :disabled="!rules[4]"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[5]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于1个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[5]"
                    :min="3"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!rules[5]"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[6]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）1个标准差以内</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[6]"
                    :min="12"
                    :max="15"
                    style="width: 80px;float: right"
                    :disabled="!rules[6]"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[7]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）大于1个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[7]"
                    :min="6" :max="10"
                    style="width: 80px;float: right"
                    :disabled="!rules[7]"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitIMR">
          绘制控制图
        </el-button>
        <el-button @click="IMRDialog = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog width="80%"  v-model="IDialog" title="单值控制图" style="background: rgb(240,240,240)">
    <div class="dialog" v-loading="dialogLoading">
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
            <el-text>变量：</el-text>
            <el-input
                v-model="textarea"
                style="width: 40%;margin-right: 10px"
                placeholder="请从左侧选择要计算的数据"
                :disabled="textDisabled"
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
            <el-row>
              <el-text style="margin-left: 30px" >估计标准差方法：</el-text>
              <el-radio-group v-model="radio" >
                <el-radio :label="1" style="margin-left: 30px">移动极差平均值</el-radio>
                <el-radio :label="2" style="margin-left: 30px">移动极差中位数</el-radio>
                <el-radio :label="3" style="margin-left: 30px">递差均方和平方根</el-radio>
              </el-radio-group>
              <el-checkbox v-model="isUseConstant" :disabled="radio !== 3" style="margin-left: 50px;">使用无偏常量</el-checkbox>
            </el-row>
          </el-container>
          <el-container style="margin-top: 20px">
            <el-row>
              <el-text style="margin-left: 30px" >移动极差长度： </el-text>
              <el-input-number
                  controls-position="right"
                  v-model="movingRangeLength"
                  :min="2"
                  :max="100"
                  style="width: 80px;"
              />
            </el-row>
          </el-container>

          <el-divider content-position="left">检验</el-divider>
          <el-row>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[0]" style="margin-left: 30px;">1个点，距离中心线大于K个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[0]"
                    :min="1"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!rules[0]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[1]" style="margin-left: 30px;">连续K个点在中心线同一侧</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[1]"
                    :min="7"
                    :max="11"
                    style="width: 80px;float: right"
                    :disabled="!rules[1]"
                    @change=""
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[2]" style="margin-left: 30px;">连续K个点，全部递增或递减</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[2]"
                    :min="5"
                    :max="8"
                    style="width: 80px;float: right"
                    :disabled="!rules[2]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[3]" style="margin-left: 30px;">连续K个点，上下交错</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[3]"
                    :min="12"
                    :max="14"
                    style="width: 80px;float: right"
                    :disabled="!rules[3]"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[4]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于2个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[4]"
                    :min="2"
                    :max="4"
                    style="width: 80px;float: right"
                    :disabled="!rules[4]"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[5]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于1个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[5]"
                    :min="3"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!rules[5]"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[6]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）1个标准差以内</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[6]"
                    :min="12"
                    :max="15"
                    style="width: 80px;float: right"
                    :disabled="!rules[6]"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[7]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）大于1个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[7]"
                    :min="6" :max="10"
                    style="width: 80px;float: right"
                    :disabled="!rules[7]"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitI">
          绘制控制图
        </el-button>
        <el-button @click="IDialog = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog width="80%"  v-model="MRDialog" title="移动极差控制图" style="background: rgb(240,240,240)">
    <div class="dialog" v-loading="dialogLoading">
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
            <el-text>变量：</el-text>
            <el-input
                v-model="textarea"
                style="width: 40%;margin-right: 10px"
                placeholder="请从左侧选择要计算的数据"
                :disabled="textDisabled"
            >
            </el-input>
          </el-container>
          <el-divider content-position="left" >历史参数输入</el-divider>
          <el-container>
<!--            <el-text style="margin-left: 30px">均值：</el-text>-->
<!--            <el-input v-model="historyAve" placeholder="输入均值（非必填）" style="width: 250px"></el-input>-->
            <el-text style="margin-left: 30px">标准差：</el-text>
            <el-input v-model="historySigma" placeholder="输入历史标准差（非必填）" style="width: 250px"></el-input>
          </el-container>
          <el-divider content-position="left">参数估计</el-divider>
          <el-container>
            <el-row>
              <el-text style="margin-left: 30px" >估计标准差方法：</el-text>
              <el-radio-group v-model="radio" >
                <el-radio :label="1" style="margin-left: 30px">移动极差平均值</el-radio>
                <el-radio :label="2" style="margin-left: 30px">移动极差中位数</el-radio>
<!--                <el-radio :label="3" style="margin-left: 30px">递差均方和平方根</el-radio>-->
              </el-radio-group>
<!--              <el-checkbox v-model="isUseConstant" :disabled="radio !== 3" style="margin-left: 50px;">使用无偏常量</el-checkbox>-->
            </el-row>
          </el-container>
          <el-container style="margin-top: 20px">
            <el-row>
              <el-text style="margin-left: 30px" >移动极差长度： </el-text>
              <el-input-number
                  controls-position="right"
                  v-model="movingRangeLength"
                  :min="2"
                  :max="100"
                  style="width: 80px;"
              />
            </el-row>
          </el-container>

          <el-divider content-position="left">检验</el-divider>
          <el-row>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[0]" style="margin-left: 30px;">1个点，距离中心线大于K个标准差</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[0]"
                    :min="1"
                    :max="6"
                    style="width: 80px;float: right"
                    :disabled="!rules[0]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[1]" style="margin-left: 30px;">连续K个点在中心线同一侧</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[1]"
                    :min="7"
                    :max="11"
                    style="width: 80px;float: right"
                    :disabled="!rules[1]"
                    @change=""
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[2]" style="margin-left: 30px;">连续K个点，全部递增或递减</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[2]"
                    :min="5"
                    :max="8"
                    style="width: 80px;float: right"
                    :disabled="!rules[2]"
                    @change=""
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-checkbox v-model="rules[3]" style="margin-left: 30px;">连续K个点，上下交错</el-checkbox>
                <el-input-number
                    controls-position="right"
                    v-model="rulesKey[3]"
                    :min="12"
                    :max="14"
                    style="width: 80px;float: right"
                    :disabled="!rules[3]"
                />
              </div>
            </el-col>
          </el-row>
<!--          <el-row style="margin-top: 5px">-->
<!--            <el-col :span="12">-->
<!--              <div>-->
<!--                <el-checkbox v-model="rules[4]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于2个标准差</el-checkbox>-->
<!--                <el-input-number-->
<!--                    controls-position="right"-->
<!--                    v-model="rulesKey[4]"-->
<!--                    :min="2"-->
<!--                    :max="4"-->
<!--                    style="width: 80px;float: right"-->
<!--                    :disabled="!rules[4]"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <div>-->
<!--                <el-checkbox v-model="rules[5]" style="margin-left: 30px;">K+1个点中有K个点，距离中心线（同侧）大于1个标准差</el-checkbox>-->
<!--                <el-input-number-->
<!--                    controls-position="right"-->
<!--                    v-model="rulesKey[5]"-->
<!--                    :min="3"-->
<!--                    :max="6"-->
<!--                    style="width: 80px;float: right"-->
<!--                    :disabled="!rules[5]"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row style="margin-top: 5px">-->
<!--            <el-col :span="12">-->
<!--              <div>-->
<!--                <el-checkbox v-model="rules[6]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）1个标准差以内</el-checkbox>-->
<!--                <el-input-number-->
<!--                    controls-position="right"-->
<!--                    v-model="rulesKey[6]"-->
<!--                    :min="12"-->
<!--                    :max="15"-->
<!--                    style="width: 80px;float: right"-->
<!--                    :disabled="!rules[6]"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <div>-->
<!--                <el-checkbox v-model="rules[7]" style="margin-left: 30px;">连续K个点，距离中心线（任一侧）大于1个标准差</el-checkbox>-->
<!--                <el-input-number-->
<!--                    controls-position="right"-->
<!--                    v-model="rulesKey[7]"-->
<!--                    :min="6" :max="10"-->
<!--                    style="width: 80px;float: right"-->
<!--                    :disabled="!rules[7]"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitMR">
          绘制控制图
        </el-button>
        <el-button @click="MRDialog = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  IMRDialog,
  IDialog,
  MRDialog,
  PDialog,
  LaneyPDialog,
  NPDialog,
  UDialog,
  LaneyUDialog,
  CDialog, XbarRDialog,

} from "./isShowDialog.js"
import { table } from "@/store/table.js";
import { chartData } from "@/store/chartData.js"
import {ref} from "@vue/reactivity";
import {onBeforeMount, onMounted, watch} from "vue";
import message from "../../utils/Message.js";
import api from '@/api/singleChart.js'
import emitter from "../../plugins/Bus.js";

//表格持久化数据
const tableStore = table();
//
const chartDataStore = chartData();
//表格中非空列数据
const cols = ref([])
//用户选中的列数据
const isSelected = ref([])
//当没有选择列数据时，禁用下方的确认按钮
const btnDisabled =ref(true)
//动态绑定样本数据输入框的输入
const textarea = ref('')
//锁定样本数据输入框
const textDisabled = ref(true)

//动态绑定历史平均值输入框的输入
const historyAve = ref('')
//动态绑定历史标准差输入框的输入
const historySigma = ref('')
//绑定估计标准差的方法（二选一）
const radio = ref(1)
//是否使用无偏常量
const isUseConstant = ref(true)
//此次计算的移动极差长度
const movingRangeLength = ref(2)
// //是否使用无偏常量进行估计
// const isUseConstant = ref(true)
//分别标识八条判异准则是否选择
const rules = ref([true,false,false,false,false,false,false,false])
//分别对应八条判异准则的Key值
const rulesKey = ref([3,9,6,14,2,4,15,8])
//用户最终选择的列作为变量数据
const colsAsSimple = ref([])
//用户从列表选择的要计算控制图的样本数据对象数组{dataName:...,dataValue:[]}
const allInputData = ref([])
//用于绘制控制图的一个样本数据（纯数据）
const currentSimpleData = ref([])
//dialog加载动画
const dialogLoading = ref(false)
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

}

const isValidInput=()=>{
  if (colsAsSimple.value.length === 0 ){
    message.error("请先选择变量数据")
    return false
  }
  //完整表格数据
  const tableData = tableStore.tableData
  //遍历完整表格，根据colNum得到样本数据
  for (let i = 0;i<colsAsSimple.value.length;i++){
    let colDataValue = []
    for (let j = 1;j<tableData.length;j++){
      if (tableData[j][colsAsSimple.value[i].colNum] !== null && tableData[j][colsAsSimple.value[i].colNum] !== ''){
        let data = Number(tableData[j][colsAsSimple.value[i].colNum])
        colDataValue.push(data)
      }else break
    }
    let colData = {dataName:tableData[0][colsAsSimple.value[i].colNum],dataValue:colDataValue}
    allInputData.value.push(colData)
  }
  return true
}

const submitIMR = () => {
  allInputData.value=[]
  currentSimpleData.value=[]
  //校验输入是否合规
  if (!isValidInput()){
    textarea.value=''
    colsAsSimple.value=[]
    return
  }
  // dialogLoading.value = true
  let rule = ''
  for (let i = 0;i<rules.value.length;i++){
    if (rules.value[i]){
      rule += '1'
    }else {
      rule += '0'
    }
  }
  let historyAveData = historyAve.value === ''?-1:Number(historyAve.value)
  let historySigmaData = historySigma.value === ''?-1:Number(historySigma.value)
  let sigmaMode =''
  if (radio.value === 1){
    sigmaMode="movingRangeAverageAsSigma"
  }else {
    sigmaMode="movingRangeMedianAsSigma"
  }
  console.log(allInputData.value)
  for (let i =0;i<allInputData.value.length;i++){
    currentSimpleData.value = allInputData.value[i].dataValue
    let data = {
      sourceData: currentSimpleData.value,
      movingRangeLength: movingRangeLength.value,
      historyAve: historyAveData,
      historySigma: historySigmaData,
      rules: rule,
      rulesKey: rulesKey.value ,
      sigmaMode: sigmaMode
    }
    // let chartData ={chartName:allInputData.value[0].dataName+"的Xbar控制图",chartParam:data}
    IMRApi(allInputData.value[i].dataName,data)
  }
  textarea.value=''
  colsAsSimple.value=[]
  allInputData.value=[]
  currentSimpleData.value=[]

}

const submitI = () => {
  allInputData.value=[]
  currentSimpleData.value=[]
  //校验输入是否合规
  if (!isValidInput()){
    textarea.value=''
    colsAsSimple.value=[]
    return
  }
  // dialogLoading.value = true
  let rule = ''
  for (let i = 0;i<rules.value.length;i++){
    if (rules.value[i]){
      rule += '1'
    }else {
      rule += '0'
    }
  }
  let historyAveData = historyAve.value === ''?-1:Number(historyAve.value)
  let historySigmaData = historySigma.value === ''?-1:Number(historySigma.value)
  let sigmaMode =''
  if (radio.value === 1){
    sigmaMode="movingRangeAverageAsSigma"
  }else if (radio.value === 2){
    sigmaMode="movingRangeMedianAsSigma"
  }else if (radio.value === 3){
    if (isUseConstant.value){
      sigmaMode = "SRMSSDAsSigmaWithConstant"
    }else {
      sigmaMode = "SRMSSDAsSigmaWithoutConstant"
    }
  }
  console.log(allInputData.value)
  for (let i =0;i<allInputData.value.length;i++){
    currentSimpleData.value = allInputData.value[i].dataValue
    let data = {
      sourceData: currentSimpleData.value,
      movingRangeLength: movingRangeLength.value,
      historyAve: historyAveData,
      historySigma: historySigmaData,
      rules: rule,
      rulesKey: rulesKey.value ,
      sigmaMode: sigmaMode
    }
    // let chartData ={chartName:allInputData.value[0].dataName+"的Xbar控制图",chartParam:data}
    IApi(allInputData.value[i].dataName,data)
  }
  textarea.value=''
  colsAsSimple.value=[]
  allInputData.value=[]
  currentSimpleData.value=[]
}

const submitMR = () => {
  allInputData.value=[]
  currentSimpleData.value=[]
  //校验输入是否合规
  if (!isValidInput()){
    textarea.value=''
    colsAsSimple.value=[]
    return
  }
  // dialogLoading.value = true
  let rule = ''
  for (let i = 0;i<rules.value.length;i++){
    if (rules.value[i]){
      rule += '1'
    }else {
      rule += '0'
    }
  }
  let historyAveData = historyAve.value === ''?-1:Number(historyAve.value)
  let historySigmaData = historySigma.value === ''?-1:Number(historySigma.value)
  let sigmaMode =''
  if (radio.value === 1){
    sigmaMode="movingRangeAverageAsSigma"
  }else {
    sigmaMode="movingRangeMedianAsSigma"
  }
  console.log(allInputData.value)
  for (let i =0;i<allInputData.value.length;i++){
    currentSimpleData.value = allInputData.value[i].dataValue
    let data = {
      sourceData: currentSimpleData.value,
      movingRangeLength: movingRangeLength.value,
      historyAve: historyAveData,
      historySigma: historySigmaData,
      rules: rule,
      rulesKey: rulesKey.value ,
      sigmaMode: sigmaMode
    }
    // let chartData ={chartName:allInputData.value[0].dataName+"的Xbar控制图",chartParam:data}
    MRApi(allInputData.value[i].dataName,data)
  }
  textarea.value=''
  colsAsSimple.value=[]
  allInputData.value=[]
  currentSimpleData.value=[]

}


const IMRApi =(chartName,data)=>{
  api.IMRApi(data).then( res =>{
    dialogLoading.value = false
    IMRDialog.value = false
    if (res.success){
      let chart = {chartName:chartName+"的I-MR 控制图",chartData:res.data,chartType:"IMR",oldParam:data,isDel:false}
      chartDataStore.chartData.push(chart)
      const chartData = chartDataStore.chartData
      emitter.emit('chart',chartData);
    }
  }).catch( error =>{
    dialogLoading.value = false
    console.log(error)
  })
}

const delIMRApi =(delParam)=>{
  const oldParam = JSON.parse(JSON.stringify(chartDataStore.chartData[delParam.chartIndex].oldParam))
  let data = {
    sourceData: oldParam.sourceData,
    movingRangeLength: oldParam.movingRangeLength,
    historyAve: oldParam.historyAve,
    historySigma: oldParam.historySigma,
    rules: oldParam.rules,
    rulesKey: oldParam.rulesKey ,
    sigmaMode: oldParam.sigmaMode,
    delPoint:delParam.delPointIndex,
  }
  api.delIMRApi(data).then( res =>{
    if (res.success){
      let chart = {chartName:chartDataStore.chartData[delParam.chartIndex].chartName+"（修改后）",chartType:"IMR",chartData:res.data,oldParam:data,isDel:true}
      chartDataStore.chartData.splice(delParam.chartIndex+1,0,chart)
      const chartData = chartDataStore.chartData
      emitter.emit('chart',chartData);
    }
  }).catch( error =>{
    console.log(error)
  })
}


const IApi =(chartName,data)=>{
  api.IApi(data).then( res =>{
    dialogLoading.value = false
    IDialog.value = false
    if (res.success){
      let chart = {chartName:chartName+"的单值控制图",chartData:res.data,chartType:"I",oldParam:data,isDel:false}
      chartDataStore.chartData.push(chart)
      const chartData = chartDataStore.chartData
      emitter.emit('chart',chartData);
    }
  }).catch( error =>{
    dialogLoading.value = false
    console.log(error)
  })
}

const delIApi =(delParam)=>{
  const oldParam = JSON.parse(JSON.stringify(chartDataStore.chartData[delParam.chartIndex].oldParam))
  let data = {
    sourceData: oldParam.sourceData,
    movingRangeLength: oldParam.movingRangeLength,
    historyAve: oldParam.historyAve,
    historySigma: oldParam.historySigma,
    rules: oldParam.rules,
    rulesKey: oldParam.rulesKey ,
    sigmaMode: oldParam.sigmaMode,
    delPoint:delParam.delPointIndex,
  }
  api.delIApi(data).then( res =>{
    if (res.success){
      let chart = {chartName:chartDataStore.chartData[delParam.chartIndex].chartName+"（修改后）",chartType:"I",chartData:res.data,oldParam:data,isDel:true}
      chartDataStore.chartData.splice(delParam.chartIndex+1,0,chart)
      const chartData = chartDataStore.chartData
      emitter.emit('chart',chartData);
    }
  }).catch( error =>{
    console.log(error)
  })
}

const MRApi =(chartName,data)=>{
  api.MRApi(data).then( res =>{
    dialogLoading.value = false
    MRDialog.value = false
    if (res.success){
      let chart = {chartName:chartName+"的移动极差控制图",chartData:res.data,chartType:"MR",oldParam:data,isDel:false}
      chartDataStore.chartData.push(chart)
      const chartData = chartDataStore.chartData
      emitter.emit('chart',chartData);
    }
  }).catch( error =>{
    dialogLoading.value = false
    console.log(error)
  })
}

const delMRApi =(delParam)=>{
  const oldParam = JSON.parse(JSON.stringify(chartDataStore.chartData[delParam.chartIndex].oldParam))
  let data = {
    sourceData: oldParam.sourceData,
    movingRangeLength: oldParam.movingRangeLength,
    historyAve: oldParam.historyAve,
    historySigma: oldParam.historySigma,
    rules: oldParam.rules,
    rulesKey: oldParam.rulesKey ,
    sigmaMode: oldParam.sigmaMode,
    delPoint:delParam.delPointIndex,
  }
  api.delMRApi(data).then( res =>{
    if (res.success){
      let chart = {chartName:chartDataStore.chartData[delParam.chartIndex].chartName+"（修改后）",chartType:"MR",chartData:res.data,oldParam:data,isDel:true}
      chartDataStore.chartData.splice(delParam.chartIndex+1,0,chart)
      const chartData = chartDataStore.chartData
      emitter.emit('chart',chartData);
    }
  }).catch( error =>{
    console.log(error)
  })
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
watch(IMRDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})
watch(IDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})
watch(MRDialog,(newVal)=>{
  if (newVal === true){
    getCol()
  }
})

onMounted(()=>{
  emitter.on('delPoint',(e) =>{
    switch (e.chartType){
      case "IMR":
        delIMRApi(e)
        break
      case "I":
        delIApi(e)
        break
      case "MR":
        delMRApi(e)
        break
    }

  })
})

</script>

<style scoped>
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
  height: 430px;
  display: flex;
  /*align-items: center;*/
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
  display: flex;
  flex-direction: column;

  align-items: center;
}
.selectArea{
  /*margin-top: 15px;*/
  height: 100%;
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