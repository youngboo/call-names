const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 判断是否是原型
 * @param value
 * @returns {boolean}
 */
const isPrototype = (value) => {
  const ctor = value && value.constructor
  const proto = (typeof ctor === 'function' && ctor.prototype) || Object.prototype

  return value === proto
}
/**
 * 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
const isString = (str) => {
  if ((typeof str).toLowerCase() === 'string' || str instanceof String) {
    return true
  } else {
    return false
  }
}
/**
 * 判断数组，对象是否是空
 * @param value
 * @returns {boolean}
 */
const isEmpty = (value) => {
  if (value === null) {
    return true
  }
  if (Array.isArray(value) || isString(value)) {
    return !value.length
  }
  if (isPrototype(value)) {
    return !Object.keys(value).length
  }
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      return false
    }
  }
  return true
}
const getWeekArray = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  let timeLoop = startTime;
  let weekArray = [];
  while (timeLoop < endTime) {
    let loopDate = new Date(timeLoop);
    let day = loopDate.getDay();
    if (day === 1) {
      let year = loopDate.getFullYear();
      let month = loopDate.getMonth() + 1;
      let nextDay = day + 7;
      let str = `${year}-${month}-${day}~${year}-${month}-${nextDay}`;

      weekArray.push({
        time: timeLoop,
        str: str
      });
    }
    timeLoop = timeLoop + 60*60*24*1000;
  }
  return weekArray;
}
const loginInfo = () => {
  const accessInfo = wx.getStorageSync('accessInfo');
  if (accessInfo && accessInfo.accessToken) {
    return accessInfo.accessToken;
  }else {
    return null;
  }
}
module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  loginInfo: loginInfo
}
