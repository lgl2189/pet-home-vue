<script>
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      name: {
        type: String,
        required: true
      },
      svgClass: {
        type: String,
        default: ''
      },
      svgColor: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const symbolId = computed(() => `#${props.name}`)
      const svgAllClass = computed(() => {
        if (props.svgClass) {
          return `svg-icon ${props.svgClass}`
        }
        return 'svg-icon'
      })
      return { symbolId, svgAllClass }
    }
  })
</script>

<template>
  <svg :class="svgAllClass" :style="`color:${svgColor}`">
    <use class="svg-use" :href="symbolId" />
  </svg>
</template>
<style scope>
  .svg-icon {
    fill: currentColor;
    /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
    overflow: hidden;
    width: inherit;
    height: inherit;
  }
</style>
