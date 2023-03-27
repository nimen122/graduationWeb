import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import "@/assets/icon/iconfont.css"
import * as echarts from "echarts/core";

import Service from "@/api/config.js";
const app = createApp(App);
app.provide("echarts", echarts);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.Service = Service;

app.mount('#app')
