import { createVNode, render } from 'vue';
import ToastComponent from './indexToast.vue';

// 核心：创建 Toast 实例并挂载到页面
function Toast(options = {}) {
  // 简化调用：Toast('提示文案') → 转为 { message: '提示文案' }
  if (typeof options === 'string') {
    options = { message: options };
  }

  // ✅ 修复点1：创建容器并直接添加到 body（避免 firstElementChild 为空）
  const container = document.createElement('div');
  document.body.appendChild(container); // 先把容器加到 body

  // 创建虚拟节点
  const vnode = createVNode(ToastComponent, options);
  // ✅ 修复点2：直接渲染到已挂载的容器，确保 DOM 节点存在
  render(vnode, container);

  // 获取组件实例
  const instance = vnode.component;
  // 显示 Toast
  instance.exposed.visible.value = true;

  // 手动关闭方法
  instance.close = () => {
    instance.exposed.visible.value = false;
    // 动画结束后销毁 DOM
    setTimeout(() => {
      render(null, container); // 清空容器
      document.body.removeChild(container); // 移除整个容器
    }, 300);
  };

  return instance;
}

// 快捷方法：Toast.success/error/warning/loading
['success', 'error', 'warning', 'loading', 'tips'].forEach((type) => {
  Toast[type] = (options) => {
    if (typeof options === 'string') {
      options = { message: options };
    }
    return Toast({ ...options, type });
  };
});

// 全局注册插件
export default {
  install(app) {
    // 挂载到全局属性
    app.config.globalProperties.$toast = Toast;
  }
};

// 导出 Toast 函数，方便非组件内调用
export { Toast };