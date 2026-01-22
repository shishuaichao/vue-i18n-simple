<template>
  <div class="hello">
    <testVue></testVue>
     <!-- <wechat></wechat> -->
    <!-- <button @click="switchLocale('zh-CN')">切换中文</button>
    <button @click="switchLocale('en-US')">切换英文</button>
    <div>
      {{ $t('common.submit') }}
    </div>
    <div>
      {{ $t('common.cancel') }}
    </div>
    <hr>`
    <div>
      {{ $t('login.success', { opt }) }}
    </div>
    <hr>
    <div>
      {{ obj.submit }}
    </div> -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from '../i18n/index.js';
import testVue from './testVue.vue'
// import wechat from './wechat.vue';
export default {
  components: {
    testVue,
    // wechat,  
  },
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
      const { switchLocale, t } = useI18n();
      const opt = ref('传参')
      
      const getTeachers = async () => {
        // 核心：请求Py服务的接口地址（端口和Py服务一致）
        const res = await axios.get('http://172.20.10.2:5000/api/teachers')
        console.log(res.data)  // 拿到Py返回的数据
      }
      const addTeacher = async () => {
        // 核心：请求Py服务的接口地址（端口和Py服务一致）
        const res = await axios.post('http://172.20.10.2:5000/api/add_teacher', { 
          name: '史帅超sss',
          title: '特级',
          subject: '全部',
        })
        console.log(res.data)  // 拿到Py返回的数据
      }
      
      
      const obj = computed(() => {
        return {
          submit: t('common.submit'),
        cancel: t('common.cancel'),
        }
      })

      onMounted(() => {
        
      })
      return {
        opt,
        getTeachers,
        addTeacher,
        switchLocale,
        obj,
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
