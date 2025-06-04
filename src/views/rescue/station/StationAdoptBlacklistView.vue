<script setup>
  import { addBlackUser, deleteBlackUser, getBlackListByStationId } from '@/apis/adopt'
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'

  // 响应式变量
  const route = useRoute()
  const blackList = ref([
    {
      user_id: 1,
      rescue_station_id: 1,
      extra_info: ''
    }
  ])
  const newBlackUser = ref({
    user_id: null,
    rescue_station_id: route.query.id,
    extra_info: ''
  })
  const blackListAddDialog = ref(false)
  // 函数
  const handleGetBlackList = async () => {
    const res = await getBlackListByStationId(route.query.id)
    if (res.status === '200') {
      blackList.value = res.data.black_list
    }
  }
  const handleAddBlackUser = async () => {
    const res = await addBlackUser(newBlackUser.value)
    if (res.status === '200') {
      ElMessage.success('添加黑名单成功')
      blackList.value.push(newBlackUser.value)
      blackListAddDialog.value = false
    } else {
      ElMessage.error('添加黑名单失败，请稍后再试')
    }
  }
  const handleDeleteBlackUser = async (blackUserId) => {
    const res = await deleteBlackUser(blackUserId)
    if (res.status === '200') {
      ElMessage.success('移出黑名单成功')
      blackList.value = blackList.value.filter((item) => item.user_id !== blackUserId)
    } else {
      ElMessage.error('移出黑名单失败')
    }
  }
  // 生命周期
  onBeforeMount(async () => {
    await handleGetBlackList()
  })
</script>
<template>
  <div class="container">
    <div class="black-add-btn-wrapper">
      <el-button size="large" :round="true" @click="blackListAddDialog = true">添加</el-button>
    </div>
    <el-dialog v-model="blackListAddDialog" title="添加黑名单" width="500">
      <el-form :model="newBlackUser" label-width="auto" size="default">
        <el-form-item label="用户 ID">
          <el-input v-model="newBlackUser.user_id" placeholder="请输入加入黑名单的用户id"></el-input>
        </el-form-item>
        <el-form-item label="额外文本">
          <el-input v-model="newBlackUser.extra_info" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleAddBlackUser" size="large">添加黑名单</el-button>
        </div>
      </template>
    </el-dialog>
    <div class="black-list-wrapper">
      <el-table :data="blackList" stripe border size="large">
        <el-table-column prop="user_id" label="用户 ID"></el-table-column>
        <el-table-column prop="rescue_station_id" label="提交救助站 ID"></el-table-column>
        <el-table-column prop="extra_info" label="提交信息"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleDeleteBlackUser(scope.row.user_id)">移出黑名单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .container {
    .black-add-btn-wrapper {
      margin-bottom: 15px;
    }
  }
</style>
