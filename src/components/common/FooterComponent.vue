<script setup>
  // 可以在此处添加响应式数据或props
  const currentYear = new Date().getFullYear()
  const companyName = 'Your Company'
</script>

<template>
  <div class="footer">
    <p class="copyright">© {{ currentYear }} {{ companyName }}. All rights reserved.</p>
  </div>
</template>

<style lang="less" scoped>
  .footer {
    background-color: transparent;
    color: #000000;
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .copyright {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.5px;
      opacity: 0.8;
    }
  }
</style>
