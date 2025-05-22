<script setup>
  import { ref } from 'vue'

  // 响应式对象
  const animalDataSearchValue = ref(null)

  const animalDataList = ref([
    {
      id: 1,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 2,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 3,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 4,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 5,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 6,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 7,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 8,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 9,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 10,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 11,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    },
    {
      id: 12,
      name: '小白',
      age: 3,
      photo: 'http://localhost:8080/resource/image/5da7ca80-6f9a-40e2-873a-e1323f591364.jpeg',
      description: '一只非常可爱的英短猫，性格温顺亲人。',
      type: '猫',
      breed: '英国短毛猫'
    }
  ])

  const currentPageValue = ref(1)
</script>
<template>
  <div class="container">
    <div class="animal-table">
      <div class="table-header">
        <div class="search-box">
          <div class="search-input-box">
            <input type="text" v-model="animalDataSearchValue" placeholder="请输入搜索关键字" />
            <el-button class="search-btn" :round="true" color="#00aeec">
              <el-icon class="search-btn-icon">
                <Search></Search>
              </el-icon>
              <span>搜索</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="table-body">
        <DataGrid :items="animalDataList" :minItemWidth="200" :maxColumn="4">
          <template #item="{ item }">
            <router-link :to="{ name: 'AnimalDetailView', params: { id: item.id } }">
              <AnimalDataCard
                :animal="{
                  name: item.name,
                  age: item.age,
                  photo: item.photo,
                  description: item.description,
                  type: item.type,
                  breed: item.breed
                }" />
            </router-link>
          </template>
        </DataGrid>
      </div>
      <div class="table-footer">
        <Pagination v-model="currentPageValue" :total-pages="32" :display-range="2" />
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
