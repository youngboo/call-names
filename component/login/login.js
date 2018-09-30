// component/login/login.js
import { login } from '../../service/user.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    success: {
      type: Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userName:null,
    password:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLoginInfo:() => {

    },
    validateRequire:(e) => {
      console.log('验证', e);
    },
    formSubmit: (e) => {
      console.log('form发生了submit事件，携带数据为：', e);
      const value = e.detail.value;
      if (!value) {
        wx.showToast({
          title: '检查表单',
        })
        return false;
      }
      wx.showLoading({
        title: '正在登陆',
      })
      login(value)
        .then((res, rej) => {
          wx.redirectTo({
            url: '/pages/userInfo/userInfo',
          });
        })
        .catch(e => {
          console.log(e,"登陆错误信息");
          wx.showToast({
            title: '登陆失败',
          })
        })
      
    },

  }
})
