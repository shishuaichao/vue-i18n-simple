<template>
  <chatRoom />
  
</template>

<script>
import chatRoom from './components/chatRoom.vue'
import { onMounted, onBeforeMount } from 'vue'
import { useI18n } from './i18n';
export default {
  name: 'App',
  components: {
    chatRoom
  },
  setup() {
    const { switchLocale, setLocaleMessage } = useI18n();
    const getLocale = async () => {
      try {
        let ms = await require('./i18n/newLocale.js')
        // console.log('ms', ms, setLocaleMessage)
        setLocaleMessage('en-US', ms.default)
        switchLocale('en-US')
      } catch(err) {
        console.log(err)
      }
    }
    onBeforeMount(() => {
      getLocale()
    })
    onMounted(() => {
      // console.log('app ')
      // 阻止Ctrl+滚轮缩放
      // 阻止双指触摸缩放
      document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      }, { passive: false });
      document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    })
  }
}
</script>

<style>
/* 核心 CSS：禁用全局滚动 */
html, body {
  height: 100%; /* 改用 100% 而非 100vh，基于父容器高度计算 */
  overflow: hidden; /* 禁用整体滚动 */
  -webkit-overflow-scrolling: touch; /* 保留子元素的顺滑滚动 */
  position: fixed; /* 固定页面，避免偏移 */
  width: 100%; /* 确保宽度满屏 */
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

* {
  box-sizing: border-box;
}
</style>
