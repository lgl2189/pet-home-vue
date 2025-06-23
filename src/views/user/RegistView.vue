<script setup>
  import { userRegist } from '@/apis/user'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  //响应式变量
  const router = useRouter()
  const formRef = ref()
  const form = reactive({
    username: '',
    password: '',
    checkPassword: '',
    birthday: null,
    phone: '',
    email: '',
    chinaId: '',
    realName: ''
  })
  const dialogVisible = ref(false)
  const dialogTipText = ref('')
  // 配置日期选择器选项，限制不能选择大于今天的日期
  const disabledDate = (time) => {
    return time.getTime() > Date.now()
  }
  // 自定义验证规则
  // validator校验器函数必须在rules之前定义，否则会报错：在初始化之前获取
  const validateCheckPassword = (_rule, value, callback) => {
    if (value !== form.password) {
      callback(new Error('两次输入的密码不一致!'))
    } else {
      callback()
    }
  }
  const rules = reactive({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 8, max: 16, message: '密码长度为8-16个字符', trigger: 'blur' },
      { pattern: /[a-zA-Z]/, message: '密码必须包含字母', trigger: 'blur' }
    ],
    checkPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      { validator: validateCheckPassword, trigger: 'blur' }
    ],
    birthday: [{ required: true, message: '请输入出生日期', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ],
    chinaId: [
      { required: true, message: '请输入身份证号', trigger: 'blur' },
      {
        pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/,
        message: '请输入正确的身份证号',
        trigger: 'blur'
      }
    ],
    realName: [
      { required: true, message: '请输入真实姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' }
    ]
  })
  const submitForm = (formElement) => {
    if (!formElement) {
      return
    }
    formElement.validate(async (valid) => {
      if (valid) {
        const res = await userRegist(form)
        if (res.status === '200') {
          dialogTipText.value = res.data.user_id
          dialogVisible.value = true
        } else {
          alert('提交失败')
        }
      } else {
        alert('表单验证失败')
      }
    })
  }
  const resetForm = (formelement) => {
    if (!formelement) {
      return
    }
    formelement.resetFields()
  }
</script>
<template>
  <div class="container">
    <el-dialog v-model="dialogVisible" width="500" title="Tips">
      <div style="color: #00aeec"><router-link to="/user/login">注册成功，点击跳转到登陆界面</router-link></div>
      <div>您的帐号为：{{ dialogTipText }}</div>
      <el-button size="default" @click="dialogVisible = false">关闭</el-button>
    </el-dialog>
    <div class="regist-form-wrap">
      <h1 class="regist-title">用户注册</h1>
      <el-form ref="formRef" :model="form" label-width="120px" class="regist-form" status-icon :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="form.checkPassword" type="password" placeholder="请输入相同密码"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择出生日期"
            :disabled-date="disabledDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="chinaId">
          <el-input v-model="form.chinaId" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">注册</el-button>
          <el-button type="plain" @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .regist-form-wrap {
      width: 400px;
      margin-top: 50px;

      .regist-title {
        width: 400px;
        margin-bottom: 20px;
        text-align: center;
      }

      .regist-form {
        max-width: 340px;
      }
    }
  }
</style>
