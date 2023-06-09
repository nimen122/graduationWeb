import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
      path: '/',
      redirect:'/login'
    },

    {
        name: 'login',
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        name: 'Home',
        path: '/home',
        component: () => import('../views/Home.vue'),
    },
    {
        name: 'DataImport',
        path: '/dataImport',
        component: () => import('../views/DataImport.vue'),
    },
    {
        name: 'SPCChart',
        path: '/SPCChart',
        component: () => import('../views/SPCChart.vue'),
    },
    {
        name: 'UserManage',
        path: '/UserManage',
        component: () => import('../views/UserManage.vue'),
    },
    {
        name: 'Log',
        path: '/Log',
        component: () => import('../views/Log.vue'),
    },
];

//这里不是通过new来创建，通过createRouter 方法创建，使用的模式不是通过mode来定义
const router = createRouter({
    routes,
    history: createWebHistory(),
})

export default router