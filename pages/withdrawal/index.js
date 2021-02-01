// pages/withdrawal/index.js
import {findByUSerId} from '../../api/withdrawal.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '我的钱包',
      'color': true,
      'class': '5',
    },
    userQuotaBean: {}
  },
async findByUSerId() {
  const data = {
    userId: app.globalData.token
  }
  let result = await findByUSerId(data)
  const userQuotaBean = result.userQuotaBean
  this.setData({
    userQuotaBean
  })
},
txaction(e) {
  const type = e.currentTarget.dataset.value
  wx.navigateTo({
    url: '/pages/withdrawal/record/index?type=' + type,
  })
},
dzaction(e) {
  const type = e.currentTarget.dataset.value
  wx.navigateTo({
    url: '/pages/withdrawal/accountRecord/index?type=' + type,
  })
},
action(e) {
  const type = e.currentTarget.dataset.type
  wx.navigateTo({
    url: '/pages/withdrawal/WithdrawOperation/index?type=' + type,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findByUSerId()
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