import { G_CONFIG } from '../config/GlobalConfig.js';
import { getApiByMode } from '../config/ApiConfig.js';
import WeekObj from './week.js'
const MINIMUM_DATE = new Date('2018/9/1').getTime();
const ONE_YEAR = 31536000000;
const ONE_DAY = 86400000;
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
 * 对Date的扩展，将 Date 转化为指定格式的String       
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
 * eg:       
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
 */
const patternDate = function(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份           
    "d+": date.getDate(), //日           
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时           
    "H+": date.getHours(), //小时           
    "m+": date.getMinutes(), //分           
    "s+": date.getSeconds(), //秒           
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度           
    "S": date.getMilliseconds() //毫秒           
  };
  var week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
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
const isStringEmpty = (str) => {
  if (isString(str)) {
    return !str.trim().length;
  }
  return false;
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
// const getWeekArray = (start, end) => {
//   const startTime = start.getTime();
//   const endTime = end.getTime();
//   let timeLoop = startTime;
//   let weekArray = [];
//   while (timeLoop < endTime) {
//     let loopDate = new Date(timeLoop);
//     let day = loopDate.getDay();
//     if (day === 1) {
//       let year = loopDate.getFullYear();
//       let month = loopDate.getMonth() + 1;
//       let nextDay = day + 7;
//       let str = `${year}-${month}-${day}~${year}-${month}-${nextDay}`;

//       weekArray.push({
//         time: timeLoop,
//         str: str
//       });
//     }
//     timeLoop = timeLoop + 60*60*24*1000;
//   }
//   return weekArray;
// }
/**
 * 获取 当前时间前后一年的周列表
 */
const getWeeks = (now) => {
  if (!now) {
    now = new Date();
  }
  const current = new Date(`${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`).getTime();
  let lastYear = new Date(current - ONE_YEAR).getTime();
  if (lastYear < MINIMUM_DATE) {
    lastYear = MINIMUM_DATE;
  }
  const nextYear = new Date(current + ONE_YEAR).getTime();
  let tmpDay = lastYear;
  let list = [];
  let map = {};
  let init = true;
  let weeks = [];
  let isCurrent = false;
  while (tmpDay < nextYear) {
    if (current === tmpDay) {
      isCurrent = true;
    }
    weeks.push(tmpDay);
    if (new Date(tmpDay).getDay() === 0) {
      // map[tmpDay] = new WeekObj(weeks);
      const start = new Date(weeks[0]);
      const end = new Date(weeks[weeks.length - 1]);
      const title = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} ~ ${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;
      list.push({
        isCurrent: isCurrent,
        weekInfo: {
          weeks: weeks,
          start: weeks[0],
          end: weeks[weeks.length - 1],
          title: title
        }
      });
      weeks = [];
      // list.push(new WeekObj(weeks));
      isCurrent = false;
    }
    tmpDay += ONE_DAY;
  }
  return list;
}
const getValueListFromArray = (list, value) => {
  return list.map((item) => {
    return item[value];
  });
}
const loginInfo = () => {
  const accessInfo = wx.getStorageSync('accessInfo');
  if (accessInfo && accessInfo.accessToken) {
    return accessInfo.accessToken;
  } else {
    return null;
  }
}
const groupByValue = (list, value) => {
  let dest = [];
  let map = {};
  list.forEach((item) => {
    let id = item[value];
    if (!map[id]) {
      dest.push({
        id: id,
        valueList: [item]
      });
      map[id] = item;
    } else {
      for (let i = 0; i < dest.length; i++) {
        let obj = dest[i];
        if (id === obj.id) {
          obj.valueList.push(item);
          break;
        }
      }
    }
  });
  return dest;
}
const showWarningMsg = (msg, time, callBack) => {
  setTimeout(() => {

  }, time)
}
const request = (options) => {
  return new Promise((resolve, reject) => {

    const mode = G_CONFIG.MODE;
    const url = getApiByMode(mode)[options.action];
    let header = {
      'content-type': 'application/json', // 默认值
    };
    
    switch(mode) {
      case "dev":
        header = {
          'content-type': 'application/json', // 默认值
        };
      break;
      case "test":
        const env = wx.getStorageSync('env')
        header = {
          'content-type': 'application/json', // 默认值
          'School-Code' : env
        }
    }

    if (options.needAccessToken) {
      const accessInfo = wx.getStorageSync("accessInfo");
      header = {
        ...header,
        'Authorization': 'Bearer ' + accessInfo.accessToken
      }
    }

    wx.request({
      url: url,
      method: options.method,
      data: options.data,
      header: header,
      success: (res) => {
        if (options.success) {
          options.success(res);
        }
        resolve(res);
      },
      fail: () => {
        if (options.fail) {
          options.fail();
        }
        if (options.errorMsg) {
          wx.showToast({
            title: options.errorMsg,
          })
        }
        wx.hideLoading();
        reject('网络错误');
      },
      complete: () => {
        if (options.complete) {
          options.complete();
        }
        wx.hideLoading();
        // console.log(`网络请求${options.action}完成`)
      }
    })

  });
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  loginInfo: loginInfo,
  getWeeks: getWeeks,
  patternDate: patternDate,
  groupByValue: groupByValue,
  isStringEmpty: isStringEmpty,
  getValueListFromArray: getValueListFromArray,
  request: request
}