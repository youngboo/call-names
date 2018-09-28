//const prefix = 'http://sxz.zykj.com:8025/api';
const prefix = 'http://172.16.168.161:8025/api';
export const API = {
  login: `${prefix}/TokenAuth/Authenticate`,
  userInfo: `${prefix}/services/app/User/GetInfoAsync`,
  courses: `${prefix}/services/app/Attendance/SearchMyAttendanceRecordsAsync`,
  studentList: `${prefix}/services/app/Course/GetSubscribeAsync`,
  updateAttendance: `${prefix}/services/app/Attendance/CreateOrUpdateAttendanceRecordAsync`
}