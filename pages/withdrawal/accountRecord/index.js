// pages/withdrawal/record/index.js
import {findUserCheckGoldList} from '../../../api/withdrawal.js'
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
      'title': '到账记录',
      'color': true,
      'class': '5',
    },
  },
  async findUserCheckGoldList() {
    const data = {
      userQuotaType: this.data.historyType,
      userId: '82020050823175164708599591624519',
      pageNo: 1,
      pageSize: this.data.pageSize
    }
    let result = await findUserCheckGoldList(data)
    const detailList = result.liseBean.list
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
    this.findUserCheckGoldList()
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

  }
})