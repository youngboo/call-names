import { API } from '../config/ApiConfig.js';
/**
 * 根据条件查询所有课程的考勤记录
 */
const accessInfo = wx.getStorageSync("accessInfo");
const getCourseList = (data) => {
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
        resolve(res);
      }
    })
  });
}
const updateAttendance = (data) => {
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
      }
    })
  });
}
module.exports = {
  getCourseList: getCourseList,
  getStudentsList: getStudentsList,
  updateAttendance: updateAttendance
};