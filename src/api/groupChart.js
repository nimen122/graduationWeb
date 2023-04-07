import dataSource from './request.js';

const XbarRApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/XbarR',
        data
    })
}
const delXbarRApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/delXbarR',
        data
    })
}

const XbarSApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/XbarS',
        data
    })
}
const delXbarSApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/delXbarS',
        data
    })
}

const XbarApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/Xbar',
        data
    })
}

const delXbarApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/delXbar',
        data
    })
}

const RApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/R',
        data
    })
}
const delRApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/delR',
        data
    })
}
const SApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/S',
        data
    })
}
const delSApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/delS',
        data
    })
}

export default {
    XbarRApi,delXbarRApi,
    XbarSApi,delXbarSApi,
    XbarApi,delXbarApi,
    RApi,delRApi,
    SApi,delSApi,

}