<script setup>
  import { ref, reactive } from 'vue'
  import { submitVolunteerTaskRecordProof } from '@/apis/volunteer'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const formRef = ref(null)
  const formData = reactive({
    proofImages: []
  })
  const taskRecordId = ref(route.params.recordId)

  // 函数
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        const res = await submitVolunteerTaskRecordProof(taskRecordId.value, formData.proofImages)
        if (res.status === '200') {
          ElMessage.success('证明提交成功')
          return true
        } else {
          ElMessage.error('证明提交失败，请检查网络或联系管理员')
        }
      } else {
        ElMessage.warning('表单验证失败，请检查必填项')
        return false
      }
    })
  }

  const resetForm = () => {
    formRef.value.resetFields()
  }
</script>
<template>
  <div class="container">
    <el-card class="upload-box">
      <div slot="header">提交志愿者任务完成证明</div>
      <div class="upload-form">
        <el-form ref="formRef" :model="formData" label-width="120px" size="large" status-icon>
          <el-form-item label="完成证明图片" prop="formData.proofImages">
            <el-upload v-model:file-list="formData.proofImages" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <template v-slot:tip>
                <div class="el-upload__tip">只能上传图片文件，且不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;

    .upload-box {
      width: 700px;
      margin-top: 30px;

      .upload-box-title {
        margin-top: 20px;
        margin-left: 20px;
        font-size: 24px;
      }

      .upload-form {
        margin-top: 20px;
      }
    }
  }
</style>
