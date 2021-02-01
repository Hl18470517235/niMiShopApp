// pages/other/stock/index.js
import {userFindShopShares} from '../../../api/order.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '股份分配',
      'color': false
    },
    dataList:[],
    pagesize:10
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    userFindShopShares({
      pageNo:1,
      pageSize:that.data.pagesize
    }).then(res => {
      var list = res.userFindShopSharesBeans
      that.setData({
        dataList:list
      })
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
    var that = this
    that.setData({
      pagesize:10
    })
    userFindShopShares({
      pageNo:1,
      pageSize:that.data.pagesize
    }).then(res => {
      var list = res.userFindShopSharesBeans
      that.setData({
        dataList:list
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.setData({
      pagesize:that.data.pagesize + 10
    })
    userFindShopShares({
      pageNo:1,
      pageSize:that.data.pagesize
    }).then(res => {
      var list = res.userFindShopSharesBeans
      that.setData({
        dataList:list
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})