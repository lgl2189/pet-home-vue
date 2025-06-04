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
            <el-sub-menu index="/rescue/station/adopt">
              <template #title>领养管理</template>
              <el-menu-item
                index="/rescue/station/adopt/review"
                :route="{ name: 'StationAdoptReviewView', query: { id: stationId, name: stationName } }">
                领养申请审核
              </el-menu-item>
              <el-menu-item
                index="/rescue/station/adopt/blacklist"
                :route="{ name: 'StationAdoptBlacklistView', query: { id: stationId, name: stationName } }">
                黑名单管理
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
    height: 100vh;
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
