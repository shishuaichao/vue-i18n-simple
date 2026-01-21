var obj = {
    cn: {
    common: {
      submit: '提交',
      cancel: '取消',
      set: k => `设置${k}`
    },
    login: {
      title: '用户登录',
      success: '欢迎回来，{{opt}}！'
    }
  }
}

let key = 'common.submit'
const keyPath = key.split('.');
    
// 步骤2：从当前语言的messages中查找文本
let text = keyPath.reduce((current, k) => {
    console.log('xxx', current, k)
    return current && current[k] ? current[k] : null;
}, obj.cn);

console.log('text', text)