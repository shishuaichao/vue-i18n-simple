<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { onMounted, onBeforeMount } from 'vue'
import { useI18n } from './i18n';
export default {
  name: 'App',
  components: {
    HelloWorld
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
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
