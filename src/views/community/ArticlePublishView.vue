<script setup>
  import { ref, reactive } from 'vue'
  import { publishArticle } from '@/apis/article'
  import { useUserStore } from '@/stores/user'
  import dayjs from 'dayjs'

  // 响应式对象
  const userStore = useUserStore()
  const formRef = ref(null)
  const articleInfo = reactive({
    publisherId: userStore.userId,
    publishDate: '',
    content: ''
  })

  const rules = reactive({
    publisherId: [
      { required: true, message: '请输入发布者ID', trigger: 'blur' },
      { type: 'number', message: '发布者ID必须为数字', trigger: 'change' }
    ],
    publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
  })

  // 函数
  const submitForm = async () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          articleInfo.publishDate = dayjs(articleInfo.publishDate).format('YYYY-MM-DDTHH:mm:ss')
          const res = await publishArticle(articleInfo)
          if (res.status === '200') {
            ElMessage.success('文章发布成功')
            return true
          } else {
            ElMessage.error('文章发布失败，请检查网络或联系管理员')
          }
        } catch (error) {
          ElMessage.error('文章发布失败，请检查网络或联系管理员')
          console.error(error)
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
    <div class="upload-box">
      <div class="upload-box-title">文章发布</div>
      <div class="upload-form">
        <el-form ref="formRef" :model="articleInfo" :rules="rules" label-width="120px" size="large" status-icon>
          <el-form-item label="发布日期" prop="publish_date">
            <el-date-picker
              v-model="articleInfo.publishDate"
              type="datetime"
              placeholder="请选择发布日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <el-input v-model="articleInfo.content" placeholder="请输入文章内容" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f4f9;

    .upload-box {
      width: 700px;

      .upload-box-title {
        margin-top: 20px;
        margin-left: 60px;
        font-size: 24px;
      }

      .upload-form {
        margin-top: 20px;
      }
    }
  }
</style>
