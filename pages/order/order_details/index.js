import {
  getOrderDetail,
  orderPay,
  orderAgain,
  orderTake,
  orderDel
} from '../../../api/order.js';
import {
  openOrderRefundSubscribe
} from '../../../utils/SubscribeMessage.js';
import {
  getUserInfo
} from '../../../api/user.js'; 

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单详情',
      'color': true,
      'class': '0'
      // 'class': '2' 顶部为灰色
    },
    order_id: '',
    evaluate: 0,
    cartInfo: [], //购物车产品
    orderInfo: {
      system_store: {}
    }, //订单详情
    system_store: {},
    isGoodsReturn: false, //是否为退款订单
    status: {}, //订单底部按钮状态
    isClose: false,
    payMode: [{
        name: "微信支付",
        icon: "icon-weixinzhifu",
        value: 'weixin',
        title: '微信快捷支付'
      },
      {
        name: "余额支付",
        icon: "icon-yuezhifu",
        value: 'yue',
        title: '可用余额:',
        number: 0
      },
    ],
    pay_close: false,
    pay_order_id: '',
    totalPrice: '0',
    codeViewerHidden: true,
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.order_id) this.setData({
      order_id: options.order_id
    });
    if (options.isReturen) {
      this.setData({
        'parameter.class': '2',
        isGoodsReturn: true
      });
      this.selectComponent('#navbar').setClass();
    }
  },
  callPhone(e){
    var phone = e.currentTarget.dataset.s;
    wx.makePhoneCall({
      phoneNumber: phone
    })
},
  showMap: function (e) {
    let lat = parseFloat(e.currentTarget.dataset.lat) 
    let lng = parseFloat(e.currentTarget.dataset.lng) 
    if(e.currentTarget.dataset.lat == null ){
      return app.Tips({
        title: '该商家未设置坐标！'
      })         
    }else{
      wx.openLocation({
        latitude: lat,
        longitude: lng, 
      })
    }
  },
  openSubcribe: function (e) {
    let page = e.currentTarget.dataset.url;
    wx.showLoading({
      title: '正在加载',
    })
    openOrderRefundSubscribe().then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: page,
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  /**
   * 事件回调
   * 
   */
  onChangeFun: function (e) {
    let opt = e.detail;
    let action = opt.action || null;
    let value = opt.value != undefined ? opt.value : null;
    (action && this[action]) && this[action](value);
  },
  /**
   * 拨打电话
   */
  makePhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.phoneNo
    })
  },
  /**
   * 打开地图
   * 
   */
  showMaoLocation: function () {
    if (!this.data.system_store.latitude || !this.data.system_store.longitude) return app.Tips({
      title: '缺少经纬度信息无法查看地图！'
    });
    wx.openLocation({
      latitude: parseFloat(this.data.system_store.latitude),
      longitude: parseFloat(this.data.system_store.longitude),
      scale: 8,
      name: this.data.system_store.name,
      address: this.data.system_store.address + this.data.system_store.detailed_address,
      success: function () {

      },
    });
  },
  /**
   * 去支付
   * 
   */
  goPay: function (e) {
    let order = this.data.orderInfo;
    let data = {
      amt: order.actualPay,
      ids: [order.orderId]
    }
    wx.setStorageSync('pay_info', data)
    wx.navigateTo({
      url: '/pages/order/order_pay/index'
    })
  },
  /**
   * 登录授权回调
   * 
   */
  onLoadFun: function () {
    this.getOrderInfo();
  },
  /**
   * 获取订单详细信息
   * 
   */
  getOrderInfo: function () {
    var that = this;
    app.loading()
    getOrderDetail(this.data.order_id).then(res => {
      app.loaded()
      let info = res.orderInfoBean
      for (var itm of info.orderDetails) {
        itm.price = (itm.price / 100).toFixed(2)
        itm.ownSpec = JSON.parse(itm.ownSpec)
      } 
      info.discount = ((info.totalPay + info.postFee - info.actualPay) / 100).toFixed(2)
      info.totalPay = (info.totalPay / 100).toFixed(2)
      info.postFee = (info.postFee / 100).toFixed(2)
      //info.postFee = ((info.actualPay - info.totalPay) / 100).toFixed(2)
      info.actualPay = (info.actualPay / 100).toFixed(2)
      info.allLimit = (info.allLimit / 10).toFixed(2)
      if (info.paymentTime) {
        info.paymentTime = info.paymentTime.substr(0, 19).replace('T', ' ')
      }
      if (info.endTime) {
        info.endTime = info.endTime.substr(0, 19).replace('T', ' ')
      }
      if (info.closeTime) {
        info.closeTime = info.closeTime.substr(0, 19).replace('T', ' ')
      }
      that.setData({
        orderInfo: info
      });
    }).catch(err => {
      app.loaded()
      app.Tips({
        title: err
      });
      wx.navigateBack();
    });
  },
  /**
   * 
   * 剪切订单号
   */
  copy: function () {
    wx.setClipboardData({
      data: this.data.orderInfo.orderId
    });
  },
  confirmOrder: function () {
    var that = this;
    wx.showModal({
      title: '确认收货',
      content: '为保障权益，请收到货确认无误后，再确认收货',
      success: function (res) {
        if (res.confirm) {
          orderTake(that.data.orderInfo.orderId).then(res => {
            return app.Tips({
              title: '操作成功',
              icon: 'success'
            }, function () {
              that.getOrderInfo();
            });
          }).catch(err => {
            return app.Tips({
              title: err
            });
          })
        }
      }
    })
  },
  /**
   * 
   * 删除订单
   */
  delOrder: function () {
    var that = this;
    orderDel(this.data.order_id).then(res => {
      return app.Tips({
        title: '删除成功',
        icon: 'success'
      }, {
        tab: 3,
        url: 1
      });
    }).catch(err => {
      return app.Tips({
        title: err
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog && this.data.isClose) {
      this.getOrderInfo();
    }
  },
  showCode:function(e){
    var that=this;
    var code = e.currentTarget.dataset.code;
    that.setData({codeViewerHidden: false, code: code})
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isClose: true
    });
  },
  onPullDownRefresh: function(){
    if (app.globalData.isLog) {
      this.getOrderInfo();
    }
  },    
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})