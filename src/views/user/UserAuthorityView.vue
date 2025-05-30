<script setup>
  import { ref } from 'vue'

  // Mock 角色数据（需替换为实际请求）
  const roles = ref([
    { role_id: 1, role_name: '超级管理员' },
    { role_id: 2, role_name: '救助站管理员' },
    { role_id: 3, role_name: '志愿者' },
    { role_id: 4, role_name: '领养者' },
    { role_id: 5, role_name: '捐赠者' },
    { role_id: 6, role_name: '普通用户' }
  ])

  // Mock 用户当前角色（需从数据库 user_role 表获取）
  const userRoles = ref([2, 3]) // 假设用户同时拥有管理员和志愿者角色
  const selectedRoles = ref(userRoles.value)

  // 保存权限修改（调用 mock 接口）
  const saveRoles = () => {
    console.log('保存角色:', selectedRoles.value)
    // 此处添加保存逻辑（更新 user_role 表）
  }
</script>
<template>
  <div class="authority-page">
    <h2 class="page-title">权限管理</h2>
    <div class="role-list">
      <div v-for="role in roles" :key="role.role_id" class="role-item">
        <input type="checkbox" :id="`role-${role.role_id}`" v-model="selectedRoles" :value="role.role_id" />
        <label :for="`role-${role.role_id}`">{{ role.role_name }}</label>
      </div>
    </div>
    <button @click="saveRoles">保存权限</button>
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
