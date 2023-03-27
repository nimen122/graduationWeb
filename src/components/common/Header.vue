<template>
  <header>
    <div class="header-main">
      <div class="header-left">
        <h1 class="logo">
          SPC 质量控制系统
        </h1>
        <ul>
          <li
              v-for='item in topBar'
              :key="item.id"
              :class=" item.id == currentId ? 'active' : '' "

              @click="tabBar(item)"
          >
            {{ item.title }}
          </li>
<!--          <li class="active">数据展示</li>-->
<!--          <li>数据录入</li>-->
<!--          <li>控制图</li>-->
<!--          <li>日志记录</li>-->
        </ul>
      </div>
      <div class="header-right">
        <div class="user" @click="ceshi">
          <i class="iconfont icon-user" ></i>
          <el-text style="font-size: 20px;color: #808080">用户</el-text>
<!--          <el-icon :size="20"><User /></el-icon>-->
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
//element
import { User} from '@element-plus/icons-vue'
import message from "../../utils/Message.js";
import {watch} from "vue";

let topBar = ref([
  {id:1,title:"数据展示",name:'Home'},
  {id:2,title:"数据录入",name:'DataImport'},
  {id:3,title:"控制图",name:'SPCChart'},
  {id:4,title:"用户管理",name:'UserManage'},
  {id:5,title:"日志记录",name:'Log'},
])
//切换头部class类
let currentId = ref(1);
let router = useRouter();
//点击跳转
const tabBar = (item)=>{
  currentId.value = item.id;
  router.push({
    name:item.name
  })
}

watch(()=>router.currentRoute.value.name,(toPath)=>{
  if ( toPath === 'Home'){
    currentId.value = 1;
  }else if ( toPath === 'DataImport'){
    currentId.value = 2;
  }else
  if ( toPath === 'SPCChart'){
    currentId.value = 3;
  }else
  if ( toPath === 'UserManage'){
    currentId.value = 4;
  }else
  if ( toPath === 'Log'){
    currentId.value = 5;
  }
},{immediate:true})


</script>

<style scoped>
.iconfont{
  font-size: 30px;
  color: #808080;
}
header{
  width: 100%;
  height: 80px;
  position: relative;
  z-index: 999;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1600);
}
.header-main{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 80px;
  margin: 0 auto;
}
.header-left{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left ul{
  display: flex;
  /*align-items: center;*/
  height: 50px;

}
.header-left ul li{
  /*display: flex;*/
  /*align-items: center;*/
  /*margin-right: 100px;*/
  font-size: 20px;
  line-height: 50px;
  color: #808080;
  cursor: pointer;
}
.header-left ul li + li{
  /*display: flex;*/
  /*align-items: center;*/
  /*margin-right: 100px;*/
  font-size: 20px;
  margin-left: 79px;
  /*font-size: 16px;*/
  color: #808080;
  cursor: pointer;
}
.header-left ul li.active{
  position: relative;
  color: #3585FF;
  font-weight: 700;
}
.active:after{
  content: '';
  position: absolute;
  margin-bottom: -15px;
  bottom: 0;
  /*padding-top: 30px;*/
  left: 0;
  width: 140%;
  height: 3px;
  margin-left: -20%;

  background: #3585FF;
}
.logo{
  width: auto;
  height: 50px;
  font-size: 35px;
  margin-right: 90px;
  display: flex;
  align-items: center;
}
.header-right{
  display: flex;
  align-items: center;
  /*width: 300px;*/
  /*height: 50px;*/
  /*background: blue;*/
}
.header-right .user{
  display: flex;
  align-items: center;
  /*vertical-align:center;*/
  margin-left: 39px;
  color: #808080;
  cursor: pointer;
}
</style>