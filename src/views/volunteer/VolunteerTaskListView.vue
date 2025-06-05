<script setup>
  import { ref, onBeforeMount, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { getVolunteerTasksByRescueStationId } from '@/apis/volunteer'
  import { getStatusLabel } from '@/utils/enum'
  import { VOLUNTEER_TASK_STATUS } from '@/utils/constant'

  // 响应式对象
  const route = useRoute()
  const searchRescueStationId = ref(route.query.id)
  const taskList = ref([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const dialogVisible = ref(false)
  const dialogContent = ref('')

  // 函数
  const handleGetTaskList = async () => {
    if (!searchRescueStationId.value) {
      ElMessage.warning('请输入救助站ID')
      return
    }
    try {
      const res = await getVolunteerTasksByRescueStationId(
        searchRescueStationId.value,
        currentPage.value,
        pageSize.value
      )
      if (res.status === '200') {
        taskList.value = res.data.task_list
        total.value = res.data.page_info.record_num
      } else {
        ElMessage.error('获取任务列表失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('网络错误，请稍后重试')
    }
  }

  // 监听器
  watch(pageSize, (newSize) => {
    pageSize.value = newSize
    handleGetTaskList()
  })

  watch(currentPage, (newPage) => {
    currentPage.value = newPage
    handleGetTaskList()
  })

  const formatDateTime = (datetime) => {
    if (!datetime) return ''
    return datetime.replace('T', ' ')
  }

  const formatDuration = (duration) => {
    if (!duration) return ''
    const [hours, minutes, seconds] = duration.split(':')
    return `${hours}小时${minutes}分钟${seconds}秒`
  }

  const showTaskDetail = (content) => {
    dialogContent.value = content
    dialogVisible.value = true
  }

  // 生命周期
  onBeforeMount(() => {
    // 默认加载示例数据
    handleGetTaskList()
  })
</script>
<template>
  <div class="task-list-container">
    <el-card class="box-card">
      <el-table :data="taskList" stripe style="width: 100%">
        <el-table-column prop="task_id" label="任务ID"></el-table-column>
        <el-table-column prop="rescue_station_id" label="救助站ID"></el-table-column>
        <el-table-column prop="task_datetime" label="任务日期时间">
          <template #default="scope">
            {{ formatDateTime(scope.row.task_datetime) }}
          </template>
        </el-table-column>
        <el-table-column prop="task_position" label="任务地点"></el-table-column>
        <el-table-column prop="task_content" label="任务内容">
          <template #default="scope">
            <el-tooltip content="点击查看详情" effect="dark">
              <div class="task-content-preview" @click="showTaskDetail(scope.row.task_content)">
                {{ scope.row.task_content.substring(0, 20) }}{{ scope.row.task_content.length > 20 ? '...' : '' }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="task_status" label="任务状态">
          <template #default="scope">
            {{ getStatusLabel(VOLUNTEER_TASK_STATUS, scope.row.task_status) }}
          </template>
        </el-table-column>
        <el-table-column prop="task_duration" label="任务时长">
          <template #default="scope">
            {{ formatDuration(scope.row.task_duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="task_point" label="任务积分"></el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" />
    </el-card>
  </div>

  <!-- 任务详情对话框 -->
  <el-dialog v-model="dialogVisible" title="任务详情">
    <template #default>
      <div class="task-detail-content">{{ dialogContent }}</div>
    </template>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
<style lang="less" scoped>
  .task-list-container {
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
