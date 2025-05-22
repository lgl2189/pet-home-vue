<script setup>
  const props = defineProps({
    animal: {
      type: Object,
      required: true,
      default: () => ({
        name: '未知动物',
        age: 0,
        photo: 'https://picsum.photos/400/300',
        description: '暂无介绍',
        type: '未知',
        breed: '未知'
      })
    }
  })

  const getTypeClass = () => {
    const types = {
      猫: 'bg-cat',
      狗: 'bg-dog',
      鸟: 'bg-bird',
      鱼: 'bg-fish',
      其他: 'bg-other'
    }
    return types[props.animal.type] || 'bg-other'
  }
</script>

<template>
  <div class="animal-card">
    <div class="card-header">
      <img :src="animal.photo" :alt="animal.name" class="animal-photo" />
      <div class="card-title">
        <h2>{{ animal.name }}</h2>
        <span class="badge" :class="getTypeClass()">{{ animal.type }}</span>
      </div>
    </div>
    <div class="card-body">
      <div class="info-row">
        <span class="info-label">年龄:</span>
        <span class="info-value">{{ animal.age }}岁</span>
      </div>
      <div class="info-row">
        <span class="info-label">品种:</span>
        <span class="info-value">{{ animal.breed }}</span>
      </div>
      <div class="info-row description">
        <span class="info-label">介绍:</span>
        <p class="info-value">{{ animal.description }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @card-radius: 12px;
  @shadow-base: 0 4px 20px rgba(0, 0, 0, 0.1);
  @shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.15);

  .animal-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: @card-radius;
    box-shadow: @shadow-base;
    overflow: hidden;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: @shadow-hover;
    }

    .card-header {
      display: flex;
      align-items: center;
      padding: 20px;
      background-color: #f8f9fa;

      .animal-photo {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 20px;
        border: 3px solid #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .card-title {
        flex: 1;

        h2 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          color: white;
          margin-top: 5px;
        }
      }
    }

    .card-body {
      padding: 20px;

      .info-row {
        display: flex;
        margin-bottom: 15px;

        .info-label {
          min-width: 80px;
          font-weight: 500;
          color: #666;
        }

        .info-value {
          flex: 1;
          color: #333;
        }

        &.description {
          .info-value {
            line-height: 1.6;
          }
        }
      }
    }
  }

  .bg-cat {
    background-color: #ff7e95;
  }
  .bg-dog {
    background-color: #6eb5ff;
  }
  .bg-bird {
    background-color: #98d8aa;
  }
  .bg-fish {
    background-color: #b5eaea;
  }
  .bg-other {
    background-color: #cab8ff;
  }
</style>
