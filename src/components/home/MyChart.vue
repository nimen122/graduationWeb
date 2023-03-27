<template>
  <div ref="chart" class="main"></div>
</template>

<script setup>
import { onMounted, inject, ref } from "vue";

let echarts = inject("echarts")

const props = defineProps({   //父组件传入数据，确定要显示的图表
  options: {
    type: Object,
    default() {
      return {};
    },
  },
});

onMounted(() => {  //页面加载时渲染图表
  change();
});

const chart = ref();

const change = () => {
  const chartBox = echarts.init(chart.value);
  const option = props.options;
  chartBox.setOption(option);

  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", function () {
    chartBox.resize();
  });
};

</script>

<style scoped>
.main{
  width: 100%;
  height: 100%;
}

</style>