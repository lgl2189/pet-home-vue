<script setup>
  import { getInventoryChangeList, getInventoryList } from '@/apis/donation'
  import { getRescueStationInfoById } from '@/apis/rescue'
  import { ref, onBeforeMount } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const rescueStationId = route.query.id
  const rescueStationInfo = ref({})
  const inventoryList = ref([])
  const inventoryChangeRecords = ref([])
  const loading = ref(false)

  const inventoryPageInfo = ref({
    pageSize: 10,
    currentPageNum: 1,
    total: 0
  })

  const inventoryChangePageInfo = ref({
    pageSize: 10,
    currentPageNum: 1,
    total: 0
  })

  // 函数
  // 模拟API请求函数
  const fetchRescueStationInfo = async (rescueStationId) => {
    const res = await getRescueStationInfoById(rescueStationId)
    if (res.status === '200') {
      rescueStationInfo.value = res.data.station_info
    } else {
      ElMessage.error(res.message ?? '获取救助站信息失败')
    }
  }

  const fetchInventoryList = async (stationId, pageNum, pageSize) => {
    const res = await getInventoryList(stationId, pageNum, pageSize)
    if (res.status === '200') {
      inventoryList.value = res.data.inventory_list
      inventoryPageInfo.value.pageNum = res.data.page_info.page_num_now
      inventoryPageInfo.value.pageSize = res.data.page_info.page_size
      inventoryPageInfo.value.total = res.data.page_info.record_num
    } else {
      ElMessage.error(res.message ?? '获取库存信息失败')
    }
  }

  const fetchInventoryChangeRecords = async (stationId, pageNum, pageSize) => {
    const res = await getInventoryChangeList(stationId, pageNum, pageSize)
    if (res.status === '200') {
      inventoryChangeRecords.value = res.data.change_record_list
      inventoryChangePageInfo.value.pageNum = res.data.page_info.page_num_now
      inventoryChangePageInfo.value.pageSize = res.data.page_info.page_size
      inventoryChangePageInfo.value.total = res.data.page_info.record_num
    }
  }

  // 获取救助站详情数据
  const getRescueStationDetail = async () => {
    if (!rescueStationId) {
      ElMessage.error('未获取到救助站ID')
      return
    }

    loading.value = true
    try {
      // 应改为并行请求数据
      await fetchRescueStationInfo(rescueStationId)
      await fetchInventoryList(rescueStationId, 1, 10)
      await fetchInventoryChangeRecords(rescueStationId, 1, 10)
    } finally {
      loading.value = false
    }
  }

  // 格式化变动类型显示
  const formatChangeType = (type) => {
    return type === 'in' ? '入库' : '出库'
  }

  // 格式化日期时间
  const formatDateTime = (dateTime) => {
    return dateTime ? new Date(dateTime).toLocaleString() : '-'
  }

  // 生命周期函数
  onBeforeMount(async () => {
    await getRescueStationDetail()
  })
</script>

<template>
  <div class="rescue-station-detail">
    <el-card class="mb-4" shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">救助站信息</h3>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-descriptions :column="2" title="基本信息" border>
            <el-descriptions-item label="救助站ID">
              {{ rescueStationInfo.rescue_station_id || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="救助站名称">
              {{ rescueStationInfo.rescue_station_name || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="位置">{{ rescueStationInfo.position || '-' }}</el-descriptions-item>
            <el-descriptions-item label="管理员ID">{{ rescueStationInfo.admin_user_id || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="12">
          <div
            class="payment-qrcode-wrapper"
            v-for="(image_url, index) in rescueStationInfo.payment_qrcode_url_list"
            :key="index">
            <el-image
              v-if="rescueStationInfo.payment_qrcode_gid"
              :src="image_url"
              alt="支付二维码"
              style="width: 130px; height: 130px"
              fit="fill" />
            <div v-else class="text-gray-500">暂无支付二维码</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="mb-4" shadow="hover">
      <template #header>
        <h3 class="font-bold text-lg">物资库存信息</h3>
      </template>

      <el-table :data="inventoryList" border stripe :loading="loading" empty-text="暂无库存数据">
        <el-table-column prop="inventory_id" label="库存ID" width="120"></el-table-column>
        <el-table-column prop="supply_name" label="物资名称" width="150"></el-table-column>
        <el-table-column prop="inventory_quantity" label="库存数量" width="120"></el-table-column>
        <el-table-column prop="warning_quantity" label="预警数量" width="120"></el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.inventory_quantity <= scope.row.warning_quantity ? 'danger' : 'success'">
              {{ scope.row.inventory_quantity <= scope.row.warning_quantity ? '库存不足' : '库存充足' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editInventory(scope.row)">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination
        class="pagination-wrapper"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 30]"
        v-model:current-page="inventoryPageInfo.currentPageNum"
        v-model:page-size="inventoryPageInfo.pageSize"
        :total="inventoryPageInfo.total"></el-pagination>
    </el-card>

    <el-card shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-lg">物资变动记录</h3>
        </div>
      </template>

      <el-table :data="inventoryChangeRecords" border stripe :loading="loading" empty-text="暂无变动记录">
        <el-table-column prop="change_record_id" label="记录ID" width="120"></el-table-column>
        <el-table-column prop="supply_name" label="物资名称" width="150"></el-table-column>
        <el-table-column prop="purpose" label="变动原因" width="180"></el-table-column>
        <el-table-column prop="change_num" label="变动数量" width="120"></el-table-column>
        <el-table-column prop="change_type" label="变动类型" width="100">
          <template #default="scope">
            {{ formatChangeType(scope.row.change_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="change_datetime" label="变动时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.change_datetime) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="donation_id" label="捐赠ID" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="primary" @click="viewRecordDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination
        class="pagination-wrapper"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 30]"
        v-model:current-page="inventoryChangePageInfo.currentPageNum"
        v-model:page-size="inventoryChangePageInfo.pageSize"
        :total="inventoryChangePageInfo.total"></el-pagination>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
  .rescue-station-detail {
    padding: 20px;

    .mb-4 {
      margin-bottom: 20px;
    }

    .el-descriptions {
      width: 100%;

      .el-descriptions-item__content {
        word-break: break-all;
      }
    }

    .el-table {
      .cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .pagination-wrapper {
      margin-top: 10px;
    }

    .payment-qrcode-wrapper {
      display: inline-block;
      padding: 10px;
      border-right: solid 1px var(--el-border-color);
    }
  }
</style>
