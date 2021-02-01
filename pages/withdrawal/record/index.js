// pages/withdrawal/record/index.js
import {findUserQuotaList} from '../../../api/withdrawal.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    pageSize: 10,
    historyType: '',
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '提现记录',
      'class': '5',
    },
  },
  async findUserQuotaList() {
    const data = {
      historyType: this.data.historyType,
      pageNo: 1,
      pageSize: this.data.pageSize
    }
    let result = await findUserQuotaList(data)
    const detailList = result.pagelistBean.list
    this.setData({
      detailList
    })
  },
  action() {
    wx.navigateTo({
      url: '/pages/withdrawal/WithdrawOperation/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      historyType: options.type
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
    this.findUserQuotaList()
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
    this.setData({
      pageSize: 10
    })
    this.findUserQuotaList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pageSize: this.data.pageSize + 10
    })
    this.findUserQuotaList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})