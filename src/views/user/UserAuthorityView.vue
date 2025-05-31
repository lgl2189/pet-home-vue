<script setup>
  import { getRoleList } from '@/apis/role'
  import { getUserRoleList, updateUserRoleList } from '@/apis/user'
  import { useUserStore } from '@/stores/user'
  import { onBeforeMount, ref } from 'vue'

  // 响应式变量
  const userStore = useUserStore()
  const roleList = ref([])
  const selectedRoleList = ref()

  // 函数
  const handleGetRoleList = async () => {
    const res = await getRoleList()
    if (res.status === '200') {
      roleList.value = res.data.role_list
      roleList.value = roleList.value.filter((item) => item.role_tag !== 'normal')
    }
  }
  const handleGetUserRoleList = async () => {
    const res = await getUserRoleList(userStore.userId)
    if (res.status === '200') {
      selectedRoleList.value = res.data.role_list.map((role) => role.role_tag)
    }
  }
  const handleUpdateUserRoleList = async () => {
    const res = await updateUserRoleList(userStore.userId, selectedRoleList.value)
    if (res.status === '200') {
      ElMessage.success('权限修改成功')
    } else {
      ElMessage.error('权限修改失败，原因：' + res.message)
    }
  }
  const saveRoleList = async () => {
    await handleUpdateUserRoleList()
  }
  // 生命周期函数
  onBeforeMount(async () => {
    await handleGetRoleList()
    await handleGetUserRoleList()
  })
</script>
<template>
  <div class="authority-page">
    <h2 class="page-title">权限管理</h2>
    <div class="role-list">
      <div v-for="role in roleList" :key="role.role_id" class="role-item">
        <input type="checkbox" :id="`role-${role.role_id}`" v-model="selectedRoleList" :value="role.role_tag" />
        <label :for="`role-${role.role_id}`">{{ role.role_name }}</label>
      </div>
    </div>
    <button @click="saveRoleList">保存权限</button>
  </div>
</template>
<style lang="less" scoped>
  .authority-page {
    .role-list {
      margin-top: 16px;
      font-size: 14px;

      .role-item {
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        input {
          margin-right: 8px;
        }
      }
    }

    button {
      margin-top: 24px;
      padding: 8px 24px;
      background: #409eff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
</style>
