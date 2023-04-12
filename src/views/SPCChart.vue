<template>
  <Header></Header>
  <div class="container">
    <ChartAside></ChartAside>
      <div class="resizable-container" >
        <div class = "my-box">
          <div class="main-t">
            <ShowChart></ShowChart>
          </div>
          <div class="move"></div>
          <div class="main-b">
            <ChartDataTable></ChartDataTable>
          </div>
        </div>

      </div>
  </div>

</template>

<script setup>
import Header from "@/components/common/Header.vue";
import api from '@/api/dataSource.js'
import {onMounted, reactive} from "vue";
import ChartAside from "@/components/showChart/ChartAside.vue";
import ShowChart from "@/components/showChart/ShowChart.vue";
import ChartDataTable from "@/components/showChart/ChartDataTable.vue";

const dragContent=()=> {

  let resize = document.getElementsByClassName('move')

  let top = document.getElementsByClassName('main-t');

  let bottom = document.getElementsByClassName('main-b')

  let box = document.getElementsByClassName('resizable-container')

  console.log(resize);

  for (let i = 0; i < resize.length; i++) {
    // 鼠标按下事件
    resize[i].onmousedown = function(e) {
      console.log(resize[i]);
      //颜色改变提醒
      resize[i].style.background = '#818181'
      let startY = e.clientY
      console.log("stratY:")
      console.log(startY)
      resize[i].top = resize[i].offsetTop
      console.log(resize[i].offsetTop);
      console.log(resize[i].top);
      // 鼠标拖动事件
      document.onmousemove = function(e) {
        let endY = e.clientY
        let moveLen = resize[i].top + (endY - startY) // （endY - startY）=移动的距离。resize[i].top+移动的距离=上边区域最后的高度
        let maxT = box[i].clientHeight - resize[i].offsetHeight // 容器高度 - 上边区域的高度 = 下边区域的高度


        if (moveLen < 50) moveLen = 50 // 上边区域的最小高度为50px
        if (moveLen > maxT - 50) moveLen = maxT - 50 //下边区域最小高度为150px

        resize[i].style.top = moveLen// 设置上边区域的高度

        for (let j = 0; j < top.length; j++) {
          top[j].style.height = moveLen + 'px'
          bottom[j].style.height = box[i].clientHeight - moveLen - 10 + 'px'
        }
      }
      // 鼠标松开事件
      document.onmouseup = function() {
        //颜色恢复
        resize[i].style.background = '#d6d6d6'
        document.onmousemove = null
        document.onmouseup = null
        resize[i].releaseCapture && resize[i].releaseCapture() //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      }
      resize[i].setCapture && resize[i].setCapture() //该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false
    }
  }
}

onMounted(()=>{
  dragContent();
})

</script>

<style lang="scss" scoped>
.container{
  width: 100%;
  height: 89.5vh;
  background: white;
  display: flex;
  .resizable-container{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

  }
}
.move:hover {
  color: rgb(252,250,237);
}

.my-box{
  width: 100%;
  height: 100%;
  position: relative;

}
.main-t{
  width: 100%;
  height: 40%;
  display: flex;
}
.main-b{
  width: 100%;
  height: calc(60% - 3px);
  display: flex;
}
.move {
  /*鼠标移入显示左右箭头*/
  cursor: s-resize;
  height: 3px;
  width: 100%;
  margin: 0 auto;
  border-radius: 5px;
  text-align: center;
  line-height: 3px;
  color: rgba(238,238,238,0.5);
  background-color: #d6d6d6;
}




//.width-auto .tree-layout-sider {
//  height: calc(100vh - 181px);
//  overflow-x: hidden;
//  overflow-y: auto;
//  padding-left: 8px !important;
//  padding-right: 0 !important;
//}

</style>