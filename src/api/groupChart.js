import dataSource from './request.js';

const XbarRApi = (data) =>{
    return dataSource.post({
        url:'/GroupChart/XbarR',
        data
    })
}


export default {
    XbarRApi,

}