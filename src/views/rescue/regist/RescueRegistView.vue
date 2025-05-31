<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  // 响应式变量
  const router = useRouter()
  const activeStep = ref(0)
  const animalId = ref(null)

  // 函数
  const handleAnimalUploaded = (animalInfo) => {
    animalId.value = animalInfo.animal_id
    activeStep.value = 1
    router.push({ name: 'RecordUploadView' })
  }
  const handleRecordUploaded = () => {
    activeStep.value = 2
    router.push({ name: 'RescueSuccessView' })
  }
</script>
<template>
  <div class="rescue-regist-container">
    <el-steps :active="activeStep" finish-status="success" align-center>
      <el-step title="动物信息上传"></el-step>
      <el-step title="救助信息上传"></el-step>
      <el-step title="上传完成"></el-step>
    </el-steps>
    <router-view
      @animal-upload-success="handleAnimalUploaded"
      @record-upload-success="handleRecordUploaded"
      :now-step="activeStep"
      :animal-id="animalId"></router-view>
  </div>
</template>
<style lang="less" scoped>
  .rescue-regist-container {
    padding: 20px;
    background-color: #f4f4f9;

    .el-steps {
      margin-bottom: 20px;
    }
  }
</style>
