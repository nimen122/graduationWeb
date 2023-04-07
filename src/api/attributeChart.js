import dataSource from './request.js';

const PApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/P',
        data
    })
}

const delPApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/delP',
        data
    })
}

const LaneyPApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/LaneyP',
        data
    })
}

const delLaneyPApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/delLaneyP',
        data
    })
}

const NPApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/NP',
        data
    })
}

const delNPApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/delNP',
        data
    })
}

const UApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/U',
        data
    })
}

const delUApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/delU',
        data
    })
}

const LaneyUApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/LaneyU',
        data
    })
}

const delLaneyUApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/delLaneyU',
        data
    })
}

const CApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/C',
        data
    })
}

const delCApi = (data) =>{
    return dataSource.post({
        url:'/AttributeChart/delC',
        data
    })
}


export default {
    PApi,delPApi,
    LaneyPApi,delLaneyPApi,
    NPApi,delNPApi,
    UApi,delUApi,
    LaneyUApi,delLaneyUApi,
    CApi,delCApi,
}