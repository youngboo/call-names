// component/login/login.js
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
    userName:'admin',
    password:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLoginInfo:() => {

    },
    formSubmit: (e) => {
      console.log('form发生了submit事件，携带数据为：', e);
      const value = e.detail.value;
      if (!value) {
        wx.showToast({
          title: '检查表单',
        })
        return;
      }
      wx.showLoading({
        title: '正在登陆',
      })
      wx.request({
        url: 'http://sxz.zykj.com:8025/api/TokenAuth/Authenticate',
        method: 'post',
        data: {
          userName: value.userName,
          password: value.password,
          role: 9
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();
          if (res.data.success) {
            wx.setStorageSync('accessInfo', res.data.result);
            wx.navigateTo({
              url: '/pages/userInfo/userInfo',
            })
          }
        }
      })
    },

  }
})
