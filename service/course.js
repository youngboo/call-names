import { request } from '../utils/util.js';
/**
 * 根据条件查询所有课程的考勤记录
 */
const getCourseList = (data) => {
  wx.showLoading({
    title: '正在加载',
  })
  return new Promise((resolve, reject) => {
    request({
      needAccessToken: true,
      action:'courses',
      method: 'POST',
      data: data,
      success: (res) => {
        resolve(res);
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  });
}
const getStudentsList = (data) => {
  data = {
    maxResultCount: 1000,
    ...data
  }
  return new Promise((resolve, reject) => {
    request({
      needAccessToken: true,
      action: 'studentList',
      method: 'GET',
      data: data,
      success: (res) => {
        resolve(res.data.result);
      }
    })
  });
}
const updateAttendance = (data) => {
  return new Promise((resolve, reject) => {
    request({
      needAccessToken: true,
      action: 'updateAttendance',
      method: 'POST',
      data: data,
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