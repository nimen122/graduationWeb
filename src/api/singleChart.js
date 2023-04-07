import dataSource from './request.js';

const IMRApi = (data) =>{
    return dataSource.post({
        url:'/SingleChart/IMR',
        data
    })
}

const delIMRApi = (data) =>{
    return dataSource.post({
        url:'/SingleChart/delIMR',
        data
    })
}

const IApi = (data) =>{
    return dataSource.post({
        url:'/SingleChart/I',
        data
    })
}

const delIApi = (data) =>{
    return dataSource.post({
        url:'/SingleChart/delI',
        data
    })
}


const MRApi = (data) =>{
    return dataSource.post({
        url:'/SingleChart/MR',
        data
    })
}
const delMRApi = (data) =>{
    return dataSource.post({
        url:'/SingleChart/delMR',
        data
    })
}

export default {
    IMRApi,delIMRApi,
    MRApi,delMRApi,
    IApi,delIApi,
}