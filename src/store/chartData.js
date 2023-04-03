import {defineStore} from 'pinia'

export const chartData = defineStore('chartData',{
    state:() => {
        return{
            chartData:[],
        }
    },
    getters:{},
    actions:{},
    //开启数据缓存,关闭页面会清空
    persist:{
        enabled:true,
    }
})