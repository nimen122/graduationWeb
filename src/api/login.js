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

const loginOut = (data) => {
    return login.get({
        url:'/Login/loginOut',
        data
    })
}

const currentUserApi = (data) =>{
    return login.post({
        url:'/Login/currentUser',
        data
    })
}

const allUserApi = (data) =>{
    return login.post({
        url:'/Login/allUser',
        data
    })
}
const getUserApi = (data) =>{
    return login.post({
        url:'/Login/getUser',
        data
    })
}

const updateUserApi = (data) =>{
    return login.post({
        url:'/Login/updateUser',
        data
    })
}

export default {
    loginApi,
    registerApi,
    currentUserApi,
    allUserApi,
    getUserApi,
    loginOut,
    updateUserApi
}