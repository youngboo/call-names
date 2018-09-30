// component/names/names.js
import { getValueListFromArray, patternDate } from '../../utils/util.js'
import { updateAttendance } from '../../service/course.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    studentsList:null,
    courseInfo: null,
    attendCount: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    attendCount: 0,
    showTopTips: false,
    errorMessage: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapName: function (e) {
      console.log('点名了', e);
      const index = e.currentTarget.dataset.index;
      let checked = this.data.studentsList[index].checked;
      this.data.studentsList[index].checked = !checked;
      const checkedList = this.data.studentsList.filter((item) => {
        return item.checked;
      })
      this.setData({
        studentsList: this.data.studentsList,
        attendCount: checkedList.length
      })
    },
    showWarningMsg: function(msg) {
      this.setData({
        showTopTips: true,
        errorMessage: msg
      });
      const that = this;
      setTimeout(function () {
        that.setData({
          showTopTips: false,
          errorMessage: null
        });
      }, 3000);

    },
    submitNames: function (e) {
      wx.showModal({
        title: '提交点名结果',
        content: '提交40分钟内可修改',
        confirmColor: '#5997FA',
        cancelColor: '#5997FA',
        success: (b) => {
          if (b.confirm) {
            this.submit();
          }else {
            return false;
          }
        }
      })

    },
    submit: function () {
      let attendId = undefined;
      let courseDate = patternDate(new Date(this.properties.courseInfo.date), 'yyyy-MM-dd HH:mm:ss');
      const attend = this.properties.courseInfo.attend; 
      if (attend) {
        attendId = this.properties.courseInfo.attend.id;
        courseDate = this.properties.courseInfo.attend.courseDate;

      }
      const list = this.data.studentsList;
      const submitList = list.filter((item) => {
        return !item.checked;
      })
      const courseId = this.properties.courseInfo.courseId;
      const idList = getValueListFromArray(submitList, 'id');
      const self = this;
      updateAttendance({
        courseId: courseId,
        studentIdList: idList,
        attendanceRecordId: attendId ? attendId : undefined,
        courseDate: courseDate
      })
        .then((res) => {
          console.log('提交返回数据', res);
          if(!res.data.success && res.data.error) {
            // wx.showToast({
            //   title: res.data.error.message,
            //   icon: 'none',
            //   duration: 3000
            // });
            this.showWarningMsg(res.data.error.message);
          }else {
            this.triggerEvent('backEvent', { showNames: false });
          }
          // wx.redirectTo({
          //   url: '/pages/userInfo/userInfo',
          // })
        })
    },
    backIndex: function(e) {
      this.triggerEvent('backEvent', {showNames: false});
    }
  }
})
