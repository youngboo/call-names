// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loginSuccess:() => {
      console.log("成功了");
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.request({
      url: 'http://172.16.168.161:8025/api/TokenAuth/Authenticate',
      method: 'post',
      data: {
        userName: value.userName,
        password: value.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.success) {
          wx.setStorageSync('accessInfo', res.data.result);
          wx.showToast({
            title: '登陆成功'
          })
          wx.navigateTo({
            url: '/pages/userInfo/userInfo',
          })
        }
        console.log(res.data.result);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("展示了登陆页面")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})