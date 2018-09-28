// component/user-center/user-center.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapCourse: (e, detail) => {
      console.log("父组件接受了事件", e);
      wx.navigateTo({
        url: `/pages/names/names?id=${e.detail.id}`,
      })
    },
  }
})
