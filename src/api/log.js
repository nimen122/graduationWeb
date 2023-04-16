import log from './request.js';

const getLogApi = (data) =>{
    return log.post({
        url:'/Log/getLog',
        data
    })
}


export default {
    getLogApi,
}