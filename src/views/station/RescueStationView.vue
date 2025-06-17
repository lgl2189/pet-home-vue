<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  // 响应式变量
  const route = useRoute()

  //计算属性
  const stationId = computed(() => route.query.id)
  const stationName = computed(() => route.query.name)
</script>
<template>
  <div class="container">
    <el-container>
      <el-aside width="220px" class="aside">
        <div class="menu">
          <h4 class="menu-title">救助站管理</h4>
          <h5 class="menu-title-tip">{{ stationName }} (id: {{ stationId }})</h5>
          <el-menu :router="true" :default-active="$route.meta.activePath || $route.path">
            <el-sub-menu index="/station/adopt">
              <template #title>领养管理</template>
              <el-menu-item
                index="/station/adopt/review"
                :route="{ name: 'StationAdoptReviewView', query: { id: stationId, name: stationName } }">
                领养申请审核
              </el-menu-item>
              <el-menu-item
                index="/station/adopt/blacklist"
                :route="{ name: 'StationAdoptBlacklistView', query: { id: stationId, name: stationName } }">
                黑名单管理
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/station/volunteer">
              <template #title>志愿者管理</template>
              <el-menu-item
                index="/station/volunteer/task/publish"
                :route="{ name: 'VolunteerTaskPublishView', query: { id: stationId, name: stationName } }">
                发布任务
              </el-menu-item>
              <el-menu-item
                index="/station/volunteer/task/list"
                :route="{ name: 'VolunteerTaskListView', query: { id: stationId, name: stationName } }">
                管理任务
              </el-menu-item>
              <el-menu-item
                index="/station/volunteer/task/review"
                :route="{ name: 'VolunteerTaskReviewView', query: { id: stationId, name: stationName } }">
                任务完成审核
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/station/donation">
              <template #title>捐赠管理</template>
              <el-menu-item
                index="/station/donation/receive"
                :route="{ name: 'StationDonationReceiveView', query: { id: stationId, name: stationName } }">
                收款方式管理
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/station/material">
              <template #title>物资管理</template>
              <el-menu-item
                index="/station/material/inventory/manage"
                :route="{ name: 'InventoryManagementView', query: { id: stationId, name: stationName } }">
                库存管理
              </el-menu-item>
              <el-menu-item
                index="/station/material/demand/manage"
                :route="{ name: 'MaterialDemandManagementView', query: { id: stationId, name: stationName } }">
                需求管理
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
  .container {
    background-color: #ffffff;
    padding: 24px;
    .aside {
      .menu {
        .menu-title {
          color: #606266;
          height: 40px;
          line-height: 40px;
          margin-left: 10px;
          font-size: 20px;
        }
        .menu-title-tip {
          color: #606266;
          height: 40px;
          line-height: 40px;
          margin-left: 14px;
          font-size: 16px;
        }
      }
    }
  }
</style>
