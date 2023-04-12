<template>
  <!-- 最外层的大盒子 -->
  <div class="bigBox">
    <div class="box">
      <!-- 滑动盒子 -->
      <div class="pre-box" ref="preRef">
        <h1 style="font-size: 45px">SPC 质量控制系统</h1>
        <p style="font-size: 35px">欢迎使用</p>
        <div class="img-box">
          <img :src="flag == true ? getImage('1.jpg') : getImage('2.jpg')" alt="">
        </div>
      </div>
      <!-- 注册盒子 -->
      <div class="register-form" v-loading="registerLoading">
        <!-- 标题盒子 -->
        <div class="title-box" >
          <h1>注册</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="5px">
          <el-form-item prop="loginAccount" label="">
            <el-input type="text" placeholder="用户名" :suffix-icon="User" v-model="registerForm.loginAccount" />
          </el-form-item>
          <el-form-item prop="loginPassword" label="">
            <el-input type="password" placeholder="密码" :suffix-icon="Lock" v-model="registerForm.loginPassword" />
          </el-form-item>
          <el-form-item prop="confirmPassword" label="">
            <el-input type="password" placeholder="确认密码" :suffix-icon="Lock" v-model="registerForm.confirmPassword"/>
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="register">注册</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch()" style="margin-top: -0px">已有账号?去登录</p>
        </div>
      </div>
      <!-- 登录盒子 -->
      <div class="login-form" v-loading="loginLoading">
        <!-- 标题盒子 -->
        <div class="title-box" >
          <h1>登录</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="5px">
          <el-form-item prop="loginAccount" label="">
            <el-input type="text" placeholder="用户名" :suffix-icon="User" v-model="loginForm.loginAccount" />
          </el-form-item>
          <el-form-item prop="loginPassword" label="">
            <el-input type="password" placeholder="密码" :suffix-icon="Lock" v-model="loginForm.loginPassword"/>
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="login">登录</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch()" style="margin-top: -0px">没有账号?去注册</p>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup>
import { reactive, ref} from "vue";
import {Lock,User} from '@element-plus/icons-vue';
import api from '@/api/login.js'
import message from "../utils/Message.js";
import {user} from '@/store/user.js'

const userStore = user()
const preRef = ref('')

let flag = ref(true)
const mySwitch = () => {
  if (flag.value){
    preRef.value.style.background = "#c9e0ed"
    preRef.value.style.transform = "translateX(100%)"
  }else {
    preRef.value.style.background = "#C4CDD2"
    preRef.value.style.transform = "translateX(0%)"
  }
  flag.value = !flag.value
}
const getImage = (name) => {
  return new URL('../assets/'+name,import.meta.url).href;
}

const loginForm = reactive({
  loginAccount: '',
  loginPassword:'',
})
const registerForm = reactive({
  loginAccount: '',
  loginPassword:'',
  confirmPassword:'',
})
const loginFormRef = ref()
const registerFormRef = ref()
const rules = {
  loginAccount:[{
      required: true,
      message: "请输入用户名",
      trigger: "blur"
  }],
  loginPassword: [{
    required: true,
    message: "请输入密码",
    trigger: "blur",
  }],
}
const registerRules = {
  loginAccount:[{
    required: true,
    message: "请输入用户名",
  }],
  loginPassword: [
      { required: true, message: "请输入密码",trigger: "blur"},
  ],
  confirmPassword: [
      {required: true, message: "请输入确认密码", trigger: "blur"},
      { validator: validatePass, trigger: "blur" }
  ],
}
// 两次密码相同校验
function validatePass(rule, value, callback){
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.loginPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
}

const router = useRouter()

const loginLoading = ref(false)

const login = ()=>{
  loginLoading.value = true
  loginFormRef.value.validate((valid)=>{
    if (!valid){
      return;
    }
    api.loginApi(loginForm).then( res=>{
      loginLoading.value = false
      if (res.success){
        message.sucess("登陆成功")
        window.sessionStorage.setItem('token',res.data)
        router.push('/Home')
        getCurrentUser()
      }
    }).catch(error =>{
      console.log(error)
      loginLoading.value = false
      message.error("请求超时，请重试")
    })
  })
}

const registerLoading = ref(false)

const register =()=>{
  registerLoading.value = true
  registerFormRef.value.validate((valid)=>{
    if (!valid){
      return;
    }
    api.registerApi(registerForm).then( res=>{
      registerLoading.value = false
      if (res.success){
        message.sucess("注册成功")
      }
    }).catch(error =>{
      console.log(error)
    })
  })
}

const getCurrentUser = () => {
  api.currentUserApi().then( res => {
    if (res.success){
      let data = {
        userAccount:res.data.userAccount,
        userName:res.data.userName,
        userRole:res.data.userRole,
        userPhone:res.data.userPhone,
        token:res.data.token
      }
      userStore.user = data
    }
  }).catch( error => {
    console.log(error)
  })
}

</script>

