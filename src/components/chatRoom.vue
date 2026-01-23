<template>
  <div class="chat_room_box">
    <indexSetting @canLink="linkStart" ref="indexSettingRef" v-show="settingShow"></indexSetting>
    <div class="main_container" v-show="!settingShow">
      <chatHeader :count="onlineCount" @setInfo="setUserInfo"></chatHeader>
      <div class="chat_content_box" ref="chatContent">
        <chatItem v-for="v,i in msgList" :key="i" :msgInfo="v" :userInfo="userInfo"></chatItem>
      </div>
      <chartFooter @sendMessage="sendMsg" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import io from 'socket.io-client'
import moment from 'moment'
import axios from 'axios'

import { Toast } from '@/components/Toast/index.js';
import chatHeader from './chatPage/chatHeader.vue';
import chartFooter from './chatPage/chatFfooter.vue';
import chatItem from './chatPage/chatItem.vue';
import indexSetting from './setting/indexSetting.vue';

export default {
  name: 'chatRoom',
  components: {
    chatHeader,
    chartFooter,
    chatItem,
    indexSetting,
  },
  props: {
    msg: String
  },
  setup() {
    // Toast.warning('请注意！');
    // Toast.error('请求失败，请重试！');
    const settingShow = ref(true)
    
    let ws = null
    const onlineCount = ref(0)
    const userInfo = ref({})
    const linkStart = (info) => {
      ws?.close()
      userInfo.value = info
      settingShow.value = false
      ws = io('http://172.20.10.2:5000', {
        withCredentials: true, // 若后端有cookie鉴权需开启，否则可省略
        transports: ['websocket']
      })
      // 链接成功 
      ws.on('connect_success', (data) => {
        console.log('连接成功，Socket ID：', data)
        // Toast.success('连接成功！');
        connectSuccess()
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
        if (data.id !== userInfo.value.id) {
          Toast.tips(data.content);
        }
      })
      // 在线人数
      ws.on('online_count', (data) => {
        console.log('在线人数：', data)
        onlineCount.value = data
      })
    }

    const connectSuccess = () => {
      // 发送昵称到后台
      ws.emit('set_nickname', { ...userInfo.value })
      getAllChats()
      // ws.emit('system_msg', { content: `用户 ${userInfo.value.nickname} 加入了聊天`, ...userInfo.value } )
    }

    // 设置用户信息
    const setUserInfo = (type) => {
      settingShow.value = true
      if (type === 'nickname') {
        indexSettingRef.value.setNickname()
      } else if (type === 'avatar') {
        indexSettingRef.value.setAvatar()
      }
    }

    // 滚动到底部
    const chatContent = ref(null)
    const scrollToBottom = () => {
      if (!chatContent.value) return;
      setTimeout(() => {
        chatContent.value.scrollTop = chatContent.value.scrollHeight;
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
    const sendMsg = (msg) => {
      const msgData = { content: msg, ...userInfo.value }
      console.log('sendMsg1111', userInfo.value )
      ws.emit('message', msgData)
    }

    const indexSettingRef = ref(null)
    onMounted(() => {
      indexSettingRef.value.checkUser()
    })
    return {
      settingShow,
      msgList,
      moment,
      userInfo,
      onlineCount,
      sendMsg,
      chatContent,
      linkStart,
      indexSettingRef,
      setUserInfo,
    }
  }

  
}
</script>

<style scoped>
/* 核心 CSS：禁用全局滚动 */
html, body {
  height: 100%; /* 改用 100% 而非 100vh，基于父容器高度计算 */
  overflow: hidden; /* 禁用整体滚动 */
  -webkit-overflow-scrolling: touch; /* 保留子元素的顺滑滚动 */
  position: fixed; /* 固定页面，避免偏移 */
  width: 100%; /* 确保宽度满屏 */
}
.chat_room_box {
  height: 100%; 
}
.main_container {
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column; 
}
.chat_content_box {
  flex: 1;
  overflow-y: auto;
  padding: 60px 6px 30px;
  background-color: #f4f4f4;
}

</style>
