<script setup>
import { ref } from "vue"

const formRef = ref(null)
const form = ref({
  username: "",
  password: "",
  birthday: null,
  phone: "",
  email: "",
  idCard: "",
  realName: "",
})

const checkResults = ref({
  username: null,
  password: null,
  birthday: null,
  phone: null,
  email: null,
  idCard: null,
  realName: null,
})
</script>
<template>
  <div class="registration-container">
    <h1 class="registration-title">用户注册</h1>
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        <span v-if="checkResults.username" class="check-icon success">✔</span>
        <span v-else-if="checkResults.username !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"></el-input>
        <span v-if="checkResults.password" class="check-icon success">✔</span>
        <span v-else-if="checkResults.password !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择生日"></el-date-picker>
        <span v-if="checkResults.birthday" class="check-icon success">✔</span>
        <span v-else-if="checkResults.birthday !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
        <span v-if="checkResults.phone" class="check-icon success">✔</span>
        <span v-else-if="checkResults.phone !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        <span v-if="checkResults.email" class="check-icon success">✔</span>
        <span v-else-if="checkResults.email !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.idCard" placeholder="请输入身份证号"></el-input>
        <span v-if="checkResults.idCard" class="check-icon success">✔</span>
        <span v-else-if="checkResults.idCard !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
        <span v-if="checkResults.realName" class="check-icon success">✔</span>
        <span v-else-if="checkResults.realName !== null" class="check-icon error">✖</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.registration-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;

  .registration-title {
    margin-bottom: 30px;
    color: #333;
    font-size: 28px;
  }

  .check-icon {
    margin-left: 10px;
    font-size: 18px;
  }

  .success {
    color: green;
  }

  .error {
    color: red;
  }
}
</style>
