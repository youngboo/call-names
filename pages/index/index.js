// pages/index/index.js
import { isEmpty, loginInfo } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputStyle: {
      'confirm-hold': true,
      'confirm-type': 'next',
      'cursor-spacing': '20px',
      
    }
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
  }
})