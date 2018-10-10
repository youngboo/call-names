// pages/userInfo/userInfo.js
import { getWeeks, patternDate, getValueListFromArray, groupByValue } from '../../utils/util.js';
import { getUserInfo } from '../../service/user.js';
import { getCourseList, getStudentsList } from '../../service/course.js';
import { G_CONFIG } from '../../config/GlobalConfig.js';
import { getServerTime } from '../../service/host.js'
const OVER_TIME = G_CONFIG.OVER_TIME * 60 * 1000;
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
    console.log('userInfo页面load了');
    if(this.data.currentWeek === null) {
      this.initWeeks();
    }
    const currentWeek = this.data.currentWeek;
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !this.data.userInfo) {
      getUserInfo()
        .then((res) => {
          this.setData({
            userInfo: res
          })
          this.getCourseListByTime({
            startTime: currentWeek.weekInfo.start,
            endTime: currentWeek.weekInfo.end
          });
        })
    }else {
      this.getCourseListByTime({
        startTime: currentWeek.weekInfo.start,
        endTime: currentWeek.weekInfo.end
      });
    }
    
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
  },
  onBackIndex: function(e) {
    console.log(e);
    if (e.detail.reload) {
      this.reloadCourseList();
    }
    this.setData({
      showNames: e.detail.showNames
    })
  },
  // 根据服务器时间判断时间差是否大于over值
  isOverTime: function(time, over) {
    return new Promise((resolve, reject) => {
      getServerTime()
        .then((res) => {
          const currentTime = new Date(res.data.result);
          let over = false;
          if ( currentTime.getTime() - time > over) {
            over = true;
          }
          resolve({over: over});
        })
    })
  },
  showNames: function(detail) {
    wx.showLoading();
    const info = detail.info;
    const attend = info.attend;
    let students = null;
    let attendCount = 0;
    let overTime = false;
    
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
          const dataObj = {
            showNames: true,
            studentsList: list,
            courseInfo: info,
            attendCount: attendCount
          }
          if (attend) {
            this.isOverTime(new Date(attend.creationTime), OVER_TIME)
            .then(res => {
              if (res) {
                this.setData({
                  ...dataObj,
                  overTime: res.over
                })
              }
            })

          }else {
            this.setData({
              ...dataObj,
              overTime: overTime
            })
          } 
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
    getCourseList({
      startTime: patternDate(new Date(options.startTime), 'yyyy-MM-dd HH:mm:ss'),
      endTime: patternDate(new Date(options.endTime), 'yyyy-MM-dd HH:mm:ss')
    })
      .then((res) => {
        if (res) {
          let list = res.data.result;
          if (list && !!list.length && list.length > 0) {
            this.getCourseListByWeekday(list);
          }  
        }
        else {
          this.setData({
            courseList:null
          })
        }
      })
      .catch(rej => {
      });
  },
 
 /**
  * 按周天排列课程
  **/
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
   // console.log('weekdaylist', weekdayList);
  },
  // generatorCourseList: function(list) {
  //   let allList = [];
  //   const length = this.data.currentWeek.weekInfo.weeks.length;
  //   list.forEach((item) => {
  //     const courselist = item.courseSchedules;
  //     const weekIndex = Number(item.courseSchedules[0].schedule.weekday) - 1;
  //     const attendList = item.attendanceRecordList;
  //     this.getCourseAttendInfo(courselist, attendList);
  //     allList.push({
  //       time: patternDate(new Date(this.data.currentWeek.weekInfo.weeks[weekIndex]),"yyyy-MM-dd EEE"),
  //         content: item.content,
  //         courseList: item.courseSchedules.map((course, courseIndex) => {
  //           return {
  //             name: item.name,
  //             content: `第${course.schedule.index}节`,
  //             state: this.getState(attendList, courseIndex),
  //             id: course.courseId,
  //             stuIds: this.getIdList(attendList, courseIndex),
  //           }
  //         })
  //       })
  //   });
  //   this.setData({
  //     courseList: allList
  //   })
  //   // console.log(courseList);
  // },
  //处理课位和考勤信息，如果是两节联排则合到一起，再把考勤信息加入 
  // getCourseAttendInfo(courseList, attendList) {
  //   // 以下两步根据课程整合课位
  //   const newCourseList = groupByValue(courseList, 'courseId');
  //   const newAttendList = groupByValue(attendList, 'courseId');
  //   newCourseList.map((item) => {
  //     //item.valueList.sort
  //     //如果有考勤记录就整合，没有就忽略，认为未点名
  //     return {
  //       id: item.id,
  //       name: item.name,
  //       content: this.getScheduleText(),
  //       state: this.getState(),
  //       attendId:0
  //     }

  //   })
  //   console.log(newCourseList);
  // },
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
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    console.log('下拉了');
    return false;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    return false;
  },
  // getState(attendList, index) {
  //   let state = {
  //     text: '未点名',
  //     color: 'text-third' 
  //   };
  //   if (attendList && attendList.length && attendList.length > 0) {
  //     const courseInfo = attendList[index];
  //     if (courseInfo && courseInfo.absentStudents) {
  //       const count = courseInfo.absentStudents.length;
  //       if (count && count > 0) {
  //         state = {
  //           text: `缺勤${count}人`,
  //           color: 'text-red'
  //         };
  //       }else {
  //         state = {
  //           text: '满勤',
  //           color: 'text-blue'
  //         }
  //       }
  //     }
  //   } 
  //   return state;
  // },
  logout: function() {
    this.setData({
      userInfo: null
    })
    wx.removeStorageSync('accessInfo');
    wx.removeStorageSync('userInfo');
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})