<script setup>
  import { addVolunteerTask } from '@/apis/volunteer'
  import { ref, reactive } from 'vue'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const taskFormRef = ref(null)
  const taskForm = reactive({
    rescue_station_id: route.query.id,
    task_datetime: '',
    task_position: '',
    task_content: '',
    task_duration: ''
  })
  const rules = reactive({
    task_datetime: [{ required: true, message: '请选择任务日期', trigger: 'change' }],
    task_position: [{ required: true, message: '请输入任务地点', trigger: 'blur' }],
    task_content: [{ required: true, message: '请输入任务内容', trigger: 'blur' }],
    task_duration: [{ required: true, message: '请选择任务时长', trigger: 'change' }]
  })

  // 函数
  const disabledDate = (time) => {
    return time.getTime() <= Date.now()
  }
  const submitForm = () => {
    taskFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addVolunteerTask(taskForm)
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
    taskFormRef.value.resetFields()
  }
</script>
<template>
  <div class="volunteer-task-form-container">
    <el-card class="box-card">
      <el-form :model="taskForm" :rules="rules" ref="taskFormRef" label-width="120px" size="large">
        <el-form-item label="任务日期" prop="task_datetime">
          <el-date-picker
            v-model="taskForm.task_datetime"
            type="datetime"
            placeholder="选择任务日期"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :disabled-date="disabledDate" />
        </el-form-item>
        <el-form-item label="任务时长" prop="task_duration">
          <el-time-picker
            v-model="taskForm.task_duration"
            placeholder="选择任务时长"
            format="HH:mm:ss"
            value-format="HH:mm:ss" />
        </el-form-item>
        <el-form-item label="任务地点" prop="task_position">
          <el-input v-model="taskForm.task_position" placeholder="请输入任务地点" />
        </el-form-item>
        <el-form-item label="任务内容" prop="task_content">
          <el-input v-model="taskForm.task_content" type="textarea" :rows="4" placeholder="请输入任务内容" />
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
  .volunteer-task-form-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;

    .box-card {
      margin-top: 20px;
    }
  }
</style>
