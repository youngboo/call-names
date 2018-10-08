import { API } from '../config/ApiConfig.js';
/**
 * 根据条件查询所有课程的考勤记录
 */
const getCourseList = (data) => {
  const accessInfo = wx.getStorageSync("accessInfo");
  return new Promise((resolve, reject) => {
    wx.request({
      url: API.courses,
      method: 'post',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + accessInfo.accessToken
      },
      success: (res) => {
        resolve(res);
      }
    })
  });
}
const getStudentsList = (data) => {
  const accessInfo = wx.getStorageSync("accessInfo");
  data = {
    maxResultCount: 1000,
    ...data
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: API.studentList,
      method: 'get',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + accessInfo.accessToken
      },
      success: (res) => {
        resolve(res.data.result);
      }
    })
  });
}
const updateAttendance = (data) => {
  const accessInfo = wx.getStorageSync("accessInfo");
  return new Promise((resolve, reject) => {
    wx.request({
      url: API.updateAttendance,
      method: 'post',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + accessInfo.accessToken
      },
      success: (res) => {
        resolve(res);
        // if (!res.success) {
        //   reject(res.error.message);
        // }else {
          
        // }
      }
    })
  });
}
module.exports = {
  getCourseList: getCourseList,
  getStudentsList: getStudentsList,
  updateAttendance: updateAttendance
};