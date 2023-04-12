import {defineStore} from 'pinia'

export const user = defineStore('user',{
    state:() => {
        return{
            user:{},
        }
    },
    getters:{},
    actions:{},
    //开启数据缓存
    persist:{
        enabled:true,
        strategies:[{
            key:'current_user',
            storage:localStorage,
        }]
    }
})