import {defineStore} from 'pinia'

export const table = defineStore('table',{
    state:() => {
        return{
            tableData:[],
        }
    },
    getters:{},
    actions:{},
    //开启数据缓存
    persist:{
        enabled:true,
        strategies:[{
            key:'my_tableData',
            storage:localStorage,
        }]
    }
})