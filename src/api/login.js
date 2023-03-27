import login from './request.js';

const loginApi = (data) =>{
    return login.post({
        url:'/Login/login',
        data
    })
}

const registerApi = (data) =>{
    return login.post({
        url:'/Login/register',
        data
    })
}
export default {
    loginApi,
    registerApi
}