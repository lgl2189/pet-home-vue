<script setup>
  import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

  const props = defineProps({
    animal: {
      type: Object,
      required: true,
      default: () => ({
        name: '未知动物',
        age: 0,
        imageUrl: 'https://picsum.photos/400/300',
        description: '暂无介绍',
        type: '其他',
        breed: '未知'
      })
    },
    maxHeight: {
      type: [Number, String],
      default: null
    },
    minHeight: {
      type: [Number, String],
      default: null
    },
    ellipsisDescription: {
      type: Boolean,
      default: true
    }
  })

  const formattedMaxHeight = computed(() =>
    typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  )

  const formattedMinHeight = computed(() =>
    typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  )

  const bodyOverflow = computed(() => (props.ellipsisDescription ? 'hidden' : 'auto'))

  const getTypeClass = (type = '其他') => {
    const typeMap = {
      猫: 'bg-cat',
      狗: 'bg-dog',
      鸟: 'bg-bird',
      鱼: 'bg-fish',
      其他: 'bg-other'
    }
    return typeMap[type] || 'bg-other'
  }

  // 新增动态行数计算逻辑
  const descriptionRef = ref(null)
  const lineClamp = ref(3)
  let observer = null

  const updateLineClamp = () => {
    if (!descriptionRef.value) return

    const style = getComputedStyle(descriptionRef.value)
    const lineHeight = parseFloat(style.lineHeight) || 24 // 默认行高24px
    const maxHeight = parseFloat(style.maxHeight)

    if (maxHeight && lineHeight) {
      const availableLines = Math.max(1, Math.floor(maxHeight / lineHeight))
      lineClamp.value = availableLines
    }
  }

  onMounted(() => {
    observer = new ResizeObserver(updateLineClamp)
    if (descriptionRef.value) {
      observer.observe(descriptionRef.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
</script>

<template>
  <div
    class="animal-card"
    :style="{
      maxHeight: formattedMaxHeight,
      minHeight: formattedMinHeight
    }">
    <div class="card-header">
      <img :src="animal.imageUrl" :alt="animal.name" class="animal-image" />
      <div class="card-title">
        <h2>{{ animal.name }}</h2>
        <span class="type-badge" :class="getTypeClass(animal.type)">
          {{ animal.type }}
        </span>
      </div>
    </div>

    <div class="card-body" :class="{ 'ellipsis-mode': ellipsisDescription }" :style="{ overflowY: bodyOverflow }">
      <div class="info-row">
        <span class="label">年龄</span>
        <span class="value">{{ animal.age }}岁</span>
      </div>
      <div class="info-row">
        <span class="label">品种</span>
        <span class="value">{{ animal.breed }}</span>
      </div>
      <div class="info-row description">
        <span class="label">介绍</span>
        <p
          class="value"
          ref="descriptionRef"
          :style="{
            '--line-clamp': lineClamp,
            'max-height': ellipsisDescription ? `calc(${lineClamp} * var(--line-height))` : 'none'
          }">
          {{ animal.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .animal-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    --line-height: 1.6em; /* 定义行高变量 */

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      padding: 20px;
      background: #f8f9fa;
      display: flex;
      gap: 15px;
      flex-shrink: 0;

      .animal-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .card-title {
        flex: 1;

        h2 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          color: #333;
        }
      }
    }

    .card-body {
      padding: 20px;
      flex: 1;

      &.ellipsis-mode {
        .description .value {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: var(--line-clamp);
          line-height: var(--line-height);
          max-height: calc(var(--line-clamp) * var(--line-height));
          min-height: var(--line-height); /* 确保至少显示一行 */
        }
      }

      &:not(.ellipsis-mode) {
        .description .value {
          white-space: pre-wrap;
        }
      }

      .info-row {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .label {
          min-width: 60px;
          color: #666;
          font-weight: 500;
        }

        .value {
          color: #333;
          flex: 1;
        }
      }
    }

    .type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      color: white;

      &.bg-cat {
        background: #ff7e95;
      }
      &.bg-dog {
        background: #6eb5ff;
      }
      &.bg-bird {
        background: #98d8aa;
      }
      &.bg-fish {
        background: #b5eaea;
      }
      &.bg-other {
        background: #cab8ff;
      }
    }

    &::-webkit-scrollbar {
      width: 6px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 4px;
    }
  }
</style>
