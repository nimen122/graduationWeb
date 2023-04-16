import upload from './request.js'

const uploadApi = (data) =>{
    return upload.post({
        url:'/Upload/upload',
        data
    })
}
export default {
   uploadApi,
}