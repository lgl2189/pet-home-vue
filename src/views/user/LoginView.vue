<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { userLogin } from '@/apis/user'

  const formRef = ref(null)
  const form = ref({
    username: '',
    password: ''
  })

  const router = useRouter()

  const handleLogin = async () => {
    const response = await userLogin(form.value.username, form.value.password)
    if (response.status === '200') {
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } else {
      console.log('登陆失败：' + response.message)
    }
  }
</script>
<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">登录</h1>
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9;

    .login-box {
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      width: 360px;

      .login-title {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
      }

      .login-button {
        width: 100%;
        margin-top: 20px;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
</style>
