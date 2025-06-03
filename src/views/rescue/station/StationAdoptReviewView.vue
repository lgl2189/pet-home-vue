<script setup>
  // 响应式对象
  import { getAdoptionAppllicationByStationId, updateAdoptionApplicationStatus } from '@/apis/adopt'
  import { APPLICATION_STATUIS } from '@/utils/constant'
  import { transApplicationStatusToName } from '@/utils/rescueUtil'
  import { onBeforeMount, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const adoptionApplicationList = ref([])

  // 函数
  const handleGetApplicationList = async () => {
    const res = await getAdoptionAppllicationByStationId(route.query.id)
    if (res.status === '200') {
      adoptionApplicationList.value = res.data.application_list
    }
  }
  const approveApplication = async (adoptionId) => {
    const index = adoptionApplicationList.value.findIndex((item) => item.adoption_id === adoptionId)
    if (index !== -1) {
      const res = await updateAdoptionApplicationStatus(adoptionId, APPLICATION_STATUIS.APPROVED)
      if (res.status === '200') {
        ElMessage.success('已通过')
        adoptionApplicationList.value[index].application_status = APPLICATION_STATUIS.APPROVED
      }
    }
  }

  const refuseApplication = async (adoptionId) => {
    const index = adoptionApplicationList.value.findIndex((item) => item.adoption_id === adoptionId)
    if (index !== -1) {
      const res = await updateAdoptionApplicationStatus(adoptionId, APPLICATION_STATUIS.REFUSED)
      if (res.status === '200') {
        ElMessage.success('已拒绝')
        adoptionApplicationList.value[index].application_status = APPLICATION_STATUIS.REFUSED
      }
    }
  }

  const handleClickAnimalIdCell = (animalId) => {
    const { href } = router.resolve({ name: 'AnimalDetailView', params: { id: animalId } })
    window.open(href, '_blank', 'noopener')
  }

  // 生命周期回调函数
  onBeforeMount(async () => {
    await handleGetApplicationList()
  })
</script>
<template>
  <div class="adoption-review-container">
    <el-table :data="adoptionApplicationList" stripe border size="large">
      <el-table-column prop="adoption_id" label="领养申请 ID"></el-table-column>
      <el-table-column prop="animal_id" label="动物 ID">
        <template #default="scope">
          <div
            @click="handleClickAnimalIdCell(scope.row.animal_id)"
            style="cursor: pointer; display: flex; align-items: center">
            <span style="margin-right: 5px">{{ scope.row.animal_id }}</span>
            <el-icon><Connection /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="adoptor_id" label="领养人 ID"></el-table-column>
      <el-table-column prop="career" label="职业"></el-table-column>
      <el-table-column prop="house_condition" label="住房条件"></el-table-column>
      <el-table-column prop="experience" label="饲养经验"></el-table-column>
      <el-table-column prop="application_status" label="申请状态">
        <template #default="scope">
          {{ transApplicationStatusToName(scope.row.application_status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            @click="approveApplication(scope.row.adoption_id)"
            :disabled="scope.row.application_status !== 'pending_review'">
            通过
          </el-button>
          <el-button
            @click="refuseApplication(scope.row.adoption_id)"
            :disabled="scope.row.application_status !== 'pending_review'">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="less" scoped>
  .adoption-review-container {
  }
</style>
