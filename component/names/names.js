// component/names/names.js
import { getValueListFromArray, patternDate } from '../../utils/util.js';
import { updateAttendance } from '../../service/course.js';
import { G_CONFIG } from '../../config/GlobalConfig.js';
const OVER_TIME = G_CONFIG.OVER_TIME;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    studentsList:null,
    courseInfo: null,
    attendCount: null,
    overTime: null,
    defaultList: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    attendCount: 0,
    showTopTips: false,
    errorMessage: `点名已超过${OVER_TIME}分钟，无法再修改！`,
    modify: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapName: function (e) {
      if (this.properties.overTime) {
        return false;
      }
      const index = e.currentTarget.dataset.index;
      let checked = this.data.studentsList[index].checked;
      this.data.studentsList[index].checked = !checked;
      const checkedList = this.data.studentsList.filter((item) => {
        return item.checked;
      })
      this.setData({
        studentsList: this.data.studentsList,
        attendCount: checkedList.length,
        modify: true
      })
    },
    showWarningMsg: function(msg) {
      this.setData({
        overTime: true,
        errorMessage: msg
      });
    },
    getModifyUserId: function(attend) {
      let modifyUserId;
      if (attend.creatorUserId && attend.creatorUserId > 0) {
        modifyUserId = attend.creatorUserId;
      }
      if (attend.lastModifierUserId && attend.lastModifierUserId > 0) {
        modifyUserId = attend.lastModifierUserId;
      }
      return modifyUserId;
    },
    submitNames: function (e) {
      const userInfo = wx.getStorageSync('userInfo');
      if (!userInfo) {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
      
      let confirmText ={
        title: '您确认要提交吗？',
        content: `提交后${OVER_TIME}分钟内可修改`
      } ;
      const {attend} = this.properties.courseInfo;
      if (attend) {
        const modifyUserId = this.getModifyUserId(attend);
        if (modifyUserId !== userInfo.id) {
          confirmText = {
            title: '其他老师已点名！',
            content: '是否确认修改?'
          }
        } else {
          confirmText = {
            title: '您确认要更新吗？',
            content: ''
          }
        }
      }
      wx.showModal({
        title: confirmText.title,
        content: confirmText.content,
        confirmColor: '#5997FA',
        cancelColor: '#5997FA',
        success: (b) => {
          if (b.confirm) {
              if (attend && !this.isModify()) {
                this.triggerEvent('backEvent', { showNames: false, reload: false });
                return;
              }
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
      console.log('提交日期', courseDate);
      updateAttendance({
        courseId: courseId,
        studentIdList: idList,
        attendanceRecordId: attendId ? attendId : undefined,
        courseDate: courseDate
      })
        .then((res) => {
          if(!res.data.success && res.data.error) {
            // wx.showToast({
            //   title: res.data.error.message,
            //   icon: 'none',
            //   duration: 3000
            // });
            this.showWarningMsg(res.data.error.message);
          }else {
            this.triggerEvent('backEvent', { showNames: false, reload: true});
          }
          // wx.redirectTo({
          //   url: '/pages/userInfo/userInfo',
          // })
        })
    },
    isModify: function() {
      let flag = false;
      let defaultList = this.data.defaultList.filter((item) => {
        return item.checked;
      })
      defaultList = getValueListFromArray(defaultList, 'id');
      let modifyList = this.data.studentsList.filter((item) => {
        return item.checked;
      })
      modifyList = getValueListFromArray(modifyList, 'id');
      if (defaultList.length != modifyList.length) {
        flag = true;
        return flag;
      }
      for (let i = 0; i < defaultList.length; i++) {
        if (modifyList.indexOf(defaultList[i]) < 0) {
          flag = true;
          return flag;
        }
      }
      return flag;    
    },
    backIndex: function(e) {
      if (this.data.overTime || !this.isModify()) {
        this.triggerEvent('backEvent', { showNames: false, reload: false });
      }else {
        wx.showModal({
          title: '您确认要返回吗？',
          content: '点名记录将丢失！',
          confirmColor: '#5997FA',
          cancelColor: '#5997FA',
          success: (b) => {
            if (b.confirm) {
              this.triggerEvent('backEvent', { showNames: false, reload: false });
            } else {
              return false;
            }
          }
        })
      }
    }
  }
})
