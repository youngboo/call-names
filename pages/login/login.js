// pages/login/login.js
import {login} from '../../service/user.js';
import { isStringEmpty } from '../../utils/util.js';
import { updateGateway } from '../../service/host.js';
import { G_CONFIG } from '../../config/GlobalConfig.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    schoolRequire: false,
    userRequire: false,
    passwordRequire: false,
    showBottomTips: false,
    errorMessage: null,
    focus: null,
    confirmHold: true,
    cursorIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  validateRequire: function(e) {
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
  handleFocus: function (e) {
    const {id} = e.target;
    this.setData({
      focus: id
    })
    console.log(id);
  },
  handleInput: function (e) {
    return this.validateRequire(e);
  },
  handleBlur: function (e) {
    this.validateRequire(e);
  },
  nextInput: function (e) {
    const id = e.target.id;
    let focus;
    switch (id) {
      case 'school':
        focus = 'user';
      break;
      case 'user':
        focus = 'password';
      break;
      case 'password':
        focus = '';
      break;
      default:
      break;
    }
    this.setData({
      focus: focus
    })
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
    }, 5000);

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
    const value = e.detail.value;
    if (!this.validateForm(value)) {
      return false;
    }
    if (G_CONFIG.MODE === 'dev') {
      updateGateway(value.school)
        .then((res) => {
          this.login(value);
        })
        .catch(e => {
          this.showWarningMsg(e);
        })  
    }
    else if (G_CONFIG.MODE === 'test') {
      wx.setStorageSync('env', value.school);
      this.login(value);
    }
    

  },
  login: function(value) {
    login({
      userName: value.userName,
      password: value.password
    }).then((res) => {
      if (res.data.success) {
        wx.setStorageSync('accessInfo', res.data.result);
        wx.redirectTo({
          url: '/pages/userInfo/userInfo',
        })
      } else {
        this.showWarningMsg(res.data.error.message);
      }
    })
      .catch(error => {
        let title = '登陆失败,请检查网络';
        if (error.statusCode === 404) {
            title = '学校不存在';
        }
        // wx.showToast({
        //   title: title,
        //   icon: 'none'
        // })
        this.showWarningMsg(title);
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