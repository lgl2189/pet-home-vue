<script setup>
  import { ref, onMounted, computed, defineProps, toRefs } from 'vue'

  const props = defineProps({
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    minItemWidth: {
      type: Number,
      default: 180
    },
    gap: {
      type: Number,
      default: 20
    },
    maxColumn: {
      type: Number,
      default: 0 // 0 表示不限制
    }
  })

  const { minItemWidth, gap, maxColumn } = toRefs(props)
  const gridRef = ref(null)

  // 工具函数
  const formatValue = (value) => {
    return new Intl.NumberFormat('zh-CN').format(value)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN')
  }

  onMounted(() => {
    const updateLayout = () => {
      const grid = gridRef.value
      if (!grid) return

      const items = [...grid.children]
      const gridWidth = grid.offsetWidth

      // 计算列数（基于minItemWidth最小值）
      let columnCount = Math.floor((gridWidth + gap.value) / (minItemWidth.value + gap.value))
      columnCount = Math.max(1, columnCount)
      if (maxColumn.value > 0) columnCount = Math.min(columnCount, maxColumn.value)

      // 计算实际列宽（可能大于minItemWidth）
      const actualItemWidth = (gridWidth - (columnCount - 1) * gap.value) / columnCount

      // 初始化布局参数
      const columnsHeight = new Array(columnCount).fill(0)
      const gapX = gap.value
      const gapY = gap.value

      items.forEach((item) => {
        // 移除之前的定位样式
        item.style.position = ''
        item.style.left = ''
        item.style.top = ''

        // 强制同步布局计算
        void item.offsetHeight

        // 找到最短列
        const minHeight = Math.min(...columnsHeight)
        const columnIndex = columnsHeight.indexOf(minHeight)

        // 设置动态宽度和位置
        item.style.position = 'absolute'
        item.style.left = `${columnIndex * (actualItemWidth + gapX)}px` // 动态计算
        item.style.top = `${columnsHeight[columnIndex]}px`
        item.style.width = `${actualItemWidth}px` // 动态宽度

        // 更新列高度
        columnsHeight[columnIndex] += item.offsetHeight + gapY
      })

      // 设置容器高度
      grid.style.height = `${Math.max(...columnsHeight) - gapY}px`
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
  })
</script>

<template>
  <div class="data-grid" ref="gridRef">
    <div v-for="item in items" :key="item.id" class="grid-item">
      <slot name="item" :item="item">
        <!-- 默认内容 -->
        <div class="item-card">
          <div class="card-header">
            <span class="item-id">#{{ item.id }}</span>
            <div class="item-icon">
              <i class="fa fa-cube"></i>
            </div>
          </div>
          <h3 class="item-title">{{ item.name }}</h3>
          <p class="item-value">{{ formatValue(item.value) }}</p>
          <div class="card-footer">
            <span class="item-date">{{ formatDate(item.updatedAt || new Date()) }}</span>
            <button class="item-detail">
              <i class="fa fa-info-circle"></i>
              详情
            </button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .data-grid {
    width: 100%;
    position: relative;
    transition: all 0.3s ease;

    .grid-item {
      transition: all 0.2s ease;

      // 鼠标悬停效果
      &:hover {
        transform: translateY(-3px);
      }

      // 默认卡片样式
      .item-card {
        background-color: white;
        border-radius: 0.75rem;
        padding: 1rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.05);

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          .item-id {
            font-size: 0.75rem;
            color: #64748b;
          }

          .item-icon {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background-color: #3b82f6;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .item-value {
          font-size: 0.875rem;
          color: #475569;
          margin-bottom: 1rem;
        }

        .card-footer {
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .item-date {
            font-size: 0.75rem;
            color: #94a3b8;
          }

          .item-detail {
            background: none;
            border: none;
            color: #3b82f6;
            font-size: 0.875rem;
            cursor: pointer;
            transition: color 0.2s ease;

            &:hover {
              color: #2563eb;
            }
          }
        }
      }
    }
  }
</style>
