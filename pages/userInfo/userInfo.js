// pages/userInfo/userInfo.js
import { getWeeks, patternDate } from '../../utils/util.js';
import { getUserInfo } from '../../service/user.js'
import { getCourseList } from '../../service/course.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    weeks: null,
    currentWeek: null,
    weekIndex: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.initWeeks();
   getUserInfo()
    .then((res) => {
      this.setData({
        userInfo: res
      })
    })
  },
  initWeeks: function() {
    const weeks = getWeeks();
    let currentIndex = 0;
    const current = weeks.find((item, index) => {
      if (item.isCurrent) {
        currentIndex = index;
        return item;
      }
    })
    this.setData({
      weeks: weeks,
      currentWeek: current,
      weekIndex: currentIndex 
    })
    this.getCourseListByTime({
      startTime: current.weekInfo.start,
      endTime: current.weekInfo.end
    })
  },
  onTapCourse: (e) => {
    // console.log(e);
    wx.navigateTo({
      url: `/pages/names/names?id=${e.detail.id}`,
    })
  },
  onChangeWeek: function (e){
    // console.log("切换周", e.detail);
    let index = Number(this.data.weekIndex) + Number(e.detail.option);
    if (index < 0) {
      index = 0
    }
    if (index > this.data.weeks.length-1 ) {
      index = this.data.weeks.length - 1;
    }
    const current = this.data.weeks[index];
    console.log(current);
    this.setData({
      currentWeek: current,
      weekIndex: index
    })
    this.getCourseListByTime({
      startTime: current.weekInfo.start,
      endTime: current.weekInfo.end
    })

  },
  getCourseListByTime: function(options) {
    getCourseList({
      startTime: new Date(options.startTime),
      endTime: new Date(options.endTime)
    })
      .then((res) => {
        console.log(res);
        let list = res.data.result;
        if (!!list.length && list.length > 0) {
          this.generatorCourseList(res.data.result);
        }else {
          this.setData({
            courseList:null
          })
        }
      })
  },
  generatorCourseList: function(list) {
    let allList = [];
    const length = this.data.currentWeek.weekInfo.weeks.length;
    list.forEach((item) => {
      const weekIndex = Number(item.courseSchedules[0].schedule.weekday) - 1;
      const attendList = item.attendancRecordList;
      let state = '';
      if (!attendList || !attendList.length || attendList.length <= 0) {
        state = '未点名';
      } else if( attendList.length < item.maxStudentCount) {
        state = `缺勤${attendList.length}人`;  
      }else {
        state = '满勤';
      }
      allList.push({
        time: patternDate(new Date(this.data.currentWeek.weekInfo.weeks[weekIndex]),"yyyy-MM-dd EEE"),
          content: item.content,
          courseList: item.courseSchedules.map((course) => {
            return {
              name: item.name,
              content: `第${course.schedule.index}节`,
              state: state,
              id: course.courseId,
            }
          })
        })
    });
    this.setData({
      courseList: allList
    })
    // console.log(courseList);
  },
  logout: function() {
    wx.removeStorageSync('accessInfo');
    wx.removeStorageSync('userInfo');
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const self = this;
    // const accessInfo = wx.getStorageSync("accessInfo");
    // wx.request({
    //   url: 'http://172.16.168.161:8025/api/services/app/User/GetInfoAsync',
    //   method: 'get',
    //   data: {},
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'Authorization': 'Bearer ' + accessInfo.accessToken
    //   },
    //   success: (res) => {
    //     console.log('验证成功');
    //     console.log(res);
    //     let photo = res.data.result.photo;
    //     res.data.result.photo = photo + '?x-oss-process=image/resize,l_32';
    //     wx.setStorageSync('userInfo', res.data.result);
    //     self.setData({
    //       userInfo: res.data.result,
    //     })    
    //   }
    // })
    
  },
  getUserId: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})