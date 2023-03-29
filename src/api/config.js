import axios from 'axios'
import message from "@/utils/Message.js";

//创建axios实例
const Service = axios.create({
    baseURL:"http://localhost:8888",
    headers:{
        'Content-Type':"application/json;charset=UTF-8"
    },

    timeout:10000
})
Service.interceptors.request.use(
    (config)=>{
        //配置请求头
        const isToken = (config.headers || {}).isToken === false
        if (window.sessionStorage.getItem('token') && !isToken) {
            config.headers['Authorization'] = window.sessionStorage.getItem('token') // 让每个请求携带自定义token
        }
        return config
    },
)

Service.interceptors.response.use((response) =>{
    //获取接口返回结果
    const res = response.data
    if (res.success){
        return res
    }else {
        message.error(res.msg)
        return res
    }
})

export default Service;