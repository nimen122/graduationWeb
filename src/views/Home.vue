<template>
  <div class="header">
    <Header></Header>
  </div>
  <div class="home-main">
    <HomeMain></HomeMain>
<!--    <Test></Test>-->
  </div>

<!--  <HomeMain></HomeMain>-->
</template>

<script setup>

import Header from "../components/common/Header.vue";
import HomeMain from "../components/home/HomeMain.vue";

</script>

<style scoped>
.header{
  height: 10.5%;
}
.home-main{
  height: 89.5%;
}
</style>