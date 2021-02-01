import { findNoticeList} from '../../../api/api.js';
import wxParse from '../../../wxParse/wxParse.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '平台公告',
      'color': false
    },
    articleList:[],
    loaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCidArticle();
  },
  getCidArticle: function () {
    var that = this;
    findNoticeList().then(res=>{
      that.setData({
        articleList: res.adverType3,
        loaded: true
      });
    });
  },

  showBody: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let notice = that.data.articleList[index]
    app.globalData.notice = notice
    wx.navigateTo({
      url: '/pages/other/notice_info/index',
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
    app.globalData.notice = {}
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