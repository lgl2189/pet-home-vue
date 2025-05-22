<script setup>
  import { computed, ref, watch } from 'vue'

  const props = defineProps({
    // 总页数
    totalPages: { type: Number, required: true },
    // 当前页码前面或后面显示的页码数，即单侧显示的页码数
    displayRange: { type: Number, default: 2 },
    // 当前页码，v-model双向绑定
    modelValue: { type: Number, required: true }
  })

  const emit = defineEmits(['update:modelValue'])

  const currentPage = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const inputPage = ref('')

  // 生成页码数组
  const pages = computed(() => {
    const range = props.displayRange
    const total = props.totalPages
    const current = currentPage.value
    const pages = [1]

    let start = Math.max(2, current - range)
    let end = Math.min(total - 1, current + range)

    // 处理左边界
    if (current - 1 <= range) {
      end = Math.min(total - 1, 1 + range * 2)
    }

    // 处理右边界
    if (total - current <= range) {
      start = Math.max(2, total - range * 2)
    }

    // 添加左省略号
    if (start > 2) {
      pages.push('...')
    }

    // 添加中间页码
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // 添加右省略号
    if (end < total - 1) {
      pages.push('...')
    }

    // 添加最后一页
    if (total > 1) {
      pages.push(total)
    }

    return pages
  })

  // 处理页码点击
  const handlePageChange = (page) => {
    if (page !== '...' && page !== currentPage.value) {
      currentPage.value = page
    }
  }

  // 处理跳转
  const handleJump = () => {
    const page = Math.min(Math.max(1, parseInt(inputPage.value)), props.totalPages)
    if (!isNaN(page)) {
      currentPage.value = page
      inputPage.value = ''
    }
  }
</script>

<template>
  <div class="pagination-container">
    <!-- 页码部分 -->
    <div class="pagination">
      <button
        v-for="(page, index) in pages"
        :key="index"
        class="page-item"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="handlePageChange(page)">
        {{ page }}
      </button>
    </div>

    <!-- 跳转部分 -->
    <div class="page-jump">
      <input v-model.number="inputPage" type="number" min="1" :max="totalPages" @keyup.enter="handleJump" />
      <button @click="handleJump">跳转</button>
    </div>
  </div>
</template>

<style lang="less">
  .pagination-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    align-items: center;
  }

  .pagination {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;

    .page-item {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(.active):not(.ellipsis) {
        background: #f0f0f0;
      }

      &.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }

      &.ellipsis {
        cursor: default;
        border: none;
        background: none;
      }
    }
  }

  .page-jump {
    display: flex;
    gap: 8px;

    input {
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 80px;
    }

    button {
      padding: 6px 12px;
      border: 1px solid #007bff;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }
  }
</style>
