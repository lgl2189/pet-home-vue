<script setup>
  import { ref, onBeforeMount, watch } from 'vue'
  import { getAllSupplyDemandList } from '@/apis/donation'
  import { getStatusLabel } from '@/utils/enum'
  import { SUPPLY_DEMAND_STATUS } from '@/utils/constant'

  // 响应式对象
  const taskList = ref([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  // 监听器
  watch(pageSize, (newSize) => {
    pageSize.value = newSize
    handleGetDemandList()
  })

  watch(currentPage, async (newPage) => {
    currentPage.value = newPage
    await handleGetDemandList()
  })

  // 函数
  const handleGetDemandList = async () => {
    try {
      const res = await getAllSupplyDemandList(currentPage.value, pageSize.value)
      if (res.status === '200') {
        taskList.value = res.data.demand_list
        total.value = res.data.page_info.record_num
      } else {
        ElMessage.error('获取需求列表失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('网络错误，请稍后重试')
    }
  }

  // 生命周期
  onBeforeMount(async () => {
    await handleGetDemandList()
  })
</script>
<template>
  <div class="supply-demand-list-container">
    <el-card class="box-card">
      <el-table :data="taskList" stripe style="width: 100%">
        <el-table-column prop="rescue_station_id" label="救助站ID"></el-table-column>
        <el-table-column prop="supply_name" label="物资名称"></el-table-column>
        <el-table-column prop="demand_quantity" label="需求数量"></el-table-column>
        <el-table-column prop="demand_status" label="需求状态">
          <template #default="scope">
            {{ getStatusLabel(SUPPLY_DEMAND_STATUS, scope.row.demand_status) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" />
    </el-card>
  </div>
</template>
<style lang="less" scoped>
  .supply-demand-list-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .filter-container {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .task-content-preview {
      cursor: pointer;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .task-detail-content {
      white-space: pre-wrap;
      line-height: 1.8;
    }
  }
</style>
