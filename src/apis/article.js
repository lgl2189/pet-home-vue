import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Object} params - 请求参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise<Object>} - 包含文章列表和总数的对象
 */
export const getArticleList = (pageNum, pageSize) => {
  return request.get(`/article/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

/**
 * 获取文章详情
 * @param {number} articleId - 文章ID
 * @returns {Promise<Object>} - 文章详情对象
 */
export const getArticleDetail = (articleId) => {
  return request.get(`/article/${articleId}`)
}

/**
 * 发布文章
 * @param {Object} articleData - 文章数据
 * @param {number} articleData.publisher_id - 发布者ID
 * @param {string} articleData.publish_date - 发布日期
 * @param {string} articleData.content - 文章内容
 * @returns {Promise<Object>} - 响应结果
 */
export const publishArticle = (articleData) => {
  return request.post('/article', {
    publisher_id: articleData.publisherId,
    publish_date: articleData.publishDate,
    content: articleData.content
  })
}
