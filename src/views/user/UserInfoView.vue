<script setup>
  import { getUserInfo, updateUserInfo } from '@/apis/user'
  import { useUserStore } from '@/stores/user'
  import { ref, computed, onBeforeMount, reactive } from 'vue'

  // 响应式对象
  const userStore = useUserStore()
  const userInfo = ref({
    user_id: 0,
    user_name: '',
    real_name: '',
    china_id: '',
    birth_date: null,
    phone: '',
    email: ''
  })

  const isEditing = ref(false)

  const rules = reactive({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
    ],
    birthday: [{ required: true, message: '请输入出生日期', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ]
  })

  // 函数
  const handleGetUserInfo = async () => {
    const res = await getUserInfo(userStore.userId)
    if (res.status === '200') {
      userInfo.value = res.data.user_info
    }
  }
  const handleUpdateUserInfo = async () => {
    const res = await updateUserInfo(userInfo.value.user_id, userInfo.value)
    if (res.status === '200') {
      ElMessage.success('修改保存成功')
    } else {
      ElMessage.error('修改保存失败，请稍后再试')
    }
  }
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
  const submitForm = (formElement) => {
    if (!formElement) {
      return
    }
    formElement.validate(async (valid) => {
      if (valid) {
        const res = await userRegist(form)
        if (res.status === '200') {
          router.push('/user/login')
        } else {
          alert('提交失败')
        }
      } else {
        alert('表单验证失败')
      }
    })
  }
  // 编辑状态控制
  const startEditing = () => {
    isEditing.value = true
  }
  const saveChanges = () => {
    // 此处添加保存逻辑
    handleUpdateUserInfo()
    isEditing.value = false
  }
  const cancelEditing = () => {
    isEditing.value = false
  }
  // 生命周期
  onBeforeMount(async () => {
    await handleGetUserInfo()
  })
</script>
<template>
  <div class="user-info-page">
    <h2 class="page-title">个人信息</h2>
    <form class="info-form">
      <!-- 不可修改字段 -->
      <div class="form-item">
        <label>用户ID：</label>
        <span>{{ userInfo.user_id }}</span>
      </div>
      <div class="form-item">
        <label>真实姓名：</label>
        <span>{{ userInfo.real_name }}</span>
      </div>
      <div class="form-item">
        <label>身份证号：</label>
        <span>{{ userInfo.china_id }}</span>
      </div>

      <!-- 可修改字段 -->
      <div class="form-item">
        <label>用户名：</label>
        <input v-model="userInfo.user_name" :disabled="!isEditing" placeholder="请输入用户名" />
      </div>
      <div class="form-item">
        <label>出生日期：</label>
        <el-date-picker
          v-model="userInfo.birth_date"
          :disabled="!isEditing"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择出生日期"
          :disabled-date="disabledDate"></el-date-picker>
      </div>
      <div class="form-item">
        <label>手机号：</label>
        <input v-model="userInfo.phone" :disabled="!isEditing" placeholder="请输入手机号" />
      </div>
      <div class="form-item">
        <label>邮箱：</label>
        <input v-model="userInfo.email" :disabled="!isEditing" placeholder="请输入邮箱" />
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button v-if="!isEditing" @click="startEditing">编辑</button>
        <button v-if="isEditing" @click="saveChanges">保存</button>
        <button v-if="isEditing" @click="cancelEditing">取消</button>
      </div>
    </form>
  </div>
</template>
<style lang="less" scoped>
  .user-info-page {
    .form-item {
      margin-bottom: 16px;
      font-size: 14px;

      label {
        display: inline-block;
        width: 80px;
        text-align: right;
        margin-right: 12px;
        color: #666;
      }

      input {
        padding: 6px 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        width: 240px;
      }

      span {
        color: #333;
        margin-left: 8px;
      }
    }

    .action-buttons {
      margin-top: 24px;
      text-align: right;

      button {
        margin-left: 8px;
        padding: 6px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:first-child {
          background: #409eff;
          color: white;
        }

        &:nth-child(2) {
          background: #67c23a;
          color: white;
        }

        &:last-child {
          background: #f56c6c;
          color: white;
        }
      }
    }
  }
</style>
