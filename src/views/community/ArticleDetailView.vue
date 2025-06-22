<script setup>
  import { ref, onMounted, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  import { getArticleDetail } from '@/apis/article'

  const route = useRoute()
  const articleDetail = ref({})

  const getDetail = async () => {
    try {
      const articleId = route.params.articleId
      const res = await getArticleDetail(articleId)
      if (res.status === '200') {
        articleDetail.value = res.data.article
      } else {
        ElMessage.error('获取文章详情失败',+ res.message)
      }
    } catch (error) {
      ElMessage.error('获取文章详情失败'+ error)
    }
  }

  onBeforeMount(async () => {
    await getDetail()
  })
</script>

<template>
  <div class="article-detail-page">
    <div class="page-header">
      <h1 class="page-title">文章详情</h1>
    </div>
    <div class="content-container">
      <div class="detail-card">
        <div class="card-header">
          <div class="card-title">文章 #{{ articleDetail.article_id }}</div>
          <div class="card-meta">
            <span>发布者: {{ articleDetail.publisher_id }}</span>
            <span>发布日期: {{ articleDetail.publish_date }}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="content-title">文章内容</div>
          <div class="content-text" v-html="articleDetail.content"></div>
        </div>
      </div>
      <div class="button-container">
        <el-button @click="$router.back()">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .article-detail-page {
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

      .detail-card {
        margin-bottom: 20px;

        .card-header {
          margin-bottom: 20px;

          .card-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .card-meta {
            color: #666;

            span {
              margin-right: 20px;
            }
          }
        }

        .card-content {
          .content-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .content-text {
            line-height: 1.8;
            white-space: pre-wrap;
          }
        }
      }

      .button-container {
        text-align: center;
      }
    }
  }
</style>
