// 多语言配置（模拟后端返回/本地配置）
export default {
  'zh-CN': {
    common: {
      submit: '提交',
      cancel: '取消',
      set: k => `设置${k}`
    },
    login: {
      title: '用户登录',
      success: '欢迎回来，{{opt}}！'
    }
  },
  'en-US': {
    common: {
      submit: 'Submit',
      cancel: 'Cancel'
    },
    login: {
      title: 'User Login',
      success: 'Welcome {{opt}} back, !'
    }
  }
};