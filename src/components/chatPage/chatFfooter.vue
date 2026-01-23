<template>
  <!-- 2. 底部固定输入框 -->
  <div class="footer">
    <input v-model="inputMsg" type="text" class="input-box" id="msgInput" placeholder="输入消息..." @change="sendMessage" @keyup.enter="sendMessage">
    <div class="send-btn" :class="{'disabled': inputMsg.trim() === ''}" @click="sendMessage">发送</div>
  </div>
  <div class="footer_pad"></div>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
const inputMsg = ref('')

const emit = defineEmits(['sendMessage'])

const sendMessage = () => {
  if (inputMsg.value.trim() === '') {
    return;
  }
  // 触发发送消息的逻辑
  // console.log('发送消息:', inputMsg.value);
  emit('sendMessage', inputMsg.value)
  // 发送后清空输入框
  inputMsg.value = '';
};
</script>
<style scoped>
/* 2. 底部固定输入框（50px） */
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #f7f7f7;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    padding: 0 10px;
    z-index: 999;
    /* iOS 关键：硬件加速 + 强制渲染 */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: bottom;
    /* padding-bottom: 40px; */
}
.footer_pad {
    height: 50px;
    width: 100%;
}

/* 输入框样式 */
.input-box {
    flex: 1;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #e5e5e5;
    border-radius: 18px;
    outline: none;
    font-size: 14px;
    /* iOS 移除默认样式 */
    -webkit-appearance: none;
}

/* 发送按钮 */
.send-btn {
    width: 60px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #07c160;
    color: #fff;
    border-radius: 18px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
}
.disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>