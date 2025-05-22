import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import prettier from 'eslint-config-prettier' // 导入 Prettier 配置

export default defineConfig([
  {
    files: ['*.js', '*.vue'],
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: pluginVue
    },
    rules: {
      // 禁用分号检查
      semi: 'off',
      'no-extra-semi': 'off',

      // Vue 模板属性配置（关键部分）
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 999 } // 单行允许无限多属性
        }
      ],
      'vue/html-closing-bracket-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',

      // 其他常用规则
      'vue/script-indent': ['error', 2, { baseIndent: 1 }],
      'vue/no-multiple-template-root': 'off',

      // 确保 ESLint 不会强制与 Prettier 冲突的格式规则
      'arrow-parens': 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off'
    }
  },

  // 关闭所有与 Prettier 冲突的 ESLint 规则
  prettier, // 替换之前未定义的 prettierConfig

  // 应用 Vue 的 Prettier 跳过格式化配置
  skipFormatting,

  // 全局忽略文件
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // 环境配置
  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  // 基础配置
  js.configs.recommended,
  ...pluginVue.configs['flat/essential']
])
