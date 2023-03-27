import dataSource from './request.js';

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

export default {
    getSourceDataApi,
    getChartDataInfoApi,
}