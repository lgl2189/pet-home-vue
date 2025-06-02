<script setup>
  import { addAdoptionApplication } from '@/apis/adopt'
  import { useUserStore } from '@/stores/user'
  import { ref, reactive } from 'vue'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const userStore = useUserStore()
  const applyFormRef = ref(null)
  const applyForm = reactive({
    adoptor_id: userStore.userId,
    animal_id: route.query.animal,
    career: '',
    house_condition: '',
    experience: ''
  })
  const rules = reactive({
    career: [
      { required: true, message: '请输入您的职业', trigger: 'blur' },
      { max: 40, message: '职业长度不能超过40个字符', trigger: 'blur' }
    ],
    house_condition: [
      { required: true, message: '请描述您的住房条件', trigger: 'blur' },
      { max: 190, message: '住房条件描述不能超过190个字符', trigger: 'blur' }
    ],
    experience: [
      { required: true, message: '请描述您的饲养经验', trigger: 'blur' },
      { max: 190, message: '饲养经验描述不能超过190个字符', trigger: 'blur' }
    ]
  })

  // 函数
  const submitForm = () => {
    applyFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addAdoptionApplication(applyForm)
        if (res.status === '200') {
          ElMessage.success('提交成功')
        } else {
          ElMessage.error('提交失败, 请稍后再试')
        }
      } else {
        ElMessage.error('验证失败，请检查输入内容')
        return false
      }
    })
  }
  const resetForm = () => {
    applyFormRef.value.resetFields()
  }
</script>
<template>
  <div class="adoption-form-container">
    <el-card class="box-card">
      <el-form :model="applyForm" :rules="rules" ref="applyFormRef" label-width="120px" size="large">
        <el-form-item label="职业" prop="career">
          <el-input v-model="applyForm.career" placeholder="请输入您的职业" />
        </el-form-item>
        <el-form-item label="住房条件" prop="house_condition">
          <el-input v-model="applyForm.house_condition" type="textarea" :rows="4" placeholder="请描述您的住房条件" />
        </el-form-item>
        <el-form-item label="饲养经验" prop="experience">
          <el-input v-model="applyForm.experience" type="textarea" :rows="4" placeholder="请描述您的饲养经验" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
  .adoption-form-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;

    .box-card {
      margin-top: 20px;
    }
  }
</style>
