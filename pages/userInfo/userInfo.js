// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log('options', options);
   this.initCourseList(this);
  },
  initCourseList: (self) => {
    const accessInfo = wx.getStorageSync("accessInfo");
    wx.request({
      url: 'http://172.16.168.161:8025/api/services/app/TeacherUser/GetMyCoursesAsync',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + accessInfo.accessToken
      },
      success: (res) => {
        console.log('获取列表', res);
        self.setData({
          courseList: res.data.result
        })
      }
    })
  },
  onTapCourse: (e, detail) => {
    console.log("父组件接受了事件", e);
    wx.navigateTo({
      url: `/pages/names/names?id=${e.detail.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;
    const accessInfo = wx.getStorageSync("accessInfo");
    wx.request({
      url: 'http://172.16.168.161:8025/api/services/app/User/GetInfoAsync',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + accessInfo.accessToken
      },
      success: (res) => {
        console.log('验证成功');
        console.log(res);
        let photo = res.data.result.photo;
        res.data.result.photo = photo + '?x-oss-process=image/resize,l_32';
        wx.setStorageSync('userInfo', res.data.result);
        self.setData({
          userInfo: res.data.result,
        })    
      }
    })
    
  },
  getUserId: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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