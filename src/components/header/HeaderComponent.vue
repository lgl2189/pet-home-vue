<script setup></script>
<template>
  <div class="header">
    <div class="title">
      宠物之家
    </div>
    <div class="navigator">
      <el-menu class="navigator-menu" mode="horizontal">
        <el-sub-menu index="1">
          <template #title>动物</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="1-1">动物列表</el-menu-item>
          <el-menu-item index="1-2">动物详情</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>救助</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="2-1">救助流程</el-menu-item>
          <el-menu-item index="2-2">救助案例</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>领养</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="3-1">可领养动物</el-menu-item>
          <el-menu-item index="3-2">领养申请</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>志愿者</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="4-1">志愿者招募</el-menu-item>
          <el-menu-item index="4-2">志愿者活动</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>捐赠</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="5-1">捐赠方式</el-menu-item>
          <el-menu-item index="5-2">捐赠记录</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6">
          <template #title>展示</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="6-1">图片展示</el-menu-item>
          <el-menu-item index="6-2">视频展示</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="7">
          <template #title>数据</template>
          <!-- 这里可以添加子菜单选项 -->
          <el-menu-item index="7-1">统计数据</el-menu-item>
          <el-menu-item index="7-2">数据报表</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="user">
    </div>
  </div>
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  width: 100%;
  background-color: #FFFFFF;
  color: #000000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 10px;

  .title {
    font-size: 24px;
    color: #00AEEC;
    margin-right: 20px;
  }

  .navigator {}

  .user {}

}
</style>
