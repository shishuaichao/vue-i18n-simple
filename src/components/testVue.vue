<template>
    <div class="hello">
      <div class="item_box clearfix" style="line-height: 2;" v-for="v,i in qaList" :key="i">
        <div class="time" :class="{ 't_right': v.type == 'q' }"><span style="color: #999;">{{ v.time && moment(v.time).format('hh:mm:ss') }}</span></div>
        <div class="item" :class="{ 'right': v.type == 'q' }">
          <!-- <span>{{ v.type == 'a' ? '' : '询问: ' }}</span> -->
          {{ v.msg }}
        </div>
      </div>
      
      <input class="input" @change="inputChange" v-model="cont" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import io from 'socket.io-client'
  import moment from 'moment'
  import axios from 'axios'
  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    setup() {
      const socket = ref(null)
        // 发送消息
        const sendMsg = (msg) => {
          render(msg, 'q')
          socket.value.emit('message', msg)
        }
        const qaList = ref([])
        const render = (msg, type) => {
          qaList.value.push({ type, msg, time: new Date() })
          scrollToBottom()
        }

        const scrollToBottom = () => {
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
          }, 0);
        }

        const inputChange = () => {
          sendMsg(cont.value)
          cont.value = ''
        }
        const cont = ref('')

        const getwechats = async () => {
          // 核心：请求Py服务的接口地址（端口和Py服务一致）
          const res = await axios.get('http://127.0.0.1:5000/api/wechats')
          console.log(res.data)  // 拿到Py返回的数据
          qaList.value = res.data || []
          scrollToBottom()
        }

        onMounted(() => {
          socket.value = io('http://127.0.0.1:5000', {
            withCredentials: true, // 若后端有cookie鉴权需开启，否则可省略
            transports: ['websocket']
          })

          // 监听服务端消息
          socket.value.on('message', (reply) => {
            console.log('服务端回复：', reply)
            render(reply, 'a')
          })

          // getwechats()
          console.log(getwechats)

        })
        return {
          qaList,
          inputChange,
          cont,
          moment,
        }
    }
  }
  </script>
  <style>
    html {
      background-color: #e0dddd;
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
    padding: 6px 12px;
    max-width: 60%;
    color: #333;
    margin-bottom: 20px;
  }
  .input {
    position: fixed;
    bottom: 0px;
    width: 100vw;
    height: 40px;
    left: 0;
  }
  </style>
  