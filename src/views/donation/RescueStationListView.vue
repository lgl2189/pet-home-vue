<script setup>
  import { ref, computed, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { getRescueStationListByAdminId } from '@/apis/rescue'

  // 响应式变量
  // 模拟救助站数据
  const router = useRouter()
  const userStore = useUserStore()
  const searchKeyword = ref('')
  const stationList = ref([
    {
      rescue_station_id: 1,
      rescue_station_name: '',
      position: '',
      admin_user_id: 1
    }
  ])
  // 计算属性
  // 根据关键词过滤救助站
  const filteredStationList = computed(() => {
    if (!searchKeyword.value.trim()) {
      return stationList.value
    }
    const keyword = searchKeyword.value.trim().toLowerCase()
    return stationList.value.filter(
      (station) =>
        station.rescue_station_name.toLowerCase().includes(keyword) || station.position.toLowerCase().includes(keyword)
    )
  })

  // 函数
  // 选择救助站处理函数
  const handleGetStationList = async () => {
    const res = await getRescueStationListByAdminId(userStore.userId)
    if (res.status === '200') {
      stationList.value = res.data.station_list
    } else {
      ElMessage.error('获取救助站列表失败')
    }
  }
  const handleStationSelect = (station) => {
    router.push({
      name: 'RescueStationDetailView',
      params: { stationId: station.rescue_station_id },
      query: {
        id: station.rescue_station_id,
        name: station.rescue_station_name
      }
    })
  }
  // 生命周期
  onBeforeMount(async () => {
    await handleGetStationList()
  })
</script>
<template>
  <div class="station-list-container">
    <!-- 顶部搜索栏 -->
    <el-header class="header">
      <div class="header-content">
        <div class="search-box">
          <el-input v-model="searchKeyword" size="default" placeholder="请输入救助站名称" clearable>
            <template #append>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="main-content">
      <div class="station-list">
        <el-card
          v-for="station in filteredStationList"
          :key="station.rescue_station_id"
          class="station-card"
          @click="handleStationSelect(station)">
          <template #header>
            <div class="card-header">
              <h3>{{ station.rescue_station_name }}</h3>
              <el-tag type="success">可选择</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="station-info">
              <el-icon class="info-icon"><Location /></el-icon>
              <span>{{ station.position }}</span>
            </div>
          </div>
          <template #footer>
            <div class="card-footer">
              <el-button type="primary" size="small">选择此救助站</el-button>
            </div>
          </template>
        </el-card>

        <!-- 无数据状态 -->
        <div v-if="filteredStationList.length === 0" class="empty-state">
          <el-empty description="未找到匹配的救助站" />
        </div>
      </div>
    </el-main>
  </div>
</template>
<style lang="less" scoped>
  .station-list-container {
    display: flex;
    flex-direction: column;

    .header {
      background-color: #409eff;
      color: white;
      padding: 0 20px;
      display: flex;
      align-items: center;
      height: 60px;

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;

        .search-box {
          width: 300px;
        }
      }
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: transparent;

      .station-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;

        .station-card {
          cursor: pointer;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .card-content {
            padding: 15px 0;

            .station-info {
              display: flex;
              align-items: center;
              gap: 8px;
              color: #606266;
            }
          }

          .card-footer {
            display: flex;
            justify-content: flex-end;
          }
        }

        .empty-state {
          padding: 50px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
