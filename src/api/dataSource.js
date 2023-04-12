import dataSource from './request.js';
import qs from "qs";

const getSourceDataApi = (data) =>{
    return dataSource.post({
        url:'/Source/getAllSource',
        data
    })
}
const getSourceApi = (data) =>{
    return dataSource.post({
        url:'/Source/getSource',
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

const auditPassApi = (data) =>{
    return dataSource.post({
        url:'/Source/checkPass',
        data
    })
}

const auditFailApi = (data) =>{
    return dataSource.post({
        url:'/Source/checkFail',
        data
    })
}

const errorHandleApi = (data) =>{
    return dataSource.post({
        url:'/Source/errorHandle',
        data
    })
}

export default {
    getSourceDataApi,
    getSourceApi,
    getChartDataInfoApi,
    addSourceDataApi,
    auditPassApi,
    auditFailApi,
    errorHandleApi,
}