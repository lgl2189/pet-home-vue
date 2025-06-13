<script setup>
  import { ref, onBeforeMount, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { searchVolunteerTaskList, getAllVolunteerTaskList, acceptVolunteerTask } from '@/apis/volunteer'
  import { decodeSpecialChars, isEmpty, isSpaceStr } from '@/utils/stringUtil'
  import { VOLUNTEER_TASK_RECORD_STATUS, VOLUNTEER_TASK_STATUS } from '@/utils/constant'
  import { useUserStore } from '@/stores/user'

  // 响应式对象
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const volunteerTaskSearchValue = ref('')
  const volunteerTaskList = ref([])
  const pageInfo = ref({
    // 当前页序号
    page_num_now: 1,
    // 总页数
    page_num_total: 1,
    // 当前页的记录数
    page_size_now: 1,
    // 每页的记录数
    page_size: 10,
    // 总记录数
    record_num: 1
  })

  // 函数
  const updateData = async () => {
    let keyword = route.query.keyword
    let pageNum = pageInfo.value.page_num_now
    const pageSize = pageInfo.value.page_size

    // 请求参数合法性校验
    if (isSpaceStr(keyword)) {
      keyword = ''
    }
    // 检查pageNum和pageSize是否同时存在或者同时不存在
    if (isEmpty(pageNum) !== isEmpty(pageSize)) {
      pageNum = 1
      pageSize = 20
    }
    // 检查pageNum是否合法
    if (pageNum < 0) {
      pageNum = 1
    }
    if (pageNum > pageInfo.value.page_num_total && pageInfo.value.page_num_total !== 0) {
      pageNum = pageInfo.value.page_num_total
    }
    keyword = keyword.trim()
    keyword = decodeSpecialChars(keyword)

    // 如果keyword为空，获取全部列表
    if (keyword === '') {
      await handleGetAllVolunteerTasks(pageNum, pageSize)
    } else {
      // 请求参数合法，进行搜索
      await handleSearchVolunteerTasks(keyword, pageNum, pageSize)
    }
  }

  const handleSearchVolunteerTasks = async (keyword, pageNum, pageSize) => {
    const res = await searchVolunteerTaskList(keyword, pageNum, pageSize)
    if (res.status === '200') {
      volunteerTaskList.value = res.data.task_list
      pageInfo.value = res.data.page_info
    }
  }

  const handleGetAllVolunteerTasks = async (pageNum, pageSize) => {
    const res = await getAllVolunteerTaskList(pageNum, pageSize)
    if (res.status === '200') {
      volunteerTaskList.value = res.data.task_list
      pageInfo.value = res.data.page_info
    }
  }

  const handlePageNumChange = (newPageNum) => {
    pageInfo.value.page_num_now = newPageNum
    router.push({
      query: {
        ...route.query,
        pageNum: newPageNum,
        pageSize: pageInfo.value.page_size
      }
    })
  }

  const handlePageSizeChange = (newPageSize) => {
    pageInfo.value.page_size = newPageSize
    router.push({
      query: {
        ...route.query,
        pageNum: 1,
        pageSize: newPageSize
      }
    })
  }

  const handleClickSearchBtn = () => {
    if (volunteerTaskList.value === null) {
      volunteerTaskList.value = ''
    }
    let inputStr = volunteerTaskSearchValue.value.trim()
    router.push({
      query: {
        keyword: inputStr,
        pageNum: 1,
        pageSize: pageInfo.value.page_size
      }
    })
  }

  const handleClickAcceptTaskBtn = async (taskId) => {
    // 接受任务
    const res = await acceptVolunteerTask(taskId, userStore.userId)
    if (res.status === '200') {
      ElMessage.success('接受任务成功')
    } else {
      ElMessage.error('接受任务失败')
    }
  }

  // 生命周期函数
  onBeforeMount(async () => {
    await updateData()
  })

  // watch监听器
  watch(
    () => route.query,
    async (oldQuery, newQuery) => {
      if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
        await updateData()
      }
    }
  )
</script>
<template>
  <div class="container">
    <div class="volunteer-task-table">
      <div class="table-header">
        <div class="search-box">
          <div class="search-input-box">
            <el-input
              size="default"
              v-model="volunteerTaskSearchValue"
              placeholder="请输入搜索关键字"
              @keyup.enter="handleClickSearchBtn"></el-input>
            <el-button class="search-btn" :round="true" color="#00aeec" @click="handleClickSearchBtn">
              <el-icon class="search-btn-icon">
                <Search></Search>
              </el-icon>
              <span>搜索</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="table-body">
        <el-table :data="volunteerTaskList" stripe>
          <el-table-column prop="task_id" label="任务ID"></el-table-column>
          <el-table-column prop="rescue_station_id" label="救助站ID"></el-table-column>
          <el-table-column prop="task_datetime" label="任务时间"></el-table-column>
          <el-table-column prop="task_position" label="任务地点"></el-table-column>
          <el-table-column prop="task_content" label="任务内容"></el-table-column>
          <el-table-column prop="task_status" label="任务状态"></el-table-column>
          <el-table-column prop="task_duration" label="任务时长"></el-table-column>
          <el-table-column prop="task_point" label="任务积分"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="default" @click="handleClickAcceptTaskBtn(scope.row.task_id)">接受任务</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-footer">
        <el-pagination
          v-model:current-page="pageInfo.page_num_now"
          :page-sizes="[10, 20, 30]"
          :page-size="pageInfo.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.record_num"
          @size-change="handlePageSizeChange"
          @current-change="handlePageNumChange"></el-pagination>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f4f9;
    .volunteer-task-table {
      background-color: white;
      width: 90%;
      box-sizing: border-box;
      padding: 0 40px 0 40px;
      .table-header {
        width: 100%;
        margin-top: 20px;
        .search-box {
          height: 50px;
          margin: 0 auto;
          width: 70%;
          .search-input-box {
            height: 100%;
            border-radius: 10px;
            display: flex;
            align-items: center;
            &:hover {
              background-color: #ffffff;
            }
            .search-btn {
              color: white;
              font-size: 15px;
              height: 80%;
              width: 15%;
              flex-grow: 0;
              margin-right: 15px;
              border-radius: 10px;
            }
            .search-btn-icon {
              margin-right: 3px;
            }
          }
        }
      }
      .table-body {
        box-sizing: border-box;
        width: 100%;
        margin: 20px 0;
      }
      .table-footer {
        box-sizing: border-box;
        width: 100%;
        margin: 20px 0;
      }
    }
  }
</style>
