import dataSource from './request.js';
import qs from "qs";

const getSourceDataApi = (data) =>{
    return dataSource.post({
        url:'/Source/getAllSource',
        data
    })
}

const getChartDataInfoApi = (data) =>{
    return dataSource.post({
        url:'/Source/getChartData',
        data
    })
}

const addSourceDataApi = (data) =>{
    return dataSource.post({
        url:'/Source/addSource',
        data
    })
}

export default {
    getSourceDataApi,
    getChartDataInfoApi,
    addSourceDataApi,
}