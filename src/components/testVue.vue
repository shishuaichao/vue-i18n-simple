<template>
    <div class="hello">
      <div class="item_box clearfix" style="line-height: 2;" v-for="v,i in msgList" :key="i">
        <div v-if="v.type == 'message'" class="time" :class="{ 't_right': userInfo.id == v.id }">
          <span style="color: #999; font-size: 14px;">{{ v.nickname }}</span>
        </div>
        <div v-if="v.type == 'message'"  class="item" :class="{ 'right': userInfo.id == v.id }">
          {{ v.content }}
        </div>
        <div class="tips" v-if="v.type == 'system_msg'">
          {{ v.content }}
        </div>
      </div>
      <input class="input" @change="inputChange" v-model="cont" style="width: calc(100% - 20px); padding: 12px; border: 1px solid #ccc; border-radius: 8px; margin-top: 10px;" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeMount } from 'vue'
  import io from 'socket.io-client'
  import moment from 'moment'
  import axios from 'axios'
  import { v4 as uuidv4 } from 'uuid';
  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    setup() {
      
      let ws = null
      onBeforeMount(() => {
        ws = io('http://172.20.10.2:5000', {
          withCredentials: true, // 若后端有cookie鉴权需开启，否则可省略
          transports: ['websocket']
        })
      })

      // 检查用户信息
      let userInfo = ref({})
      const checkUser = () => {
        let id = localStorage.getItem('uuid')
        let nickname = localStorage.getItem('nickname')
        if (!id || !nickname) {
          id = uuidv4()
          nickname = prompt('请输入昵称') || '用户' + id.slice(-4)
          localStorage.setItem('uuid', id)
          localStorage.setItem('nickname', nickname)
        }
        userInfo.value = { id, nickname }
        // 发送昵称到后台
        ws.emit('set_nickname', { id, nickname })
        getAllChats()
        ws.emit('system_msg', { content: `用户 ${nickname} 加入了聊天`, ...userInfo.value } )
      }  

      // 滚动到底部
      const scrollToBottom = () => {
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 0);
      }

      // 聊天记录
      const msgList = ref([])
      const getAllChats = async () => {
        const res = await axios.get('http://172.20.10.2:5000/api/wechats')
        msgList.value = res.data || []
        scrollToBottom()
      }

      // 渲染消息
      const render = (msgData) => {
        msgList.value.push(msgData)
        console.log(msgList.value)
        scrollToBottom()
      }

      // 发送消息
      const cont = ref('')
      const sendMsg = (msg) => {
        ws.emit('message', { content: msg, ...userInfo.value })
      }
      const inputChange = () => {
        sendMsg(cont.value)
        cont.value = ''
      }
      
      onMounted(() => {
        // 链接成功 
        ws.on('connect_success', (data) => {
          console.log('连接成功，Socket ID：', data)
          checkUser()
        })
        // 昵称设置成功 
        ws.on('username_success', (data) => {
          console.log('昵称设置成功', data)
        })
        // 聊天消息
        ws.on('message', (data) => {
          console.log('普通消息：', data)
          render(data)
        })
        // 系统消息
        ws.on('system_msg', (data) => {
          console.log('系统消息：', data)
          render(data)
        })
      })
      return {
        msgList,
        inputChange,
        cont,
        moment,
        userInfo,
      }
    }

    
  }
  </script>
  <style>
    html {
      background-color: #f6f5f5;
      padding-bottom: 50px;
    }
  </style>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    .hello {
      padding: 30px;
    }
    .clearfix::after {
      content: "";        /* 必须有内容（空字符串） */
      display: block;     /* 转为块级元素 */
      clear: both;        /* 清除左右两侧浮动 */
      visibility: hidden; /* 隐藏伪元素（可选） */
      height: 0;          /* 避免占用高度（可选） */
    }
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
  .time {
    text-align: left;
  }
  .time.t_right {
    text-align: right;
  }
  
  .right {
    float: right !important;
    background-color: #20d63e !important;
  }
  .item {
    text-align: left;
    float: left;
    background-color: #fff;
    border-radius: 8px;
    padding: 2px 12px;
    max-width: 60%;
    color: #333;
    margin-bottom: 4px;
  }
  .input {
    position: fixed;
    bottom: 0px;
    width: 100vw;
    height: 40px;
    left: 0;
  }
  .tips {
    text-align: center;
    color: #999;
    font-size: 14px;
  }
  </style>
