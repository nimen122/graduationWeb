import Service from "./config.js";

//封装get请求
export const get = (config)=>{
    return Service({
        ...config,
        method:'get',
        params:config.data
    })
}

//封装post请求
export const post = (config)=>{
    return Service({
        ...config,
        method:'post',
        params:config.data
    })
}

export default {
    get,
    post
}