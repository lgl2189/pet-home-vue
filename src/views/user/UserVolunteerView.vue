<script setup>
  import { ref, computed } from 'vue'

  // Mock 志愿者数据（需从 volunteer 表获取）
  const volunteerInfo = ref({
    volunteer_id: 1,
    user_id: 1,
    rescue_station_id: 1,
    point: 200
  })

  // Mock 救助站名称（需从 rescue_station 表关联获取）
  const rescueStationName = ref('阳光流浪动物救助站')
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
        <span>{{ rescueStationName }}</span>
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
