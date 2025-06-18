<script setup>
  import { ref, reactive, onMounted, onBeforeMount } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { getRescueStationList, addRescueRecord } from '@/apis/rescue'
  import { useUserStore } from '@/stores/user'
  import dayjs from 'dayjs'

  //响应式对象
  const props = defineProps({
    nowStep: {
      type: Number,
      required: true
    },
    animalId: {
      type: Number,
      required: true
    }
  })
  const userStore = useUserStore()
  const router = useRouter()
  const emits = defineEmits(['record-upload-success'])
  const formRef = ref(null)
  const stationSelectOption = ref(null)
  const rescueRecord = reactive({
    animal_id: props.animalId,
    rescue_position: '',
    rescue_datetime: null,
    rescuer_id: userStore.userId,
    rescuer_phone: '',
    rescue_status: 'wait_rescue',
    rescue_station_id: '',
    extra_info: ''
  })
  const rescueStatusOption = ref([
    { name: '待救助', value: 'wait_rescue' },
    { name: '在治疗', value: 'under_treatment' },
    { name: '待领养', value: 'wait_adopted' },
    { name: '已领养', value: 'adopted' }
  ])
  const rules = reactive({
    rescue_position: [{ required: true, message: '请输入发现地点', trigger: 'blur' }],
    rescue_datetime: [{ required: true, message: '请选择救助时间', trigger: 'change' }],
    rescuer_phone: [
      { required: true, message: '请输入救助人联系方式', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    rescue_station_id: [
      {
        validator: (rule, value, callback) => {
          if (value === '' || value === null || value === undefined) {
            callback(new Error('请选择站点'))
          }
          if (stationSelectOption.value.some((item) => item.rescue_station_id === value)) {
            callback()
          } else {
            callback(new Error('站点不存在'))
          }
        }
      }
    ],
    rescue_status: [
      {
        required: true,
        message: '请选择动物状态',
        trigger: 'change'
      },
      {
        validator: (rule, value, callback) => {
          if (value === '' || value === null || value === undefined) {
            callback(new Error('请选择动物状态'))
          }
          if (rescueStatusOption.value.some((item) => item.value === value)) {
            callback()
          } else {
            callback(new Error('状态不存在，请勿自行修改'))
          }
        }
      }
    ]
  })

  // 函数
  const handleGetStationList = async () => {
    const res = await getRescueStationList()
    if (res.status === '200') {
      stationSelectOption.value = res.data.station_info
    }
  }
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        const formatRescueRecord = rescueRecord
        formatRescueRecord.rescue_datetime = dayjs(formatRescueRecord.rescue_datetime).format('YYYY-MM-DDTHH:mm:ss')
        const res = await addRescueRecord(formatRescueRecord)
        if (res.status === '200') {
          ElMessage.success('表单提交成功')
          emits('record-upload-success')
          return true
        } else {
          ElMessage.error('表单提交失败，请检查网络或联系管理员')
        }
      } else {
        ElMessage.warning('表单验证失败，请检查必填项')
        return false
      }
    })
  }
  const resetForm = () => {
    formRef.value.resetFields()
  }
  const disabledDate = (time) => {
    return time.getTime() > Date.now()
  }

  // 生命周期回调函数
  onBeforeMount(() => {
    if (props.nowStep !== 1) {
      ElMessage.warning('请按步骤操作，先完成上一步操作')
      router.replace({ name: 'RescueRegistView' })
    }
  })
  onMounted(async () => {
    await handleGetStationList()
  })
</script>
<template>
  <div class="record-upload-container">
    <el-form ref="formRef" :model="rescueRecord" :rules="rules" label-width="120px" size="large" status-icon>
      <el-form-item label="发现地点" prop="rescue_position">
        <el-input v-model="rescueRecord.rescue_position" placeholder="请输入发现地点"></el-input>
      </el-form-item>
      <el-form-item label="救助时间" prop="rescue_datetime">
        <el-date-picker
          v-model="rescueRecord.rescue_datetime"
          type="date"
          placeholder="选择救助时间"
          :disabled-date="disabledDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="救助人联系方式" prop="rescuer_phone">
        <el-input v-model="rescueRecord.rescuer_phone" placeholder="请输入救助人联系方式"></el-input>
      </el-form-item>
      <el-form-item label="救助站" prop="rescue_station_id">
        <el-select v-model="rescueRecord.rescue_station_id" filterable placeholder="Select" style="width: 240px">
          <el-option
            v-for="station in stationSelectOption"
            :key="station.rescue_station_id"
            :label="station.rescue_station_name"
            :value="station.rescue_station_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="救助状态" prop="rescue_status">
        <el-select v-model="rescueRecord.rescue_status" filterable placeholder="Select" style="width: 240px">
          <el-option
            v-for="status in rescueStatusOption"
            :key="status.name"
            :label="status.name"
            :value="status.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="额外信息" prop="extra_info">
        <el-input v-model="rescueRecord.extra_info" placeholder="请输入额外信息" type="textarea" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" scoped>
  .record-upload-container {
    padding: 20px;
    background-color: #f4f4f9;

    .el-form {
      margin-top: 20px;
    }
  }
</style>
