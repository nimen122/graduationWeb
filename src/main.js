import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import "@/assets/icon/iconfont.css"
import * as echarts from "echarts/core";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Service from "@/api/config.js";
import store from './store'
const app = createApp(App);
app.provide("echarts", echarts);
app.use(router);
app.use(ElementPlus);
app.use(store)
app.config.globalProperties.Service = Service;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
