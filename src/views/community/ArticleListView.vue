<script setup>
  import { ref, watch, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { getArticleList } from '@/apis/article'

  const router = useRouter()
  const articleList = ref([])
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })

  const getList = async (page = 1) => {
    try {
      const res = await getArticleList(page, pagination.value.pageSize)
      if (res.status === '200') {
        articleList.value = res.data.articles_list
        pagination.value.total = res.data.page_info.record_num
        pagination.value.currentPage = res.data.page_info.page_num_now
      } else {
        ElMessage.error('获取文章列表失败'+ error)
      }
    } catch (error) {
      ElMessage.error('获取文章列表失败'+ error)
    }
  }

  watch(
    () => pagination.value.pageSize,
    async () => {
      await getList(pagination.value.currentPage)
    }
  )

  watch(
    () => pagination.value.currentPage,
    async (newValue) => {
      await getList(newValue)
    }
  )

  const goToArticleDetail = (articleId) => {
    router.push({ name: 'ArticleDetailView', params: { articleId } })
  }

  onBeforeMount(async () => {
    await getList(1)
  })
</script>

<template>
  <div class="article-list-page">
    <div class="page-header">
      <h1 class="page-title">文章列表</h1>
    </div>
    <div class="content-container">
      <el-table :data="articleList" border fit highlight-current-row stripe>
        <el-table-column prop="article_id" label="文章ID" width="100" />
        <el-table-column prop="publisher_id" label="发布者ID" width="100" />
        <el-table-column prop="publish_date" label="发布日期" width="150" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" size="default" @click="goToArticleDetail(scope.row.article_id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          v-model:page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .article-list-page {
    padding: 20px;

    .page-header {
      margin-bottom: 20px;

      .page-title {
        font-size: 24px;
        font-weight: bold;
      }
    }

    .content-container {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
