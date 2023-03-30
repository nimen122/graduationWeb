<template>
  <div class="show-main">
    <el-scrollbar height="100%">
      <ul class="main-main">
        <li v-for="(item,index) in chartList" :key="index">
        </li>
      </ul>
    </el-scrollbar>






  </div>

</template>

<script setup>

import {reactive} from "vue";

const chartList = ref([
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
  // {name:"机器1的Xbar-R控制图",data:[1,2,3]},
])

</script>

<style scoped>
.show-main{
  width: 100%;
  height: 100%;
  /*background:red ;*/
  /*flex-wrap: wrap;*/
  /*display: flex;*/
  /*justify-content: space-between;*/

}
.main-main{
  display: flex;
  justify-content: space-between;
  align-items: normal;
  /*justify-content: space-between;*/
  flex-wrap: wrap;
}
.main-main li{
  float: left;
  margin: 10px;

  width: calc(50% - 20px);
  height: 400px;
  background: blue;
  box-shadow: 1px 3px 3px rgba(27,39,94,0.1);
}

</style>