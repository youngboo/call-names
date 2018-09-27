// pages/index/index.js
import { isEmpty } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accessInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accessInfo = wx.getStorageSync('accessInfo');
    const userInfo = wx.getStorageSync('userInfo');
    console.log('userInfo', userInfo);
    if (userInfo === null || isEmpty(userInfo)) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      wx.navigateTo({
        url: '/pages/userInfo/userInfo',
      })
    }
    console.log('accessInfo1', accessInfo);
    this.setData({
      accessInfo: accessInfo,
      userInfo: userInfo
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("index页面渲染了")
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