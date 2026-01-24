<template>
  <transition name="toast-fade">
    <div 
      v-if="visible" 
      class="toast-container"
      :style="{ top: `${top}px` }"
    >
      <div class="toast-content" :class="typeClass">
        <!-- <i v-if="type" class="toast-icon" :class="iconClass"></i> -->
        <span class="toast-text">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, defineProps, defineExpose } from 'vue';

// 定义 props
const props = defineProps({
  message: {
    type: String,
    required: true,
    default: ''
  },
  type: {
    type: String,
    default: 'default', // success/warning/error/loading
    validator: (val) => ['default', 'success', 'warning', 'error', 'loading'].includes(val)
  },
  duration: {
    type: Number,
    default: 2000 // 自动关闭时间，0 表示不关闭
  },
  top: {
    type: Number,
    default: 80 // 距离顶部的距离
  }
});

// 响应式控制显示/隐藏
const visible = ref(false);
let timer = null;

// 计算样式类
const typeClass = computed(() => `toast-${props.type}`);
// const iconClass = computed(() => {
//   const iconMap = {
//     success: 'toast-icon-success',
//     warning: 'toast-icon-warning',
//     error: 'toast-icon-error',
//     loading: 'toast-icon-loading'
//   };
//   return iconMap[props.type] || '';
// });

// 监听显示状态，自动关闭
watch(visible, (newVal) => {
  if (newVal && props.duration > 0) {
    timer = setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
});

// 销毁时清除定时器
onUnmounted(() => {
  clearTimeout(timer);
});

// 暴露方法给外部调用
defineExpose({
  visible,
  close: () => {
    visible.value = false;
  }
});
</script>

<style scoped>
/* 淡入淡出动画 */
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.3s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}

/* 容器样式 */
.toast-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999; /* 确保在最上层 */
}

/* 内容样式 */
.toast-content {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 不同类型样式 */
.toast-success {
  background: rgba(72, 187, 120, 0.9);
}
.toast-warning {
  background: rgba(250, 173, 20, 0.9);
}
.toast-error {
  background: rgba(245, 108, 108, 0.9);
}
.toast-loading {
  background: rgba(0, 0, 0, 0.8);
}
.toast-tips {
  background: rgba(123, 122, 122, 0.8);
}

/* 图标样式（内置 base64 图标，无需额外引入） */
.toast-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
}
.toast-icon-success {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNmZmYiLz4KPHBhdGggZD0iTTE0LjE3MiA2LjE3MkwxMCAxMC4zNDVMNy44MjggOC4xNzJDNy40MzggNy43ODIgNi43OTkgNy43ODIgNi40MDkgOC4xNzJDNi4wMTkgOC41NjIgNi4wMTkgOS4yMDEgNi40MDkgOS41OTFMMTAuNDA5IDEzLjU5MUMxMC42MDQgMTMuNzk2IDEwLjg5NiAxMy43OTYgMTEuMDkxIDEzLjU5MUwxNy41OTEgNy4wOTFDMTEuNTkxIDcuMDkxIDE0LjE3MiA2LjE3MiAxNC4xNzIgNi4xNzJaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==") center/cover no-repeat;
}
.toast-icon-warning {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNmZmYiLz4KPHBhdGggZD0iTTEwIDE0VjciIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xMCAxN1YxNSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+") center/cover no-repeat;
}
.toast-icon-error {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNmZmYiLz4KPHBhdGggZD0iTTE0LjE3MiA1LjgyOEMxNC41NjIgNi4yMTggMTQuNTYyIDYuODY3IDE0LjE3MiA3LjI1N0wxMi43NTcgOC42NzJMMTQuMTcyIDEwLjA4N0MxNC41NjIgMTAuNDc3IDE0LjU2MiAxMS4xMjYgMTQuMTcyIDExLjUxNkwxMi43NTcgMTIuOTMxTTEwIDEwLjU4N0w3LjI0MyAxMi45MzFDNi44NTMgMTIuNTQxIDYuODUzIDExLjg5MiA3LjI0MyAxMS41MDJMODYuNjI4IDEwLjg4N0M2LjIzOCAxMC40OTcgNi4yMzggOS44NDggNi42MjggOS40NThMMTAgNy4xMTZMMTMuMzcyIDkuNDU4QzEzLjc2MiA5Ljg0OCAxMy43NjIgMTAuNDk3IDEzLjM3MiAxMC44ODdMMTIuNzU3IDEwLjA4N0wxMC4xNzIgNy41MDJDNi44NTMgNy41MDIgNi4yMzggNy4xMTYgNi4yMzggNy4xMTZDMi44NTMgNy4xMTYgMi4yMzggNy41MDIgMi4yMzggNy4xMTZDMi4yMzggOS44NDggNi44NTMgMTIuOTMxIDEwIDEyLjkzMUwxMi43NTcgMTUuNDU4QzEyLjc1NyAxNS44NDggMTMuNDA2IDE2LjEgMTMuNzkxIDE1LjcxMUwxMC43OTEgMTIuNzExQzEwLjYwNCAxMi41MTYgMTAuMzA0IDEyLjUxNiAxMC4xMTkgMTIuNzExTDcuMTk5IDE1LjcxMUM3LjI4NCAxNi4xIDcuOTMzIDE1Ljg0OCA3LjkzMyAxNS40NThMMTAuNjg4IDEyLjkzMUwxMy40NDMgOS40NThDMzEuNDMgOS40NTggMTQuMTcyIDUuODI4IDE0LjE3MiA1LjgyOFoiIGZpbGw9IiNmZmIiLz4KPC9zdmc+") center/cover no-repeat;
}
.toast-icon-loading {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgcng9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yMCAxMEMyMCAxNS41MjMgMTUuNTIzIDIwIDEwIDIwQzQuNDc3IDIwIDAgMTUuNTIzIDAgMTBDMCA0LjQ3NyA0LjQ3NyAwIDEwIDBDMTUuNTIzIDAgMjAgNC40NzcgMjAgMTBaTTEwIDJDNi42ODcgMiA0IDQuNjg3IDQgOEM0IDExLjMxMyA2LjY4NyAxNCAxMCAxNEMxMy4zMTMgMTQgMTYgMTEuMzEzIDE2IDhDMTYgNC42ODcgMTMuMzEzIDIgMTAgMloiIGZpbGw9IiNmZmYiLz4KPC9zdmc+") center/cover no-repeat;
  animation: loading 1s linear infinite;
}

/* 加载动画 */
@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.toast-text {
  white-space: nowrap; /* 单行显示 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>