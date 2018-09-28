// component/week-selector/week-selector.js
import { getWeeks } from '../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: null
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    lastWeek: function() {
      this.triggerEvent('changeWeek', {option: -1});
    },
    nextWeek: function() {
      this.triggerEvent('changeWeek', { option: 1 });
    }
  }
})
