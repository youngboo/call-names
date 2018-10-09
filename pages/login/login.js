// pages/login/login.js
import {login} from '../../service/user.js';
import { isStringEmpty } from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    schoolRequire: false,
    userRequire: false,
    passwordRequire: false,
    showBottomTips: false,
    errorMessage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  validateRequire: function(e) {
    console.log('验证', e);
    const id = e.currentTarget.id;
    let str = e.detail.value;
    const flag = !str.trim().length;
    switch (id) {
      case 'school':
      this.setData({
        schoolRequire: flag
      })
      break;
      case 'user':
      this.setData({
        userRequire: flag
      })
      break;
      case 'password':
      this.setData({
        passwordRequire: flag
      })
      break;

    }
    return str;
  },
  handleInput: function (e) {
    const id = e.currentTarget.id;
    let str = e.detail.value;
    this.validateRequire();
  },
  showWarningMsg: function (msg) {
    this.setData({
      showBottomTips: true,
      errorMessage: msg
    });
    const that = this;
    setTimeout(function () {
      that.setData({
        showBottomTips: false,
        errorMessage: null
      });
    }, 3000);

  },
  validateForm: function(values) {
    let errorMsg = '';
    if (isStringEmpty(values.school)) {
      this.setData({
        schoolRequire: true
      })
    }
    if (isStringEmpty(values.userName)) {
      this.setData({
        userRequire: true
      })
    }
    if (isStringEmpty(values.password)) {
      this.setData({
        passwordRequire: true
      })
    }
    if (this.data.schoolRequire || this.data.userRequire || this.data.passwordRequire) {
      errorMsg = '请检查表单';
      this.showWarningMsg(errorMsg);
      return false;
    } else {
      return true;
    }
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e);
    const value = e.detail.value;
    if (!this.validateForm(value)) {
      return false;
    }
    login({
      userName: value.userName,
      password: value.password
    }).then((res) => {
      if (res.data.success) {
        wx.setStorageSync('accessInfo', res.data.result);
        wx.redirectTo({
          url: '/pages/userInfo/userInfo',
        })
      }else {
        // wx.showToast({
        //   title: '登陆失败',
        //   icon: 'none'
        // })
        this.showWarningMsg(res.data.error.message);
      }
      console.log('登陆', res);
    })
    .catch(error => {
      wx.showToast({
        title: '登陆失败,请检查网络',
        icon: 'none'
      })
      this.showWarningMsg(error.message);
    })
    // wx.request({
    //   url: 'http://172.16.168.161:8025/api/TokenAuth/Authenticate',
    //   method: 'post',
    //   data: ,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     if (res.data.success) {
    //       wx.setStorageSync('accessInfo', res.data.result);
    //       wx.showToast({
    //         title: '登陆成功'
    //       })
    //       wx.redirectTo({
    //         url: '/pages/userInfo/userInfo',
    //       })
    //     }
    //     console.log('登陆',res.data.result);
    //   }
    // })
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
    return false;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    return false;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})