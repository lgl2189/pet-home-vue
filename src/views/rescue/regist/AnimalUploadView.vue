<script setup>
  import { ref, reactive, onBeforeMount } from 'vue'
  import { uploadAnimalInfo } from '@/apis/animal'
  import { useRouter } from 'vue-router'
  // 响应式对象
  const props = defineProps({
    nowStep: {
      type: Number,
      required: true
    }
  })
  const emits = defineEmits(['animal-upload-success'])
  const router = useRouter()

  const formRef = ref(null)
  const animalInfo = reactive({
    species: '',
    breed: '',
    gender: 0,
    age: 0,
    health_status: '健康',
    is_sterilized: 0,
    description: '',
    personality: '',
    image_array: [],
    video_array: [],
    vaccination_record_array: [],
    deworming_record_array: [],
    medical_report_array: []
  })

  const healthStatusOptions = ['健康', '患病', '康复中', '危急']
  const rules = reactive({
    species: [{ required: true, message: '请输入动物种类', trigger: 'blur' }],
    breed: [{ required: true, message: '请输入动物品种', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择动物性别', trigger: 'change' }],
    age: [
      { required: true, message: '请输入动物年龄', trigger: 'change' },
      { type: 'number', message: '年龄必须为数字', trigger: 'change' },
      {
        message: '年龄必须大于等于0',
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (value < 0) {
            callback(new Error('年龄必须大于等于0'))
          }
          callback()
        }
      }
    ],
    health_status: [{ required: true, message: '请选择健康状况', trigger: 'change' }],
    is_sterilized: [{ required: true, message: '请选择是否绝育', trigger: 'change' }],
    description: [
      { required: true, message: '请输入动物介绍', trigger: 'blur' },
      { max: 100, message: '介绍最多100个字符', trigger: 'blur' }
    ]
  })
  // 函数
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        const res = await handleUploadAnimalInfo(animalInfo)
        if (res.status === '200') {
          ElMessage.success('表单提交成功')
          emits('animal-upload-success', res.data.animal_info)
          return true
        } else {
          ElMessage.error('表单提交失败，请检查网络或联系管理员')
        }
      } else {
        ElMessage.warning('表单验证失败，请检查必填项')
        return false
      }
    })
    // emits('animal-upload-success', { animal_id: 1 })
    // return true
  }
  const handleUploadAnimalInfo = () => {
    const formData = new FormData()
    formData.append('species', animalInfo.species)
    formData.append('breed', animalInfo.breed)
    formData.append('gender', animalInfo.gender)
    formData.append('age', animalInfo.age)
    formData.append('health_status', animalInfo.health_status)
    formData.append('is_sterilized', animalInfo.is_sterilized)
    formData.append('description', animalInfo.description)
    formData.append('personality', animalInfo.personality)

    // 添加文件数组（无需手动指定下标）
    animalInfo.image_array.forEach((file) => formData.append('image_array', file.raw))
    animalInfo.video_array.forEach((file) => formData.append('video_array', file.raw))
    animalInfo.vaccination_record_array.forEach((file) => formData.append('vaccination_record_array', file.raw))
    animalInfo.deworming_record_array.forEach((file) => formData.append('deworming_record_array', file.raw))
    animalInfo.medical_report_array.forEach((file) => formData.append('medical_report_array', file.raw))

    return uploadAnimalInfo(formData)
  }
  const resetForm = () => {
    formRef.value.resetFields()
  }
  // 生命周期回调函数
  onBeforeMount(() => {
    if (props.nowStep !== 0) {
      ElMessage.warning('请按步骤操作，先完成上一步操作')
      router.replace({ name: 'RescueRegistView' })
    }
  })
</script>
<template>
  <div class="container">
    <div class="upload-box">
      <div class="upload-box-title">动物信息</div>
      <div class="upload-form">
        <el-form ref="formRef" :model="animalInfo" :rules="rules" label-width="120px" size="large" status-icon>
          <el-form-item label="动物种类" prop="species">
            <el-input v-model="animalInfo.species" placeholder="请输入动物种类"></el-input>
          </el-form-item>

          <el-form-item label="动物品种" prop="breed">
            <el-input v-model="animalInfo.breed" placeholder="请输入动物品种"></el-input>
          </el-form-item>

          <el-form-item label="动物性别" prop="gender">
            <el-radio-group v-model="animalInfo.gender">
              <el-radio :value="0">雌性</el-radio>
              <el-radio :value="1">雄性</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="动物年龄" prop="age">
            <el-input-number
              v-model="animalInfo.age"
              placeholder="请输入动物年龄"
              :min="0"
              :precision="0"></el-input-number>
          </el-form-item>

          <el-form-item label="健康状况" prop="health_status">
            <el-select v-model="animalInfo.health_status" placeholder="请选择健康状况">
              <el-option
                v-for="status in healthStatusOptions"
                :key="status"
                :label="status"
                :value="status"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否绝育" prop="is_sterilized">
            <el-radio-group v-model="animalInfo.is_sterilized">
              <el-radio :value="0">未绝育</el-radio>
              <el-radio :value="1">已绝育</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="动物介绍" prop="description">
            <el-input
              v-model="animalInfo.description"
              placeholder="请输入动物介绍"
              maxlength="100"
              show-word-limit></el-input>
          </el-form-item>

          <el-form-item label="性格描述" prop="personality">
            <el-input v-model="animalInfo.personality" placeholder="请输入性格描述"></el-input>
          </el-form-item>

          <el-form-item label="展示图片" prop="image_array">
            <el-upload v-model:file-list="animalInfo.image_array" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <template v-slot:tip>
                <div class="el-upload__tip">只能上传图片文件，且不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="展示视频" prop="video_array">
            <el-upload v-model:file-list="animalInfo.video_array" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <template v-slot:tip>
                <div class="el-upload__tip">只能上传视频文件，且不超过50MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="疫苗记录" prop="vaccination_record">
            <el-upload v-model:file-list="animalInfo.vaccination_record_array" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <template v-slot:tip>
                <div class="el-upload__tip">只能上传图片文件，且不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="驱虫记录" prop="deworming_record">
            <el-upload v-model:file-list="animalInfo.deworming_record_array" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <template v-slot:tip>
                <div class="el-upload__tip">只能上传图片文件，且不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="病例" prop="medical_report_array">
            <el-upload v-model:file-list="animalInfo.medical_report_array" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <template v-slot:tip>
                <div class="el-upload__tip">只能上传PDF文件，且不超过10MB</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f4f9;

    .upload-box {
      width: 700px;

      .upload-box-title {
        margin-top: 20px;
        margin-left: 60px;
        font-size: 24px;
      }

      .upload-form {
        margin-top: 20px;
      }
    }
  }
</style>
