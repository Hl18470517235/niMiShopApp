
import { findTiHuoShop} from '../../../api/order.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单备注'
    },
    content: '',
    state: 1,
    sid: 0
  },
  onLoadFun:function(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      sid: options.sid
    }
    let msg = wx.getStorageSync('order_beizhu')
    if (msg && msg.content) {
      data.content = msg.content
      data.state = 2
    }
    this.setData(data)
  },
  onPullDownRefresh: function(){
    app.loaded()
  },
  sel: function(e) {
    let state = e.currentTarget.dataset.state;
    this.setData({
      state: state
    })
  },
  setValue: function (event){
    this.setData({ content: event.detail.value});
  },
  add: function(){
    let data = {
      content: this.data.content,
      sid: this.data.sid
    }
    wx.setStorageSync('order_beizhu', data)
    wx.navigateBack()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})