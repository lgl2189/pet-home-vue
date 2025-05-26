<script setup>
  import { getRecommendAnimalList, searchAnimal } from '@/apis/animal'
  import { SEARCH_CONSTANT } from '@/utils/constant'
  import { decodeSpecialChars, getKeyArrayFromKeyString, isEmpty, isSpaceStr } from '@/utils/stringUtil'
  import { onBeforeMount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  // 响应式对象
  const route = useRoute()
  const router = useRouter()
  const animalDataSearchValue = ref(null)
  const animalDataList = ref([])
  const pageInfo = ref({
    // 当前页序号
    page_num_now: 1,
    // 总页数
    page_num_total: 1,
    // 当前页的记录数
    page_size_now: 1,
    // 每页的记录数
    page_size: 20,
    // 总记录数
    record_num: 1
  })
  // 函数
  const updateData = async () => {
    let key = route.query.key
    let pageNum = route.query.pageNum
    const pageSize = route.query.pageSize
    // 请求参数合法性校验
    if (isSpaceStr(key)) {
      await handleGetRecommendAnimalList(20)
      return
    }
    // 检查pageNum和pageSize是否同时存在或者同时不存在
    if (isEmpty(pageNum) !== isEmpty(pageSize)) {
      await handleGetRecommendAnimalList(20)
      return
    }
    //检查pageNum是否合法
    if (pageNum < 0) {
      pageNum = 1
    }
    if (pageNum > pageInfo.value.page_num_total) {
      pageNum = pageInfo.value.page_num_total
    }
    key = key.trim()
    key = decodeSpecialChars(key)
    // 请求参数合法
    if (isEmpty(pageNum)) {
      await handleSearchAnimal(key, SEARCH_CONSTANT.DEFAULT_PAGE_NUM_NOW, SEARCH_CONSTANT.DEFAUTL_PAGE_SIZE)
    } else {
      await handleSearchAnimal(key, pageNum, pageSize)
    }
  }
  const handleGetRecommendAnimalList = async (num) => {
    const res = await getRecommendAnimalList(num)
    if (res.status === '200') {
      animalDataList.value = res.data.animal_list
      pageInfo.record_num = res.data.record_num
    }
  }
  const handleSearchAnimal = async (keyStr, pageNum, pageSize) => {
    const keyArray = getKeyArrayFromKeyString(keyStr)
    const res = await searchAnimal(keyArray, pageNum, pageSize)
    if (res.status === '200') {
      animalDataList.value = res.data.animal_list
      pageInfo.value = res.data.page_info
    }
  }
  const handlePageNumChange = () => {
    router.push({
      query: {
        ...route.query,
        pageNum: pageInfo.value.page_num_now,
        pageSize: pageInfo.value.page_size
      }
    })
  }
  const handleClickSearchBtn = () => {
    let inputStr = animalDataSearchValue.value.trim()
    if (isSpaceStr(inputStr)) {
      return
    }
    router.push({
      query: {
        key: inputStr
      }
    })
  }
  // 生命周期函数
  onBeforeMount(async () => {
    updateData()
  })
  // watch监听器
  watch(
    () => route.query,
    (oldQuery, newQuery) => {
      if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
        updateData()
      }
    }
  )
</script>
<template>
  <div class="container">
    <div class="animal-table">
      <div class="table-header">
        <div class="search-box">
          <div class="search-input-box">
            <input
              type="text"
              v-model="animalDataSearchValue"
              @keyup.enter="handleClickSearchBtn"
              placeholder="请输入搜索关键字" />
            <el-button class="search-btn" :round="true" color="#00aeec" @click="handleClickSearchBtn">
              <el-icon class="search-btn-icon">
                <Search></Search>
              </el-icon>
              <span>搜索</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="table-body">
        <DataGrid :items="animalDataList" :minItemWidth="200" :maxColumn="4" align-mode="grid">
          <template #item="{ item }">
            <router-link :to="{ name: 'AnimalDetailView', params: { id: item.animal_id } }">
              <AnimalDataCard
                :animal="{
                  name: item.name,
                  age: item.age,
                  imageUrl: item.img_url_list[0],
                  description: item.description,
                  type: item.species,
                  breed: item.breed
                }"
                :max-height="300"
                :min-height="300"
                :ellipsis-description="true" />
            </router-link>
          </template>
        </DataGrid>
      </div>
      <div class="table-footer">
        <Pagination
          v-model="pageInfo.page_num_now"
          :total-pages="pageInfo.page_num_total"
          :display-range="2"
          @change="handlePageNumChange"
          @jump="handlePageNumChange" />
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
    .animal-table {
      background-color: white;
      width: 90%;
      box-sizing: border-box;
      padding: 0 40px 0 40px;
      .table-header {
        width: 100%;
        margin-top: 20px;
        .search-box {
          height: 50px;
          margin: 0 auto;
          width: 70%;
          .search-input-box {
            background-color: #f6f7f8;
            height: 100%;
            border-radius: 10px;
            display: flex;
            align-items: center;
            &:hover {
              background-color: #ffffff;
            }
            input {
              background-color: transparent;
              height: 100%;
              border: none;
              flex-grow: 1;
              margin-left: 15px;
            }
            .search-btn {
              color: white;
              font-size: 15px;
              height: 80%;
              width: 15%;
              flex-grow: 0;
              margin-right: 15px;
              border-radius: 10px;
            }
            .search-btn-icon {
              margin-right: 3px;
            }
          }
        }
      }
      .table-body {
        box-sizing: border-box;
        width: 100%;
        margin: 20px 0;
      }
      .table-footer {
        box-sizing: border-box;
        width: 100%;
        margin: 20px 0;
      }
    }
  }
</style>
