<script setup>
  import { getAnimalInfoById } from '@/apis/animal'
  import { updateRescueRecord } from '@/apis/rescue'
  import { useUserStore } from '@/stores/user'
  import { transRescueRecordStatusToName } from '@/utils/rescueUtil'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  // 响应式对象
  const route = useRoute()
  const userStore = useUserStore()
  const animalInfo = ref({
    animal_id: 0,
    name: '',
    species: '',
    breed: '',
    gender: false,
    age: 0,
    health_status: 'HEALTHY',
    is_sterilized: false,
    description: '',
    img_gid: 0,
    video_gid: 0,
    vaccination_record_gid: 0,
    deworming_record_gid: 0,
    medical_report_gid: 0,
    abnormal_warning: false,
    rescue_station_id: 0,
    img_url_list: [],
    video_url_list: [],
    vaccination_record_url_list: [],
    deworming_record_url_list: [],
    medical_report_url_list: []
  })
  const rescueStationInfo = ref({
    rescue_station_id: 0,
    rescue_station_name: '',
    position: '',
    admin_user_id: 0,
    admin_user_id: 0,
    admin_user_name: '0',
    admin_birth_date: [2010, 1, 1],
    admin_phone: '0',
    admin_email: '0'
  })
  const rescueRecord = ref({
    rescue_id: 1,
    animal_id: 1,
    rescue_position: '',
    rescue_datetime: '',
    rescuer_id: '',
    rescuer_phone: '',
    rescue_status: '等待救助',
    rescue_station_id: '等待救助',
    extra_info: '测试文本'
  })
  const rescueStatusSelectOptions = ref([
    { name: transRescueRecordStatusToName('wait_rescue'), value: 'wait_rescue' },
    { name: transRescueRecordStatusToName('under_treatment'), value: 'under_treatment' },
    { name: transRescueRecordStatusToName('wait_adopted'), value: 'wait_adopted' },
    { name: transRescueRecordStatusToName('adopted'), value: 'adopted' }
  ])
  // const isFavorite = ref(false)
  const currentTab = ref('vaccination')
  const isShowRescueStatusModifyDialog = ref(false)
  // 函数
  const handleGetAnimalInfo = async () => {
    try {
      // 实际项目中应调用API获取数据
      const animalId = route.params.id
      const res = await getAnimalInfoById(animalId)
      if (res.status === '200') {
        animalInfo.value = res.data.animal_info
        rescueStationInfo.value = res.data.rescue_station_info
        rescueRecord.value = res.data.rescue_record
      }
    } catch (error) {
      ElMessage.error('获取动物数据失败')
    }
  }

  const handleClickModifyStatusBtn = () => {
    isShowRescueStatusModifyDialog.value = true
  }

  const handleSaveRescueStatus = async () => {
    if (!rescueStatusSelectOptions.value.some((item) => item.value === rescueRecord.value.rescue_status)) {
      ElMessage.error('请选择正确的救助状态')
      return
    }
    const res = await updateRescueRecord(rescueRecord.value.rescue_id, {
      rescue_id: rescueRecord.value.rescue_id,
      rescue_status: rescueRecord.value.rescue_status
    })
    if (res.status === '200') {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('保存失败')
    }
    isShowRescueStatusModifyDialog.value = false
  }

  // 获取健康状态文本
  const getHealthStatusText = (status) => {
    const statusMap = {
      healthy: '健康',
      ill: '生病',
      recovering: '康复中',
      critical: '危急'
    }
    return statusMap[status] || status
  }

  // 获取健康状态样式
  const getAnimalStatusClass = (status) => {
    const statusClassMap = {
      healthy: 'healthy',
      ill: 'ill',
      recovering: 'recovering',
      critical: 'critical'
    }
    return statusClassMap[status] || ''
  }

  // 切换收藏状态
  // const toggleFavorite = () => {
  //   isFavorite.value = !isFavorite.value
  //   // 实际项目中应调用API更新收藏状态
  //   if (isFavorite.value) {
  //     console.log('已收藏该动物')
  //   } else {
  //     console.log('已取消收藏该动物')
  //   }
  // }

  // 查看视频
  const showVideo = (gid) => {
    // 实际项目中应打开视频查看器
    console.log(`查看视频: GID=${gid}`)
    alert('视频查看功能将在后续版本中实现')
  }

  // 查看图集
  const showGallery = (gid) => {
    // 实际项目中应打开图片浏览组件
    console.log(`查看图集: GID=${gid}`)
    alert('图集查看功能将在后续版本中实现')
  }

  // 查看记录
  const showRecord = (gid) => {
    // 实际项目中应打开记录查看器
    console.log(`查看记录: GID=${gid}`)
    alert('记录查看功能将在后续版本中实现')
  }
  //生命周期函数
  onMounted(() => {
    handleGetAnimalInfo()
  })
