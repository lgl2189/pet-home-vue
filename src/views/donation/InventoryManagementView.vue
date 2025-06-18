<script setup>
  import { ref, reactive } from 'vue'
  import { getInventoryList, addInventory, updateInventory, deleteInventory } from '@/apis/donation'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const inventoryList = ref([])
  const inventoryFormRef = ref(null)
  const inventoryForm = reactive({
    rescue_station_id: route.query.id,
    supply_name: '',
    inventory_quantity: '',
    warning_quantity: ''
  })
  const rules = reactive({
    supply_name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
    inventory_quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
    warning_quantity: [{ required: true, message: '请输入预警数量', trigger: 'blur' }]
  })
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  // 获取物资库存列表
  const handleGetInventoryList = async (page = 1, size = 10) => {
    const res = await getInventoryList(route.query.id, page, size)
    if (res.status === '200') {
      inventoryList.value = res.data.inventory_list
      total.value = res.data.page_info.record_num
    } else {
      ElMessage.error('获取物资库存列表失败，请稍后再试')
    }
  }

  // 添加物资库存
  const submitInventoryForm = () => {
    inventoryFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addInventory(inventoryForm)
        if (res.status === '200') {
          ElMessage.success('添加成功')
          handleGetInventoryList()
          resetInventoryForm()
        } else {
          ElMessage.error('添加失败，请稍后再试')
        }
      } else {
        ElMessage.error('验证失败，请检查输入内容')
        return false
      }
    })
  }

  // 重置表单
  const resetInventoryForm = () => {
    inventoryFormRef.value.resetFields()
  }

  // 更新物资库存
  const handleUpdateInventory = async (row) => {
    const res = await updateInventory(row.inventory_id, row)
    if (res.status === '200') {
      ElMessage.success('更新成功')
      handleGetInventoryList()
    } else {
      ElMessage.error('更新失败，请稍后再试')
    }
  }

  // 删除物资库存
  const handleDeleteInventory = async (inventoryId) => {
    const res = await deleteInventory(inventoryId)
    if (res.status === '200') {
      ElMessage.success('删除成功')
      handleGetInventoryList()
    } else {
      ElMessage.error(res.message ?? '删除失败，请稍后再试')
    }
  }

  // 分页切换
  const handleCurrentChange = (page) => {
    currentPage.value = page
    handleGetInventoryList(page, pageSize.value)
  }

  // 初始化数据
  handleGetInventoryList()
</script>
<template>
  <div class="inventory-management-container">
    <el-card class="box-card">
      <el-form :model="inventoryForm" :rules="rules" ref="inventoryFormRef" label-width="120px" size="large">
        <el-form-item label="物资名称" prop="supply_name">
          <el-input v-model="inventoryForm.supply_name" placeholder="请输入物资名称" />
        </el-form-item>
        <el-form-item label="库存数量" prop="inventory_quantity">
          <el-input v-model="inventoryForm.inventory_quantity" placeholder="请输入库存数量" />
        </el-form-item>
        <el-form-item label="预警数量" prop="warning_quantity">
          <el-input v-model="inventoryForm.warning_quantity" placeholder="请输入预警数量" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitInventoryForm">添加</el-button>
          <el-button @click="resetInventoryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table :data="inventoryList" stripe>
        <el-table-column prop="inventory_id" label="库存ID"></el-table-column>
        <el-table-column prop="supply_name" label="物资名称"></el-table-column>
        <el-table-column prop="inventory_quantity" label="库存数量"></el-table-column>
        <el-table-column prop="warning_quantity" label="预警数量"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- <el-button type="primary" size="small" @click="handleUpdateInventory(scope.row)">修改</el-button> -->
            <el-button type="danger" size="small" @click="handleDeleteInventory(scope.row.inventory_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="
          (size) => {
            pageSize = size
            handleGetInventoryList(currentPage, size)
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
  .inventory-management-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .box-card {
      margin-top: 20px;
    }
  }
</style>
