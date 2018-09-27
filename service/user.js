import { API } from '../config/ApiConfig.js'

const login = (data) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://sxz.zykj.com:8025/api/TokenAuth/Authenticate',
        method: 'post',
        data: {
          userName: data.userName,
          password: data.password,
          role: 9
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.result.success) {
            resolve(res);
          }else {
            reject(res.result.message);
          }
        }
      })
    }); 
    
  }