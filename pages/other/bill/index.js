
// pages/other/bill/index.js
import {findUserOrder,findUserOrderDetail} from '../../../api/order.js'
var gettime = require('../../../utils/time.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '账单详情',
      'color': false
    },
    navIndex:1, //tab切换
    orderPageSize:10, // 订单记录翻页
    orderNum:0, // 订单统计数量
    proNum:0, // 订单统计商品数量
    allprice:0, // 订单消费统计
    orderList:[] // 订单列表
  },
  statusClick(e){
    var that = this
    that.setData({
      navIndex:e.currentTarget.dataset.status
    })
    this.getOrder()
    this.getOrderDetail()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getOrder:function(){
    var that = this
    findUserOrder({
      type:that.data.navIndex,
    }).then(res => {
      that.setData({
        orderNum:res.orderTotal,
        proNum:res.productTotal,
        allprice:((res.priceTotal)/100).toFixed(2)
      })
    })
  },
  getOrderDetail:function() {
    var that = this
    findUserOrderDetail({
      type:that.data.navIndex,
      pageNo:1,
      pageSize:that.data.orderPageSize
    }).then(res => {
      var list = res.productTotalBeans
      for(var item of list) {
        item.price = ((item.price)/100).toFixed(2)
        item.payTime = gettime.formatDatealall(item.payTime)
      }
      that.setData({
        orderList:list,
        orderTotal:res.total
      })
    })
  },
  onLoad: function (options) {
    this.getOrder()
    this.getOrderDetail()
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
      orderPageSize:10
    })
    this.getOrder()
    this.getOrderDetail()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.setData({
      orderPageSize:that.data.orderPageSize + 10
    })
    this.getOrderDetail()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})