</script>

<template>
  <div class="container">
    <!-- 动物基本信息卡片 -->
    <div class="animal-info-card">
      <div class="info-header">
        <div class="animal-title">
          <h2>{{ animalInfo.name }}</h2>
          <span class="animal-id">#{{ animalInfo.animal_id }}</span>
        </div>
        <div class="animal-status">
          <span :class="`status-tag ${getAnimalStatusClass(animalInfo.health_status)}`">
            {{ getHealthStatusText(animalInfo.health_status) }}
          </span>
          <span v-if="animalInfo.abnormal_warning" class="warning-tag">预警</span>
        </div>
      </div>

      <div class="info-content">
        <div class="image-section">
          <img :src="animalInfo.img_url_list ? animalInfo.img_url_list[0] : ''" alt="动物图片" class="main-image" />
          <div class="media-buttons">
            <button v-if="animalInfo.video_gid" @click="showVideo(animalInfo.video_gid)">
              <i class="fa fa-play-circle"></i>
              查看视频
            </button>
            <button @click="showGallery(animalInfo.img_gid)">
              <i class="fa fa-picture-o"></i>
              查看图集
            </button>
          </div>
        </div>

        <div class="basic-info">
          <div class="info-row">
            <span class="info-label">种类:</span>
            <span class="info-value">{{ animalInfo.species }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">品种:</span>
            <span class="info-value">{{ animalInfo.breed }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">性别:</span>
            <span class="info-value">{{ animalInfo.gender ? '雄性' : '雌性' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">年龄:</span>
            <span class="info-value">{{ animalInfo.age }}岁</span>
          </div>
          <div class="info-row">
            <span class="info-label">绝育情况:</span>
            <span class="info-value">{{ animalInfo.is_sterilized ? '已绝育' : '未绝育' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">性格:</span>
            <span class="info-value">{{ animalInfo.personality }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">所属救助站:</span>
            <span class="info-value">
              <!-- <router-link :to="`/rescue-station/${animalInfo.rescue_station_id}`"> -->
              {{ rescueStationInfo.rescue_station_name }}
              <!-- </router-link> -->
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 救助记录 -->
    <div class="rescue-record">
      <h3>救助记录</h3>
      <el-descriptions size="large" :column="2" border>
        <el-descriptions-item label="救助地点：">{{ rescueRecord.rescue_position }}</el-descriptions-item>
        <el-descriptions-item label="救助时间：">{{ rescueRecord.rescue_datetime }}</el-descriptions-item>
        <el-descriptions-item label="救助者手机号：">{{ rescueRecord.rescuer_phone }}</el-descriptions-item>
        <el-descriptions-item label="当前状态：">
          {{ transRescueRecordStatusToName(rescueRecord.rescue_status) }}
        </el-descriptions-item>
        <el-descriptions-item label="额外信息：" :span="2">{{ rescueRecord.extra_info }}</el-descriptions-item>
      </el-descriptions>
      <el-button
        class="modify-btn"
        size="large"
        @click="handleClickModifyStatusBtn"
        v-if="userStore.userId == rescueRecord.rescuer_id">
        修改状态
      </el-button>
      <el-dialog
        v-model="isShowRescueStatusModifyDialog"
        title="修改救助状态"
        width="500"
        v-if="userStore.userId == rescueRecord.rescuer_id">
        <el-select v-model="rescueRecord.rescue_status" placeholder="请选择新的状态">
          <el-option
            v-for="status in rescueStatusSelectOptions"
            :key="status.name"
            :label="status.name"
            :value="status.value"></el-option>
        </el-select>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" size="large" @click="handleSaveRescueStatus">保存</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <!-- 动物详细介绍 -->
    <div class="animal-description">
      <h3>动物介绍</h3>
      <p>{{ animalInfo.description || '暂无介绍' }}</p>
    </div>
    <!-- 健康记录 -->
    <div class="health-records">
      <h3>健康记录</h3>
      <div class="record-tabs">
        <button @click="currentTab = 'vaccination'" :class="{ active: currentTab === 'vaccination' }">疫苗接种</button>
        <button @click="currentTab = 'deworming'" :class="{ active: currentTab === 'deworming' }">驱虫记录</button>
        <button @click="currentTab = 'medical'" :class="{ active: currentTab === 'medical' }">病例报告</button>
      </div>

      <div class="record-content">
        <div v-show="currentTab === 'vaccination'">
          <div v-if="animalInfo.vaccination_record_gid" class="record-item">
            <button @click="showRecord(animalInfo.vaccination_record_gid)">
              <i class="fa fa-file-text-o"></i>
              查看疫苗接种记录
            </button>
          </div>
          <div v-else class="no-record">暂无疫苗接种记录</div>
        </div>

        <div v-show="currentTab === 'deworming'">
          <div v-if="animalInfo.deworming_record_gid" class="record-item">
            <button @click="showRecord(animalInfo.deworming_record_gid)">
              <i class="fa fa-file-text-o"></i>
              查看驱虫记录
            </button>
          </div>
          <div v-else class="no-record">暂无驱虫记录</div>
        </div>

        <div v-show="currentTab === 'medical'">
          <div v-if="animalInfo.medical_report_gid" class="record-item">
            <button @click="showRecord(animalInfo.medical_report_gid)">
              <i class="fa fa-file-text-o"></i>
              查看病例报告
            </button>
          </div>
          <div v-else class="no-record">暂无病例报告</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="btn-adopt">
        <i class="fa fa-heart"></i>
        我要领养
      </button>
      <!-- <button class="btn-favorite" @click="toggleFavorite">
        <i :class="isFavorite ? 'fa fa-heart' : 'fa fa-heart-o'"></i>
        {{ isFavorite ? '已收藏' : '收藏' }}
      </button> -->
      <!-- <button class="btn-share">
        <i class="fa fa-share-alt"></i>
        分享
      </button> -->
    </div>
  </div>
</template>

<style lang="less" scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;

    .animal-info-card {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;

      .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .animal-title {
          h2 {
            margin: 0;
            font-size: 24px;
            color: #333;
          }
          .animal-id {
            color: #666;
            font-size: 14px;
            margin-left: 10px;
          }
        }

        .animal-status {
          display: flex;
          gap: 10px;

          .status-tag {
            padding: 5px 10px;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
          }

          .healthy {
            background-color: #28a745;
          }

          .ill {
            background-color: #ffc107;
          }

          .recovering {
            background-color: #17a2b8;
          }

          .critical {
            background-color: #dc3545;
          }

          .warning-tag {
            padding: 5px 10px;
            border-radius: 5px;
            background-color: #dc3545;
            color: #fff;
            font-size: 14px;
          }
        }
      }

      .info-content {
        display: flex;
        gap: 20px;

        .image-section {
          flex: 1;
          max-width: 400px;

          .main-image {
            width: auto;
            height: auto;
            max-height: 400px;
            border-radius: 8px;
            margin-bottom: 10px;
          }

          .media-buttons {
            display: flex;
            gap: 10px;

            button {
              padding: 8px 15px;
              background-color: #f0f0f0;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              display: flex;
              align-items: center;

              i {
                margin-right: 5px;
              }

              &:hover {
                background-color: #e0e0e0;
              }
            }
          }
        }

        .basic-info {
          flex: 2;

          .info-row {
            display: flex;
            margin-bottom: 15px;

            .info-label {
              width: 100px;
              color: #666;
              font-weight: 500;
            }

            .info-value {
              color: #333;
            }
          }
        }
      }
    }

    .rescue-record {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;

      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
        font-size: 20px;
      }

      .modify-btn {
        margin-top: 10px;
      }
    }
    .animal-description,
    .health-records {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;

      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
        font-size: 20px;
      }

      p {
        color: #666;
        line-height: 1.6;
      }
    }

    .health-records {
      .record-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;

        button {
          padding: 8px 15px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;

          &.active {
            background-color: #007bff;
            color: #fff;
          }

          &:hover:not(.active) {
            background-color: #e0e0e0;
          }
        }
      }

      .record-content {
        .record-item {
          button {
            padding: 8px 15px;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;

            i {
              margin-right: 5px;
            }

            &:hover {
              background-color: #e0e0e0;
            }
          }
        }

        .no-record {
          color: #999;
          padding: 10px 0;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 30px;

      button {
        padding: 12px 30px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          margin-right: 8px;
        }
      }

      .btn-adopt {
        background-color: #007bff;
        color: #fff;
        &:hover {
          background-color: #0056b3;
        }
      }

      .btn-favorite {
        background-color: #f8f9fa;
        color: #333;
        border: 1px solid #ddd;
        &:hover {
          background-color: #e2e6ea;
        }
        &.fa-heart {
          color: #dc3545;
        }
      }

      .btn-share {
        background-color: #f8f9fa;
        color: #333;
        border: 1px solid #ddd;
        &:hover {
          background-color: #e2e6ea;
        }
      }
    }
  }
</style>
