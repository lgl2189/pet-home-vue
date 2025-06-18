<script setup>
  import { ref, reactive, onBeforeMount } from 'vue'
  import { getSupplyDemandList, addSupplyDemand, updateSupplyDemand, deleteSupplyDemand } from '@/apis/donation'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const supplyDemandList = ref([])
  const supplyDemandFormRef = ref(null)
  const supplyDemandForm = reactive({
    rescue_station_id: route.query.id,
    inventory_id: '',
    supply_name: '',
    demand_quantity: '',
    demand_status: 'unfinished'
  })
  const rules = reactive({
    inventory_id: [{ required: true, message: '请输入物资库存id', trigger: 'blur' }],
    supply_name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
    demand_quantity: [{ required: true, message: '请输入需求数量', trigger: 'blur' }]
  })
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  // 获取物资需求记录列表
  const handleGetSupplyDemandList = async (pageNum = 1, pageSize = 10) => {
    const res = await getSupplyDemandList(route.query.id, pageNum, pageSize)
    if (res.status === '200') {
      supplyDemandList.value = res.data.inventory_list
      total.value = res.data.page_info.record_num
    } else {
      ElMessage.error('获取物资需求记录列表失败，请稍后再试')
    }
  }

  // 添加物资需求记录
  const submitSupplyDemandForm = () => {
    supplyDemandFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addSupplyDemand(supplyDemandForm)
        if (res.status === '200') {
          ElMessage.success('添加成功')
          handleGetSupplyDemandList()
          resetSupplyDemandForm()
        } else {
          ElMessage.error(res.message ?? '添加失败，请稍后再试')
        }
      } else {
        ElMessage.error('验证失败，请检查输入内容')
        return false
      }
    })
  }

  // 重置表单
  const resetSupplyDemandForm = () => {
    supplyDemandFormRef.value.resetFields()
  }

  // 更新物资需求记录
  const handleUpdateSupplyDemand = async (row) => {
    const res = await updateSupplyDemand(row.supply_demand_id, row)
    if (res.status === '200') {
      ElMessage.success('更新成功')
      handleGetSupplyDemandList()
    } else {
      ElMessage.error('更新失败，请稍后再试')
    }
  }

  // 删除物资需求记录
  const handleDeleteSupplyDemand = async (supplyDemandId) => {
    const res = await deleteSupplyDemand(supplyDemandId)
    if (res.status === '200') {
      ElMessage.success('删除成功')
      handleGetSupplyDemandList()
    } else {
      ElMessage.error(res.message ?? '删除失败，请稍后再试')
    }
  }

  // 分页切换
  const handleCurrentChange = (page) => {
    currentPage.value = page
    handleGetSupplyDemandList(page, pageSize.value)
  }

  // 生命周期函数
  onBeforeMount(async () => {
    await handleGetSupplyDemandList()
  })
</script>
<template>
  <div class="supply-demand-management-container">
    <el-card class="box-card">
      <el-form :model="supplyDemandForm" :rules="rules" ref="supplyDemandFormRef" label-width="120px" size="large">
        <el-form-item label="物资库存id" prop="inventory_id">
          <el-input v-model="supplyDemandForm.inventory_id" placeholder="请输入物资库存id" />
        </el-form-item>
        <el-form-item label="物资名称" prop="supply_name">
          <el-input v-model="supplyDemandForm.supply_name" placeholder="请输入物资名称" />
        </el-form-item>
        <el-form-item label="需求数量" prop="demand_quantity">
          <el-input v-model="supplyDemandForm.demand_quantity" placeholder="请输入需求数量" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSupplyDemandForm">添加</el-button>
          <el-button @click="resetSupplyDemandForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table :data="supplyDemandList" stripe>
        <el-table-column prop="supply_demand_id" label="需求记录ID"></el-table-column>
        <el-table-column prop="inventory_id" label="库存ID"></el-table-column>
        <el-table-column prop="supply_name" label="物资名称"></el-table-column>
        <el-table-column prop="demand_quantity" label="需求数量"></el-table-column>
        <el-table-column prop="demand_status" label="需求状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- <el-button type="primary" size="small" @click="handleUpdateSupplyDemand(scope.row)">修改</el-button> -->
            <el-button type="danger" size="small" @click="handleDeleteSupplyDemand(scope.row.supply_demand_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="
          (size) => {
            pageSize.value = size
            handleGetSupplyDemandList(currentPage.value, size)
          }
        "
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
  .supply-demand-management-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .box-card {
      margin-top: 20px;
    }
  }
</style>
