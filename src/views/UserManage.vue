<template>
  <Header></Header>
  <div class="data-main">
    <div class="main-t">
      <el-input
          v-model="input"
          class="input"
          placeholder="账号姓名模糊查询"
          :suffix-icon="Search"
          @change="getUser"
      />
      <el-text size="large" style="margin-left: 30px"> 用户角色筛选：</el-text>
      <el-select v-model="userRole" @change="getUser">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <div class="main-main">
      <div style="height: 90%;width: 100%">
        <el-table v-loading="userInfoLoading" :data="userInfo" style="width: 100%;height: 100%" >
          <el-table-column fixed prop="userAccount" label="账号" width="200"  align="center" />
          <el-table-column prop="userName" label="姓名" width="200" align="center"/>
          <el-table-column prop="userPhone" label="联系方式" width="250" align="center"/>
          <el-table-column prop="userRole" label="用户角色" width="200" align="center"/>
          <el-table-column fixed="right" label="操作" width="350" align="center">
            <template #default="scope">
              <el-button @click="updateUser(scope.$index, scope.row)" type="primary" :disabled="notOperation(scope.row)">修改用户信息</el-button>
<!--              <el-button @click="delUser(scope.$index, scope.row)" type="danger" :disabled="notOperation(scope.row)">注销账号</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="demo-pagination-block">
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :page-sizes="[10, 20, 30, 40 , 50]"
            :disabled="false"
            :background = true
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
  <div v-loading="updateUserDialog.isLoading">
    <el-dialog
        :title="'更新'+updateUserDialog.userAccount+'用户信息'"
        v-model="updateUserDialog.isVisible"
        width="50%"
    >
      <el-container>
        <el-text style="margin-left: 40px">用户姓名</el-text>
        <el-input v-model="updateUserDialog.userName" placeholder="请输入用户姓名" style="width: 30%;margin-left: 20px"></el-input>
        <el-text style="margin-left: 40px">用户手机号码</el-text>
        <el-input v-model="updateUserDialog.userPhone" placeholder="请输入用户手机号码" style="width: 30%;margin-left: 20px" ></el-input>
      </el-container>
<!--      <el-container style="margin-top: 30px">-->
<!--        <el-text style="margin-left: 40px">用户角色</el-text>-->
<!--        <el-select  style="margin-left: 20px" v-model="updateUserDialog.userRole"  :disabled="currentUser.userRole === '普通用户' ">-->
<!--          <el-option-->
<!--              v-for="item in dialogOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-container>-->

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateUserDialog.isVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateTrue">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import Header from "@/components/common/Header.vue";
import api from "@/api/login.js"
import message from "../utils/Message.js";
import {onMounted, reactive, ref} from "vue";
import {Search } from '@element-plus/icons-vue'
import { user } from '@/store/user.js'

const userStore = user()

const userInfo = ref([])

const userInfoLoading = ref(false)

const currentPage = ref(1)

const pageSize = ref(10)

const total = ref(0)

const input = ref('')

const currentUser = ref()

const userRole = ref('')
const options = ref([
  {
    value: '全部',
    label: '全部',
  },
  {
    value: '管理员',
    label: '管理员',
  },
  {
    value: '普通用户',
    label: '普通用户',
  },
])

const dialogOptions = ref([
  {
    value: '管理员',
    label: '管理员',
  },
  {
    value: '普通用户',
    label: '普通用户',
  },
])

const updateUserDialog = reactive({
  isLoading:false,
  isVisible:false,
  userAccount:'',
  userName:'',
  userPhone:'',
  userRole:''
})

const handleSizeChange = (val) => {
  getUser()
}
const handleCurrentChange = (val) => {
  getUser()
}

const updateUser = (index,user) =>{
  updateUserDialog.isVisible = true
  updateUserDialog.userAccount = user.userAccount
  updateUserDialog.userName = user.userName
  updateUserDialog.userPhone = user.userPhone
  updateUserDialog.userRole = user.userRole
}

const updateTrue = () => {
  updateUserDialog.isLoading = true
  let data = {
    userAccount:updateUserDialog.userAccount,
    userName:updateUserDialog.userName,
    userPhone:updateUserDialog.userPhone
  }
  api.updateUserApi(data).then( res => {
    if (res.success){
      updateUserDialog.isLoading = false
      updateUserDialog.isVisible = false
      message.sucess("修改成功")
      getUser()
    }
  }).catch( error => {
    message.error("请求超时")
    updateUserDialog.isLoading = false
    updateUserDialog.isVisible = false
  })
}

const notOperation = (user) => {
  if (currentUser.value.userRole === '普通用户'){
    if (currentUser.value.userAccount === user.userAccount){
      return false
    }
    return true
  }else {
    if (user.userRole === '普通用户'){
      return false
    }else {
      if (currentUser.value.userAccount === user.userAccount){
        return false
      }
      return true
    }
  }
}

const delUser = () => {

}

// const getUser = () => {
//   api.allUserApi().then( res => {
//     console.log(res.data)
//     if (res.success){
//       userInfo.value = res.data
//     }
//   }).catch( error => {
//     console.log(error)
//     message.error("请求超时，请重试")
//   })
// }

const getUser = () => {
  userInfoLoading.value = true

  let data = {
    page:currentPage.value,
    size:pageSize.value,
    input:input.value,
    userRole:userRole.value,
  }

  api.getUserApi(data).then( res => {
    userInfoLoading.value = false
    console.log(res.data)
    if (res.success){
      userInfo.value = res.data.userList
      total.value = res.data.total
    }
  }).catch( error => {
    console.log(error)
    userInfoLoading.value = false
    message.error("请求超时，请重试")
  })
}


onMounted(() => {
  currentUser.value = userStore.user
  userRole.value = options.value[0].value
  getUser()
})

</script>

<style scoped>
.data-main{
  width: 100%;
  height: 89.5%;
  background: rgb(238,238,238);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-t{
  width: 100%;
  height: 10%;
  margin: 0 auto;
  display: flex;
  align-items: center;

}
.main-main{
  width: 80%;
  height: 90%;
  flex-direction: column;
  display: flex;
  align-items: center;
}
.input{
  width: 15%;
  margin-left: 160px;
}

</style>