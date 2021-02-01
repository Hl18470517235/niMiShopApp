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
      'title': '',
      'color': true,
      'class': '0'
    },
    id:0,
    articleInfo:[],
    store_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty('id')){
      this.setData({ 'parameter.title': options.id});
    }else{
      wx.navigateBack({delta: 1 });
      return
    }
    let that = this
    findProtocol(options.id).then(res => {
      if (res.protocolList.length < 1) {
        return
      }
      let data = res.protocolList[0]
      that.setData({title: data.mainTitle});
      let content = data.textContent.replace(/\n/g, "<br/>");
      wxParse.wxParse('content', 'html', content, that, 0);
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