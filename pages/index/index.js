// pages/index/index.js
import { isEmpty, loginInfo } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accessInfo = wx.getStorageSync('accessInfo');
    const userInfo = wx.getStorageSync('userInfo');   
    if (accessInfo === null || userInfo === null || isEmpty(userInfo)) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    } else {
      wx.redirectTo({
        url: '/pages/userInfo/userInfo',
      })
    }
    console.log('登陆信息：', accessInfo);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("index页面ready");
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