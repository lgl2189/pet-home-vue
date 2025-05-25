<script setup>
  import { getRecommendAnimalList, searchAnimal } from '@/apis/animal'
  import { getKeyArrayFromKeyString, isSpaceStr } from '@/utils/stringUtil'
  import { onBeforeMount, ref } from 'vue'
  import { useRoute } from 'vue-router'

  // 响应式对象
  const route = useRoute()
  const animalDataSearchValue = ref(null)
  const animalDataList = ref([])
  const pageInfo = ref({
    page_num_now: 1,
    page_num_total: 1,
    page_size_now: 1,
    page_size: 20,
    record_num: 1
  })
  // 函数
  const handleGetRecommendAnimalList = async (num) => {
    const res = await getRecommendAnimalList(num)
    if (res.status === '200') {
      animalDataList.value = res.data.animal_list
      pageInfo.record_num = res.data.record_num
    }
  }
  const handleSearchAnimal = async () => {
    const rawString = animalDataSearchValue.value
    if (isSpaceStr(rawString)) {
      await handleGetRecommendAnimalList(20)
      return
    }
    const keyArray = getKeyArrayFromKeyString(rawString)
    const res = await searchAnimal(keyArray)
    if (res.status === '200') {
      animalDataList.value = res.data.animalList
      pageInfo.value = res.dada.page_info
    }
  }
  // 生命周期函数
  onBeforeMount(async () => {
    await handleGetRecommendAnimalList(20)
  })
</script>
<template>
  <div class="container">
    <div class="animal-table">
      <div class="table-header">
        <div class="search-box">
          <div class="search-input-box">
            <input type="text" v-model="animalDataSearchValue" placeholder="请输入搜索关键字" />
            <el-button class="search-btn" @click="handleSearchAnimal" :round="true" color="#00aeec">
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
                  imageUrl: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
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
        <Pagination v-model="pageInfo.page_num_now" :total-pages="pageInfo.page_num_total" :display-range="2" />
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
