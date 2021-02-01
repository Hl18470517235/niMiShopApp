import {
  getPayment
} from '../../../api/order.js';
import { CACHE_USERINFO } from '../../../config.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1', 
      'title': '确认支付',
      'res':'1'
    },
    masModel:false,
    info: {},
    payType: '001',
    msg: [],
    showshop:true,
    paid_status: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onUnload: function () {
    var that = this
    if(that.data.showshop){
      app.globalData.shopModel = true
    }
  },
  onLoad: function (options) {
    let data = wx.getStorageSync('pay_info')
    console.log(data)
    data.yh = data.yh || '0.00'
    this.setData({
      info: data
    })
  },
  /**
   * 支付完成查询支付状态
   */
  toPay: function () {
    var that = this;
    var paytype = that.data.payType
    if (!paytype) {
      return app.Tips({
        title: '请选择支付方式'
      })
    }
    wx.showLoading({
      title: '正在加载中'
    });
    let data = {
      paymentType: paytype,
      orderId: that.data.info.ids,
      tpamAcctNo: app.globalData.openid,
      type: 1,
      paymentSonType: 'JSAPI'
    }
    getPayment(data).then(res => {
      if(res.paymentInfo == 'success') {
        wx.hideLoading();
        that.setData({
          showshop:false
        })
        that.paySuccess('订单支付成功，感谢您的光顾')
      } else {
      wx.hideLoading();
      switch (paytype) {
        case '001':
          if (!res.paymentInfo){
            return that.payFail(['缺少支付参数'])
          }
          var jsConfig = JSON.parse(res.paymentInfo);
          wx.requestPayment({
            timeStamp: jsConfig.timeStamp,
            nonceStr: jsConfig.nonceStr,
            package: jsConfig.package,
            signType: jsConfig.signType,
            paySign: jsConfig.sgin,
            success: function (res) {
              wx.hideLoading();
              that.setData({
                showshop:false
              })
              that.paySuccess('订单支付成功，感谢您的光顾')
            },
            fail: function (e) {
              wx.hideLoading();
              //显示失败页
            },
            complete: function (e) {
              wx.hideLoading();
              if (e.errMsg == 'requestPayment:cancel') {
                //显示失败页
              }
            },
          });
          break;
        }
      }
    }).catch(err => {
      wx.hideLoading();
      //显示结果页
    });
  },
  leftAction:function(){
    wx.navigateBack()
  },
  yesAction:function(){
    this.setData({
      masModel:false
    })
    wx.navigateBack()
  },
  typeChange: function (e) {
    var value = e.detail.value
    var type = value.pop()
    this.setData({
      payType: type
    })
  },
  paySuccess: function (info) {
    this.setData({
      paid_status: 1,
      msg: [info]
    });
  },
  payFail: function (msg) {
    this.setData({
      paid_status: 2,
      msg: msg
    });
  },
  viewOrderList: function (e) {
    wx.redirectTo({
      url: '/pages/order/order_list/index?status=2',
    })
  },
  buyMore: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  payAgain: function () {
    this.setData({paid_status: 0})
  },
  onPullDownRefresh: function(){
    app.loaded()
  },
  onShow: function () {
    this.setData({
      showshop:true
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})