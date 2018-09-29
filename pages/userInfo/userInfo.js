// pages/userInfo/userInfo.js
import { getWeeks, patternDate, getValueListFromArray, groupByValue } from '../../utils/util.js';
import { getUserInfo } from '../../service/user.js'
import { getCourseList, getStudentsList } from '../../service/course.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    weeks: null,
    currentWeek: null,
    weekIndex: 0,
    userInfo: null,
    courseInfo: null,
    showNames: false,
    studentsList: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(this.data.currentWeek === null) {
      this.initWeeks();
    }
    if (this.data.userInfo === null) {
      getUserInfo()
        .then((res) => {
          this.setData({
            userInfo: res
          })
        })
    }
    const currentWeek = this.data.currentWeek;
    this.getCourseListByTime({
      startTime: currentWeek.weekInfo.start,
      endTime: currentWeek.weekInfo.end
    });
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
  },
  onTapCourse: function(e) {
    console.log(e, '点击课程');
    this.showNames(e.detail);
    // wx.navigateTo({
    //   url: `/pages/names/names?id=${e.detail.id}&courseName=${e.detail.name}&courseName=${e.detail.ids}`,
    // })
  },
  onBackIndex: function(e) {
    console.log(e);
    this.reloadCourseList();
    this.setData({
      showNames: e.detail.showNames
    })
  },
  showNames: function(detail) {
    wx.showLoading();
    const info = detail.info;
    const attend = info.attend;
    let students = null;
    let attendCount = 0; 
    if (attend && attend.absentStudents.length && attend.absentStudents.length > 0) {
      students = getValueListFromArray(attend.absentStudents, 'studentId');
    }
    getStudentsList({
      id: detail.id
    })
      .then((result) => {
        if (result.totalCount > 0) {
          let list = result.items.map((item) => {
            return {
              id: item.id,
              fullName: item.user.fullName,
              classInfo: item.class.enterSchoolYear + '届 ' + item.class.name,
              checked: students ? students.indexOf(item.id) < 0 : true
            }
          })
          attendCount = list.length;
          if (students) {
            attendCount = list.length - attend.absentStudents.length;
            list.sort((a, b) => {
              if (a.checked && b.checked) {
                return 0;
              } else if (a.checked && !b.checked) {
                return 1;
              } else {
                return -1;
              }
            })
          }
          this.setData({
            showNames: true,
            studentsList: list,
            courseInfo: info,
            attendCount: attendCount
          })
        } else {
          wx.showToast({
            title: '无学生',
            icon: 'none'
          });
        }
        wx.hideLoading();
      })
      .catch(rej => wx.hideLoading());
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
    this.setData({
      currentWeek: current,
      weekIndex: index
    })
    this.getCourseListByTime({
      startTime: current.weekInfo.start,
      endTime: current.weekInfo.end
    })

  },
  reloadCourseList: function() {
    this.getCourseListByTime({
      startTime: this.data.currentWeek.weekInfo.start,
      endTime: this.data.currentWeek.weekInfo.end
    })
  },
  getCourseListByTime: function(options) {
    wx.showLoading({
      title: '正在加载',
    })
    getCourseList({
      startTime: patternDate(new Date(options.startTime), 'yyyy-MM-dd HH:mm:ss'),
      endTime: patternDate(new Date(options.endTime), 'yyyy-MM-dd HH:mm:ss')
    })
      .then((res) => {
        console.log(res);
        let list = res.data.result;
        if (!!list.length && list.length > 0) {
          //this.generatorCourseList(res.data.result);
          this.getCourseListByWeekday(list);
        }else {
          this.setData({
            courseList:null
          })
        }
        wx.hideLoading();
      })
      .catch(rej => {
        wx.hideLoading();
        console.log(rej)
      });
  },
 
  getCourseListByWeekday: function(list) {
    const newList = list.map((item) => {
      return {
        weekday: item.courseSchedules[0].schedule.weekday,
        ...item
      }
    })
    //课程按周分组
    let weekdayList = groupByValue(newList, 'weekday');
    //排序
    weekdayList.sort((a, b) =>{
      if(a.id > b.id) {
        return 1;
      }else if(a.id === b.id){
        return 0
      }else {
        return -1;
      }
    });
    // 格式化数据
    weekdayList = weekdayList.map((weekday) => {
      const weekdayIndex = weekday.id - 1 < 0 ? 0 : weekday.id - 1;
      return {
        time: patternDate(new Date(this.data.currentWeek.weekInfo.weeks[weekdayIndex]), "yyyy-MM-dd EEE"),
        date: this.data.currentWeek.weekInfo.weeks[weekdayIndex],
        courseList: weekday.valueList.map((item) => {
          const attendList = item.attendanceRecordList;
          let attend = null;
          if (attendList && attendList.length && attendList.length > 0) {
            attend = attendList[attendList.length - 1];
          }
          return {
            id: item.id,
            name: item.name,
            content: this.getScheduleText(item.courseSchedules),
            state: this.getAttendState(attend),
            attend: attend
          }
        })
      }
    })
    this.setData({
      courseList: weekdayList
    })
    console.log('weekdaylist', weekdayList);
  },
  generatorCourseList: function(list) {
    let allList = [];
    const length = this.data.currentWeek.weekInfo.weeks.length;
    list.forEach((item) => {
      const courselist = item.courseSchedules;
      const weekIndex = Number(item.courseSchedules[0].schedule.weekday) - 1;
      const attendList = item.attendanceRecordList;
      this.getCourseAttendInfo(courselist, attendList);
      allList.push({
        time: patternDate(new Date(this.data.currentWeek.weekInfo.weeks[weekIndex]),"yyyy-MM-dd EEE"),
          content: item.content,
          courseList: item.courseSchedules.map((course, courseIndex) => {
            return {
              name: item.name,
              content: `第${course.schedule.index}节`,
              state: this.getState(attendList, courseIndex),
              id: course.courseId,
              stuIds: this.getIdList(attendList, courseIndex),
            }
          })
        })
    });
    this.setData({
      courseList: allList
    })
    // console.log(courseList);
  },
  //处理课位和考勤信息，如果是两节联排则合到一起，再把考勤信息加入 
  getCourseAttendInfo(courseList, attendList) {
    // 以下两步根据课程整合课位
    const newCourseList = groupByValue(courseList, 'courseId');
    const newAttendList = groupByValue(attendList, 'courseId');
    newCourseList.map((item) => {
      //item.valueList.sort
      //如果有考勤记录就整合，没有就忽略，认为未点名
      return {
        id: item.id,
        name: item.name,
        content: this.getScheduleText(),
        state: this.getState(),
        attendId:0
      }

    })
    console.log(newCourseList);
  },
  getScheduleText(scheduleList) {
    scheduleList.sort((a, b)=>{
      if (a.schedule.index > b.schedule.index) {
        return 1;
      } else if (a.schedule.index === b.schedule.index){
        return 0;
      }else {
        return -1;
      }
    });
    let text = ''
    scheduleList.forEach((item, index) => {
      if (index < scheduleList.length - 1) {
        text = text + `第${item.schedule.index}节，`
      }else {
        text = text + `第${item.schedule.index}节`
      }
    });
    return text;
  },
  getIdList(attendList, index) {
    if (attendList && attendList.length && attendList.length > 0) {
      const courseInfo = attendList[index];
      if (courseInfo && courseInfo.absentStudents) {
        return getValueListFromArray(attendList[index].absentStudents, 'studentId');
      }
    } 
  },
  getAttendState(attend) {
    let state = {
      text: '未点名',
      color: 'text-third'
    };
    if (attend) {
      if (attend.absentStudents && attend.absentStudents.length > 0) {
        state = {
          text: `缺勤${attend.absentStudents.length}人`,
          color: 'text-red'
        };
      } else { 
        state = {
          text: '满勤',
          color: 'text-blue'
        }
      }
    }
    return state;
  },
  getState(attendList, index) {
    let state = {
      text: '未点名',
      color: 'text-third' 
    };
    if (attendList && attendList.length && attendList.length > 0) {
      const courseInfo = attendList[index];
      if (courseInfo && courseInfo.absentStudents) {
        const count = courseInfo.absentStudents.length;
        if (count && count > 0) {
          state = {
            text: `缺勤${count}人`,
            color: 'text-red'
          };
        }else {
          state = {
            text: '满勤',
            color: 'text-blue'
          }
        }
      }
    } 
    return state;
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
})