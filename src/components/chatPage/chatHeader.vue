<template>
  <!-- 1. 顶部固定导航栏 -->
  <div class="header">劳资蜀道（{{ count }}）</div>
  <div class="header_pad"></div>
</template>

<script setup>
import { defineProps } from 'vue';

// 仅保留核心配置：文字、高度、背景色
defineProps({
  // 中间显示的文字
  count: {
    type: Number,
    required: true,
  },
});


</script>

<style scoped>
/* 1. 顶部固定导航栏（50px） */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  background: #f7f7f7;
  /* opacity: 0.8; */
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  z-index: 999;
  /* iOS 关键：硬件加速 + 强制渲染 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: top;
}
.header_pad {
  /* height: 50px; */
  width: 100%;
}
</style>