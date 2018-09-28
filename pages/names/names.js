// pages/names/names.js
import { getStudentsList } from '../../service/course.js'
import { getValueListFromArray } from '../../utils/util.js'
import { updateAttendance } from '../../service/course.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('names页面加载', options);

    getStudentsList({
      id: options.id
    })
      .then((res) => {
        if (res.data.result.totalCount > 0) {
          console.log(res.data.result);
          const list = res.data.result.items.map((item) => {
            return {
              id: item.id,
              fullName: item.user.fullName,
              classInfo: item.class.enterSchoolYear + '届',
              checked: true
            }
          })
          this.setData({
            studentsList: list,
            courseId: options.id
          })
        }
      })
  },
  tapName: function(e) {
    console.log('点名了', e);
    const index = e.currentTarget.dataset.index;
    let checked = this.data.studentsList[index].checked 
    this.data.studentsList[index].checked = !checked;
    this.setData({
      studentsList: this.data.studentsList
    })
  },
  submitNames: function(e) {
    wx.showModal({
      title: '提交点名结果',
      content: '提交40分钟内可修改',
      success: () => {
        this.submit();
      }
    })

  },
  submit: function() {
    const list = this.data.studentsList;
    const submitList = list.filter((item) => {
      return !item.checked;
    })
    const idList = getValueListFromArray(submitList, 'id');
    //console.log(idList);
    updateAttendance({
      courseId: this.data.courseId,
      studentIdList: idList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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