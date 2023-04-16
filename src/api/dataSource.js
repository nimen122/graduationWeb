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

const getSourceByIdApi = (data) =>{
    return dataSource.post({
        url:'/Source/getSourceById',
        data
    })
}

const getChartDataInfoApi = (data) =>{
    return dataSource.post({
        url:'/Source/getChartData',
        data
    })
}

const getDataById = (data) =>{
    return dataSource.post({
        url:'/Source/getDataById',
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
    getSourceByIdApi,
    getChartDataInfoApi,
    getDataById,
    addSourceDataApi,
    auditPassApi,
    auditFailApi,
    errorHandleApi,
}