import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    createSvgIconsPlugin({
      // 指定要缓存的文件夹
      iconDirs: [path.resolve(__dirname, 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: '[name]'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define:{
    'process.env':{}
  },
  server: {
    proxy: {
      '/api': {//匹配/开头的请求
        target: 'http://localhost:8080',//转发的目标服务器
        changeOrigin: true,//允许跨域
        rewrite: (path) => path.replace(/^\/api/, '')//在请求转发前移除/api
      }

    }
  }
})
