<script setup>
  import { getVolunteerInfo } from '@/apis/user'
  import { useUserStore } from '@/stores/user'
  import { onBeforeMount, ref } from 'vue'

  // 响应式变量
  const userStore = useUserStore()
  const volunteerInfo = ref({
    volunteer_id: 1,
    user_id: 1,
    rescue_station_id: 1,
    point: 200
  })
  const rescueStationInfo = ref({
    rescue_station_id: 1,
    rescue_station_name: '',
    position: '',
    admin_user_id: 1,
    admin_user_id: 1,
    admin_user_name: '',
    admin_birth_date: '',
    admin_phone: '',
    admin_email: ''
  })

  // 函数
  const handleGetVolunteerInfo = async () => {
    const res = await getVolunteerInfo(userStore.userId)
    if (res.status === '200') {
      volunteerInfo.value = res.data.volunteer_info
      rescueStationInfo.value = res.data.volunteer_info.rescue_station_info
    }
  }

  // 生命周期函数
  onBeforeMount(async () => {
    await handleGetVolunteerInfo()
  })
</script>
<template>
  <div class="volunteer-page">
    <h2 class="page-title">志愿者信息</h2>
    <div v-if="volunteerInfo" class="info-card">
      <div class="card-item">
        <span>志愿者ID：</span>
        <span>{{ volunteerInfo.volunteer_id }}</span>
      </div>
      <div class="card-item">
        <span>所属救助站：</span>
        <span>{{ rescueStationInfo.rescue_station_name }}</span>
      </div>
      <div class="card-item">
        <span>累计积分：</span>
        <span>{{ volunteerInfo.point }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .volunteer-page {
    .info-card {
      margin-top: 24px;
      padding: 24px;
      background: #f5f7fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      .card-item {
        margin-bottom: 12px;
        font-size: 14px;
        color: #666;

        span {
          &:first-child {
            font-weight: 500;
            color: #333;
            margin-right: 8px;
          }
        }
      }
    }
  }
</style>
