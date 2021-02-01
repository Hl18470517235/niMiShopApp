// pages/withdrawal/WithdrawOperation/index.js
import {createWithdraw, reconciliationSq} from '../../../api/withdrawal.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '提现',
      'color': true,
      'class': '5',
      withdrawType: '1',
      txtype: '1',
      price: '',
      corporateName: '',
      bankType: 2,
      bankName: '',
      bankAccountNum: '',
      realName: ''
    },
  },
  async reconciliationSq() {
    const data = {
      userId: app.globalData.token,
      bankName: this.data.bankName,
      corporateName: this.data.corporateName,
      price: this.data.price,
      bankAccountNum: this.data.bankAccountNum,
    }
    let result = await reconciliationSq(data)
    wx.navigateBack({
      delta: 2,
    });
  },
  async createWithdraw() {
    const data = {
      userId: app.globalData.token,
      withdrawCurrencyType: '1',
      withdrawType: this.data.withdrawType,
      realName: this.data.realName,
      price: this.data.price,
      bankAccountNum: this.data.bankAccountNum,
    }
    let result = await createWithdraw(data)
    wx.navigateBack({
      delta: 2,
    });
  },
  bankNameInput(e) {
    this.setData({
      bankName: e.detail.value
    })
  },
  radioChange(e) {
    this.setData({
      withdrawType: e.detail.value,
      bankAccountNum: '',
      realName: ''
    })
  },
  nameInput(e) {
    this.setData({
      realName: e.detail.value
    })
  },
  Input(e) {
    this.setData({
      price: e.detail.value
    })
  },
  bankInput(e) {
    this.setData({
      bankAccountNum: e.detail.value
    })
  },
  fromAction() {
    if(this.data.txtype == 1) {
      this.createWithdraw()
    } else {
      this.reconciliationSq()
    }
  },
  corporateNameInput(e) {
    this.setData({
      corporateName: e.detail.value
    })
  },
  bankradioChange(e) {
    this.setData({
      bankName: '',
      corporateName: '',
      price: '',
      bankAccountNum: '',
      bankType: e.detail.value
    })
    console.log(this.data.bankType)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      txtype: options.type
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