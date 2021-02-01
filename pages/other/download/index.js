import wxParse from '../../../wxParse/wxParse.js';
import { findProtocol } from '../../../api/api.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': 'APP下载提示',
      'color': true,
      'class': '0'
    },
    url: 'https://yjlc.yijialianchuang.com/regist/success.html',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  copy:function(){
    wx.setClipboardData({data: this.data.url});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getArticleOne();
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
  onPullDownRefresh: function(){
    app.loaded()
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
    return getApp().shareData();
  }
})