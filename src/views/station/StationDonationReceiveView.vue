<script setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import { updateQrCode } from '@/apis/donation'
  import { getRescueStationInfoById } from '@/apis/rescue'
  import { useRoute } from 'vue-router'

  // 响应式变量
  const route = useRoute()
  const activeTab = ref('current-info')
  const rescueStationInfo = ref(null)
  const donationInfo = ref([])
  const newQrCodeList = ref([])

  // 函数
  const handleGetRescueStationInfo = async () => {
    const res = await getRescueStationInfoById(route.query.id)
    if (res.status === '200') {
      rescueStationInfo.value = res.data.station_info
    } else {
      ElMessage.error('获取救助站信息失败，请稍后再试')
    }
  }

  const handleNewQrcodeChange = (_file, filelist) => {
    newQrCodeList.value = filelist
  }

  const handleUpdateQrCode = async () => {
    const res = await updateQrCode(route.query.id, newQrCodeList.value)
    if (res.status === '200') {
      ElMessage.success('更新二维码成功')
      handleGetRescueStationInfo()
    } else {
      ElMessage.error('更新二维码失败，请稍后再试')
    }
  }
  // 计算属性
  const paymentQrCodeUrlList = computed(() => {
    return rescueStationInfo.value?.payment_qrcode_url_list ?? []
  })
  // 生命周期函数
  onBeforeMount(async () => {
    await handleGetRescueStationInfo()
  })
</script>
<template>
  <div class="container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="当前信息" name="current-info">
        <div class="current-info-wrapper">
          <el-table :data="donationInfo" stripe border size="large">
            <el-table-column prop="donation_id" label="捐款 ID"></el-table-column>
            <el-table-column prop="donor_name" label="捐赠者姓名"></el-table-column>
            <el-table-column prop="amount" label="捐款金额"></el-table-column>
            <el-table-column prop="donation_time" label="捐款时间"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收款二维码" name="update-qrcode">
        <div class="payment-qrcode-list">
          <div class="payment-qrcode-wrapper" v-for="(url, index) in paymentQrCodeUrlList" :key="index">
            <el-image style="width: 130px; height: 130px" :src="url" fit="fill" />
          </div>
        </div>
        <div class="update-qrcode-wrapper">
          <div class="update-qrcode-title">更新支付二维码列表</div>
          <div class="update-qrcode-content">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="newQrCodeList"
              @change="handleNewQrcodeChange"
              @remove="handleNewQrcodeChange"
              :limit="10">
              <el-button size="large">选择图片</el-button>
            </el-upload>
          </div>
          <el-button @click="handleUpdateQrCode" size="large">更新二维码</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="less" scoped>
  .container {
    .current-info-wrapper {
      margin-top: 15px;
    }

    .payment-qrcode-list {
      .payment-qrcode-wrapper {
        display: inline-block;
        box-sizing: border-box;
        padding: 10px 30px 10px 30px;
        border-right: solid 1px var(--el-border-color);
      }
    }

    .update-qrcode-wrapper {
      margin-top: 15px;
      .update-qrcode-title {
        margin-bottom: 15px;
      }
      .update-qrcode-content {
        margin-bottom: 15px;
      }
    }
  }
</style>
