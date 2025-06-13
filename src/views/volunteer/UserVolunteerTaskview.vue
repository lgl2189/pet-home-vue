<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getVolunteerTaskRecordByUserId } from '@/apis/volunteer'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const userStore = useUserStore()
  const taskRecords = ref([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  const fetchTaskRecords = async () => {
    const res = await getVolunteerTaskRecordByUserId(userStore.userId, currentPage.value, pageSize.value)
    if (res.status === '200') {
      taskRecords.value = res.data.record_list
      total.value = res.data.page_info.record_num
    }
  }

  const handleSizeChange = (newSize) => {
    pageSize.value = newSize
    fetchTaskRecords()
  }

  const handleCurrentChange = (newPage) => {
    currentPage.value = newPage
    fetchTaskRecords()
  }

  const handleClickSubmitBtn = (recordId) => {
    router.push({ name: 'UserVolunteerTaskSubmitView', params: { recordId: recordId } })
  }

  onMounted(() => {
    fetchTaskRecords()
  })
</script>
<template>
  <div class="my-volunteer-tasks-container">
    <el-card class="box-card">
      <el-table :data="taskRecords" stripe>
        <el-table-column prop="record_id" label="记录ID"></el-table-column>
        <el-table-column prop="task_id" label="任务ID"></el-table-column>
        <el-table-column prop="rescue_station_id" label="救助站ID"></el-table-column>
        <el-table-column prop="is_sign_in" label="是否签到">
          <template #default="scope">
            {{ scope.row.is_sign_in ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="task_record_status" label="任务状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleClickSubmitBtn(scope.row.record_id)">提交完成证明</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
  .my-volunteer-tasks-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .box-card {
      margin-top: 20px;
    }
  }
</style>