<style scoped>
/* 去除input的轮廓 */
input {
  outline: none;
}

.bigBox {
  /* 溢出隐藏 */
  overflow-x: hidden;
  height: 100vh;
  display: flex;
  /* 渐变方向从左到右 */
  background: linear-gradient(to right, rgb(196, 205, 210), rgb(191, 227, 241));
}

span {
  position: absolute;
  z-index: 0;
  bottom: 0;
  border-radius: 50%;
  /* 径向渐变 */
  background: radial-gradient(circle at 72% 28%, #fff 3px, #ff7edf 8%, #5b5b5b, #aad7f9 100%);
  /* 泡泡内阴影 */
  box-shadow: inset 0 0 6px #fff,
  inset 3px 0 6px #eaf5fc,
  inset 2px -2px 10px #efcde6,
  inset 0 0 60px #f9f6de,
  0 0 20px #fff;
  /* 动画 */
  animation: myMove 4s linear infinite;
}


@keyframes myMove {
  0% {
    transform: translateY(0%);
    opacity: 1;
  }

  50% {
    transform: translate(10%, -1000%);
  }

  75% {
    transform: translate(-20%, -1200%);
  }

  99% {
    opacity: .9;
  }

  100% {
    transform: translateY(-1800%) scale(1.5);
    opacity: 0;
  }
}

/* 最外层的大盒子 */
.box {
  width: 1050px;
  height: 600px;
  display: flex;
  /* 相对定位 */
  position: relative;
  z-index: 2;
  margin: auto;
  /* 设置圆角 */
  border-radius: 8px;
  /* 设置边框 */
  border: 1px solid rgba(255, 255, 255, .6);
  /* 设置盒子阴影 */
  box-shadow: 2px 1px 19px rgba(0, 0, 0, .1);
}

/* 滑动的盒子 */
.pre-box {
  /* 宽度为大盒子的一半 */
  width: 50%;
  /* width: var(--width); */
  height: 100%;
  /* 绝对定位 */
  position: absolute;
  /* 距离大盒子左侧为0 */
  left: 0;
  /* 距离大盒子顶部为0 */
  top: 0;
  z-index: 99;
  border-radius: 4px;
  background-color: rgb(196, 205, 210);
  box-shadow: 2px 1px 19px rgba(0, 0, 0, .1);
  /* 动画过渡，先加速再减速 */
  transition: 0.5s ease-in-out;
}

/* 滑动盒子的标题 */
.pre-box h1 {
  margin-top: 150px;
  text-align: center;
  /* 文字间距 */
  letter-spacing: 5px;
  color: white;
  /* 禁止选中 */
  user-select: none;
  /* 文字阴影 */
  text-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
}

/* 滑动盒子的文字 */
.pre-box p {
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0;
  /* 禁止选中 */
  user-select: none;
  font-weight: bold;
  color: white;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
}

/* 图片盒子 */
.img-box {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  /* 设置为圆形 */
  border-radius: 50%;
  /* 设置用户禁止选中 */
  user-select: none;
  overflow: hidden;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
}

/* 图片 */
.img-box img {
  width: 100%;
  transition: 0.5s;
}

/* 登录和注册盒子 */
.login-form,
.register-form {
  margin-top: -0px;
  flex: 1;
  height: 100%;
}

/* 标题盒子 */
.title-box {
  height: 300px;
  line-height: 500px;

}

/* 标题 */
.title-box h1 {
  margin-top: -20px;
  text-align: center;
  color: white;
  /* 禁止选中 */
  user-select: none;
  letter-spacing: 5px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, .1);

}

/* 输入框盒子 */
.el-form {
  display: flex;
  /* 纵向布局 */
  flex-direction: column;
  /* 水平居中 */
  align-items: center;
}
.el-form-item{
  width: 65%;
}

/* 输入框 */
input {
  /*width: 60%;*/
  height: 40px;
  margin-bottom: 20px;
  text-indent: 10px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 120px;
  /* 增加磨砂质感 */
  backdrop-filter: blur(10px);
}

input:focus {
  /* 光标颜色 */
  color: #b0cfe9;

}

/* 聚焦时隐藏文字 */
input:focus::placeholder {
  opacity: 0;
}

/* 按钮盒子 */
.btn-box {
  display: flex;
  justify-content: center;
}

/* 按钮 */
button {
  width: 100px;
  height: 30px;
  margin: 0 7px;
  line-height: 30px;
  border: none;
  border-radius: 4px;
  background-color: #69b3f0;
  color: white;
}

/* 按钮悬停时 */
button:hover {
  /* 鼠标小手 */
  cursor: pointer;
  /* 透明度 */
  opacity: .8;
}

/* 按钮文字 */
.btn-box p {
  height: 30px;
  line-height: 30px;
  /* 禁止选中 */
  user-select: none;
  font-size: 14px;
  color: white;

}

.btn-box p:hover {
  cursor: pointer;
  border-bottom: 1px solid white;
}
</style>