// component/course-list/course-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataSource: []
    // [
    //    {
    //     time: '2018-10-01 周一',
    //     content: '',
    //     courseList:[
    //       { name: '课程名1', content: '第4节', state: 1, id: 1 },
    //       { 
    //         name: '课程名1', 
    //         content: '第5节',
    //         state: 0,
    //         id: 2

    //       },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名1', content: '周一课程。。。。。。。。。' },
    //       // { name: '课程名2', content: '周二课程。。。。。。。。。' }
    //     ]
    //    },
    //   {
    //     time: '2018-10-02 周二',
    //     content: '',
    //     courseList: [
    //       { name: '课程名3', content: '周一课程。。。。。。。。。' },
    //       { name: '课程名4', content: '周二课程。。。。。。。。。' }
    //     ]
    //   }
      
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapCourse: function (e) {
      console.log('点击了', e);
      var myEventDetail = {
        id: e.currentTarget.id
      } // detail对象，提供给事件监听函数
      this.triggerEvent('tapEvent', myEventDetail);
    }
  }
})
