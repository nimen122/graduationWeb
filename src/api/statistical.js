import statistical from './request.js';

const todayApi = (data) =>{
    return statistical.get({
        url:'/Statistical/todayStatistical',
        data
    })
}

const historyApi = (data) =>{
    return statistical.get({
        url:'/Statistical/historyStatistical',
        data
    })
}
export default {
    todayApi,
    historyApi
}