import { isEmpty } from '../utils/util.js'
const GATEWAY = 'http://gateway.zykj.org/api/discovery/';
const DEFAULT = 'dev';
/**
 * 根据value更新网关值
 */
const updateGateway = (value) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: GATEWAY + value,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode === 200) {
          if (!res.data.server) {
            reject(`学校${value}不存在`);  
            return;
          }else {
            wx.setStorageSync('gateway', res.data);
            updateApi(res.data.server);
            resolve(res.data);
          }
        } else {
          reject('无法获取到学校代码，请检查网络');
        }
      },
      fail() {
        reject('无法获取到学校代码，请检查网络');
      }
    })
  });
}
const updateApi = (server) => {
  const prefix = server + '/api';
  const API = {
    login: `${prefix}/TokenAuth/Authenticate`,
    userInfo: `${prefix}/services/app/User/GetInfoAsync`,
    courses: `${prefix}/services/app/Attendance/SearchMyAttendanceRecordsAsync`,
    studentList: `${prefix}/services/app/Course/GetSubscribeAsync`,
    updateAttendance: `${prefix}/services/app/Attendance/CreateOrUpdateAttendanceRecordAsync`
  }
  wx.setStorageSync('API', API);
}
/**
 * 获取网关值
 */
const getGateway = () => {
  return new Promise((resolve, reject) => {
    const gateway = wx.getStorageSync('gateway');
    if (gateway && !isEmpty(gateway)) {
      resolve(gateway);
    } else {
      wx.request({
        url: GATEWAY + DEFAULT,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.statusCode === 200) {
            wx.setStorageSync('gateway', res.data);
            resolve(res.data);

          } else {
            reject('无法获取到学校代码，请检查网络');
          }
        },
        fail() {
          reject('无法获取到学校代码，请检查网络');
        }
      })

    }
  });
}
const getServerTime = () => {
  
}
module.exports = {
  updateGateway: updateGateway,
  getGateway: getGateway
};