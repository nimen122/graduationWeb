<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import {provide} from "vue";

provide('echarts',echarts)

</script>



<style>
html,body,#app{
  height: 100%;
}
*{margin: 0;padding: 0}
a{
  text-decoration: none;
}
ul{
  list-style: none;
}

</style>
