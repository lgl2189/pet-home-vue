<script setup>
  import { onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'

  // 响应式对象
  const props = defineProps({
    nowStep: {
      type: Number,
      required: true
    }
  })
  const router = useRouter()
  // 函数
  const handleClickHomeBtn = () => {
    router.push({ name: 'HomeView' })
  }
  // 生命周期回调函数
  onBeforeMount(() => {
    if (props.nowStep !== 2) {
      ElMessage.warning('请按步骤操作，先完成上一步操作')
      router.replace({ name: 'RescueRegistView' })
    }
  })
</script>
<template>
  <div class="rescue-success-container">
    <div class="success-message">
      <el-icon><CircleCheck /></el-icon>
      <span>上传完成</span>
    </div>
    <el-button type="primary" @click="handleClickHomeBtn">返回首页</el-button>
  </div>
</template>

<style lang="less" scoped>
  .rescue-success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    background-color: #f9fafb;

    .success-message {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 24px;
      color: #16a34a;

      .el-icon-circle-check {
        margin-right: 10px;
        font-size: 32px;
      }
    }

    .el-button {
      padding: 12px 24px;
      font-size: 16px;
    }
  }
</style>
