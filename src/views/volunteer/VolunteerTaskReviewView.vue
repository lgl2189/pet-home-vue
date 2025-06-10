<script setup>
  import { ref, onBeforeMount, watch } from 'vue'
  import { getVolunteerTaskRecordListByStationId, updateVolunteerTaskRecordStatus } from '@/apis/volunteer'
  import { getStatusLabel } from '@/utils/enum'
  import { VOLUNTEER_TASK_RECORD_STATUS } from '@/utils/constant'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const recordList = ref([])
  const currentPage = ref(1)
  const pageSize = ref(5)
  const total = ref(0)

  // 监听器
  watch(pageSize, (newSize) => {
    pageSize.value = newSize
    handleGetRecordList()
  })

  watch(currentPage, (newPage) => {
    currentPage.value = newPage
    handleGetRecordList()
  })

  // 函数
  const handleGetRecordList = async () => {
    try {
      const res = await getVolunteerTaskRecordListByStationId(route.query.id, currentPage.value, pageSize.value)
      if (res.status === '200') {
        recordList.value = res.data.record_list
        total.value = res.data.page_info.record_num
      } else {
        ElMessage.error('获取记录列表失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('网络错误，请稍后重试')
    }
  }

  const handleChangeStatus = async (recordId, status) => {
    const res = await updateVolunteerTaskRecordStatus(recordId, status)
    if (res.status === '200') {
      ElMessage.success('状态更新成功')
      handleGetRecordList()
    }
  }

  // 生命周期
  onBeforeMount(() => {
    // 默认加载示例数据
    handleGetRecordList()
  })
</script>
<template>
  <div class="record-list-container">
    <el-card class="box-card">
      <el-table :data="recordList" stripe style="width: 100%" size="default">
        <el-table-column prop="record_id" label="记录ID"></el-table-column>
        <el-table-column prop="task_id" label="任务ID"></el-table-column>
        <el-table-column prop="user_id" label="用户ID"></el-table-column>
        <el-table-column prop="is_sign_in" label="是否签到">
          <template #default="scope">
            {{ scope.row.is_sign_in ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="task_prove_list.file_url" label="任务证明文件">
          <template #default="scope">
            <el-carousel arrow="always" :interval="0" height="200px" direction="vertical">
              <el-carousel-item v-for="(file, index) in scope.row.task_prove_list" :key="index">
                <img :src="file.file_url" alt="证明文件" style="max-height: 200px" />
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-table-column>
        <el-table-column prop="task_record_status" label="任务记录状态">
          <template #default="scope">
            {{ getStatusLabel(VOLUNTEER_TASK_RECORD_STATUS, scope.row.task_record_status) }}
          </template>
        </el-table-column>
        <el-table-column label="修改状态">
          <template #default="scope">
            <el-select v-model="scope.row.task_record_status">
              <el-option
                v-for="status in VOLUNTEER_TASK_RECORD_STATUS"
                :key="status.value"
                :label="status.label"
                :value="status.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="default" @click="handleChangeStatus(scope.row.record_id, scope.row.task_record_status)">
              保存
            </el-button>
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
  .record-list-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

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
