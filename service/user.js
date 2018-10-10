import { API } from '../config/ApiConfig.js'
import { isEmpty } from '../utils/util.js'
const login = (data) => {
    wx.showLoading({
      title: '登录中...',
    })
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('accessInfo');
    return new Promise((resolve, reject) => {
      wx.request({
        url: API().login,
        method: 'post',
        data: {
          userName: data.userName,
          password: data.password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
          if (Number(res.statusCode) >= 400) {
            reject(res.data.error);
          } else if (Number(res.statusCode) === 200 || Number(res.statusCode) === 204) {
            wx.setStorageSync('accessInfo', res.data.result);
            resolve(res);
          } 
        },
        complete() {
          wx.hideLoading();
        }
      })
    });  
  }
  /**
   * 从缓存或网络异步获取用户信息
   */
const getUserInfo = () => {
    const accessInfo = wx.getStorageSync("accessInfo");
    return new Promise((resolve, reject) => {
      const userInfo = wx.getStorageSync('userInfo');
      console.log(userInfo);
      if (null !== userInfo && !isEmpty(userInfo)) {
        resolve(userInfo);
      }else {
        wx.request({
          url: API().userInfo,
          method: 'get',
          data: {},
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': 'Bearer ' + accessInfo.accessToken
          },
          success: (res) => {
            console.log(res);
            const userInfo = res.data.result;
            let photo = null;
            if (userInfo.photo) {
                photo = userInfo.photo + '?x-oss-process=image/resize,l_32';
            } else {
              photo = '../../resources/image/icon_teacher@2x.png';
            }
            userInfo.photo = photo;
            wx.setStorageSync('userInfo', userInfo);
            resolve(res.data.result);
          }
        })
      }
    });
  }
module.exports = {
    login: login,
    getUserInfo: getUserInfo
  }