export const API =() =>{
  return wx.getStorageSync('API');
}
// export const SAPI = {
//   login: `${prefix}/TokenAuth/Authenticate`,
//   userInfo: `${prefix}/services/app/User/GetInfoAsync`,
//   courses: `${prefix}/services/app/Attendance/SearchMyAttendanceRecordsAsync`,
//   studentList: `${prefix}/services/app/Course/GetSubscribeAsync`,
//   updateAttendance: `${prefix}/services/app/Attendance/CreateOrUpdateAttendanceRecordAsync`
// }
export const getApiByMode = (mode) => {
  let prefix = wx.getStorageSync('gateway').server + '/api';
  switch(mode) {
    case 'dev':
      prefix = wx.getStorageSync('gateway').server + '/api';
    break;
    case 'test':
      prefix = 'https://sapi.zykj.org/api';
    break;
    default:
    break;
  }
  const API = {
    login: `${prefix}/TokenAuth/Authenticate`,
    userInfo: `${prefix}/services/app/User/GetInfoAsync`,
    courses: `${prefix}/services/app/Attendance/SearchMyAttendanceRecordsAsync`,
    studentList: `${prefix}/services/app/Course/GetSubscribeAsync`,
    updateAttendance: `${prefix}/services/app/Attendance/CreateOrUpdateAttendanceRecordAsync`
  }
  wx.setStorageSync('API', API);
  return API;
}