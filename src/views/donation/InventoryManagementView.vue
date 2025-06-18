<script setup>
  import { ref, reactive } from 'vue'
  import {
    getInventoryList,
    addInventory,
    updateInventory,
    deleteInventory,
    addInventoryChangeRecord
  } from '@/apis/donation' // 假设添加了 changeInventory 接口
  import { useRoute } from 'vue-router'
  import { inventoryChangeType } from '@/utils/constant'
  import dayjs from 'dayjs'

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
  const inventoryRules = reactive({
    supply_name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
    inventory_quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
    warning_quantity: [{ required: true, message: '请输入预警数量', trigger: 'blur' }]
  })

  const nowDatetime = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss')
  const inventoryChangeFormRef = ref(null)
  const inventoryChangeForm = reactive({
    rescue_station_id: route.query.id,
    inventory_id: '',
    purpose: '',
    change_num: 0,
    change_type: '',
    change_datetime: nowDatetime
  })
  const inventoryChangeRules = reactive({
    inventory_id: [{ required: true, message: '请输入物资id', trigger: 'blur' }],
    purpose: [{ required: true, message: '请输入用途或来源', trigger: 'blur' }],
    change_num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
    change_type: [
      {
        required: true,
        message: '请选择类型',
        type: 'enum',
        enum: Object.values(inventoryChangeType).map((item) => item.value),
        trigger: 'blur'
      }
    ],
    change_datetime: [{ required: true, message: '请选择日期', trigger: 'blur' }]
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

  // 提交物资入库和出库表单
  const submitInventoryChangeForm = () => {
    inventoryChangeFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await addInventoryChangeRecord(inventoryChangeForm)
        if (res.status === '200') {
          ElMessage.success('操作成功')
          handleGetInventoryList()
          resetInventoryChangeForm()
        } else {
          ElMessage.error('操作失败，请稍后再试')
        }
      } else {
        ElMessage.error('验证失败，请检查输入内容')
        return false
      }
    })
  }

  // 重置物资入库和出库表单
  const resetInventoryChangeForm = () => {
    inventoryChangeFormRef.value.resetFields()
  }

  // 初始化数据
  handleGetInventoryList()
</script>
<template>
  <div class="inventory-management-container">
    <el-card class="box-card">
      <template #header>添加物资种类</template>
      <el-form :model="inventoryForm" :rules="inventoryRules" ref="inventoryFormRef" label-width="120px" size="large">
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
      <template #header>物资入库和出库</template>
      <el-form
        :model="inventoryChangeForm"
        :rules="inventoryChangeRules"
        ref="inventoryChangeFormRef"
        label-width="120px"
        size="large">
        <el-form-item label="物资id" prop="inventory_id">
          <el-input v-model="inventoryChangeForm.inventory_id" placeholder="请输入物资id" />
        </el-form-item>
        <el-form-item label="使用目的或来源" prop="purpose">
          <el-input v-model="inventoryChangeForm.purpose" placeholder="请输入用途或来源" />
        </el-form-item>
        <el-form-item label="变化类型（入库或出库）" prop="change_type">
          <el-select v-model="inventoryChangeForm.change_type" placeholder="请选择类型">
            <el-option
              v-for="item in Object.values(inventoryChangeType)"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变化数量" prop="change_num">
          <el-input v-model.number="inventoryChangeForm.change_num" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="日期" prop="change_datetime">
          <el-date-picker
            v-model="inventoryChangeForm.change_datetime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="请选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitInventoryChangeForm">提交</el-button>
          <el-button @click="resetInventoryChangeForm">重置</el-button>
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
