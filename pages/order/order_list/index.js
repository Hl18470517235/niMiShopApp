import { getOrderList, orderTake, orderCancel, orderDel, orderPay, getThreeDw, queryWxOrderState } from '../../../api/order.js';
import { openOrderSubscribe } from '../../../utils/SubscribeMessage.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1', 
      'return': '1',
      'title': '我的订单',
      'color': true,
      'class': '0'
    },
    loading:false,//是否加载中
    loadend:false,//是否加载完毕
    loadTitle:'加载更多',//提示语
    orderList:[],//订单数组
    orderData:{},//订单详细统计
    orderStatus:0,//订单状态
    page:1,
    limit:10,
    orderId:'',
    isClose:false,
    timer: null,
    orderStateId: '',
    payMode:[
      { name: "微信支付", icon: "icon-weixinzhifu", value: 'weixin', title: '微信快捷支付' },
      //{ name: "余额支付", icon: "icon-yuezhifu", value: 'yue', title: '可用余额:',number:0},
    ],
    pay_close:false,
    pay_order_id:'',
    totalPrice:'0',
    codeViewerHidden: true,
    code: '',
  },
  onClose() {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    })
    app.globalData.timeModel = true
  },
  async queryWxOrderState() {
    const data = {
      orderId: this.data.orderStateId
    }
    let result = await queryWxOrderState(data)
    if(result.status == '4') {
      clearInterval(this.data.timer);
      this.setData({
        timer: null
      })
      app.globalData.timeModel = true
      var status = '4';
      if (status == this.data.orderStatus) return;
      this.setData({ codeViewerHidden: true, orderStatus: status, loadend: false, page: 1, orderList:[]});
      this.getOrderList();
    }
  },
  /**
   * 登录回调
   * 
  */
  onLoadFun:function(){
    this.getOrderData();
    this.getOrderList();
  },
  /**
   * 事件回调
   * 
  */
  onChangeFun:function(e){
    let opt = e.detail;
    let action = opt.action || null;
    let value = opt.value != undefined ? opt.value : null;
    (action && this[action]) && this[action](value);
  },
  /**
   * 关闭支付组件
   * 
  */
  pay_close:function(){
    this.setData({ pay_close:false});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      navH: app.globalData.navHeight,
      'parameter.return': options.is_return ? '0' : '1'
    }
    if (options.status) data.orderStatus = options.status
    this.setData(data);
  },
  /**
   * 获取订单统计数据
   * 
  */
  getOrderData:function(){
    // var that=this;
    // orderData().then(res=>{
    //   that.setData({ orderData: res.data });
    // })
  },
  /**
   * 取消订单
   * 
  */
  cancelOrder:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    var index = e.currentTarget.dataset.index,that=this;
    if (!order_id) return app.Tips({title:'缺少订单号无法取消订单'});
    orderCancel(order_id).then(res=>{
      this.getOrderList(true)
      return app.Tips({ title: res.updateOrderStatusInfo});
    }).catch(err=>{
      return app.Tips({title:err});
    });
  },
  /**
   * 去支付
   * 
  */
  goPay:function(e){
    var index = e.currentTarget.dataset.index;
    var order = this.data.orderList[index]
    if (!order) return app.Tips({ title: '系统异常' });
    let data = {
      amt:order.actualPay, 
      ids:[order.orderId]
    }
    wx.setStorageSync('pay_info', data)
    wx.navigateTo({ url: '/pages/order/order_pay/index'})
  },

  // 获取订单位置骑手信息
  getHorseMan:function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/order/ordermap/index?orderId='+order_id
    })
  },
  /**
   * 去订单详情
  */
  goOrderDetails:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    if (!order_id) return app.Tips({ title: '缺少订单号无法查看订单详情' });
    wx.navigateTo({ url: '/pages/order/order_details/index?order_id=' + order_id })
  },
  ping: function(e){
    var index = e.currentTarget.dataset.ord;
    var pindex = e.currentTarget.dataset.pro;
    var order = this.data.orderList[index]
    var product = order.appOrderDetailBean[pindex]
    product.orderId = order.orderId;
    app.globalData.productToPing = product;
    wx.navigateTo({
      url: '/pages/goods/goods_comment_con/index',
    })
  },
  /**
   * 切换类型
  */
  statusClick:function(e){
    var status = e.currentTarget.dataset.status;
    if (status == this.data.orderStatus) return;
    this.setData({ orderStatus: status, loadend: false, page: 1, orderList:[]});
    this.getOrderList();
  },
  /**
   * 获取订单列表
  */
  getOrderList:function(isPage){
    var that=this;
    if (that.data.loaded || that.data.loading) return
    let dts = {
      loading: true,
    }
    if (isPage === true) {
      dts.orderList = []
      dts.page = 1
      dts.loaded = false
    }
    that.setData(dts);
    getOrderList({
      status: that.data.orderStatus ? that.data.orderStatus : 'All',
      pageNo: that.data.page,
      pageSize: that.data.limit,
    }).then(res=>{
      var list = res.appOrderBean.list || [];
      for(var item of list){
        var totalNum = 0
        for(var pro of item.appOrderDetailBean){
          pro.price = (pro.price / 100).toFixed(2);
          pro.ownSpec = JSON.parse(pro.ownSpec)
          totalNum += pro.num
        }
        item.totalPay = (item.totalPay / 100).toFixed(2);
        item.postFee = (item.postFee / 100).toFixed(2);
        item.actualPay = (item.actualPay / 100).toFixed(2);
        item.totalNum = totalNum
      }
      var loadend = list.length < that.data.limit;
      that.data.orderList = app.SplitArray(list, that.data.orderList);
      that.setData({
        orderList: that.data.orderList,
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? "我也是有底线的" : '加载更多',
        page: that.data.page + 1,
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: "加载更多" });
    })
  },

  /**
   * 删除订单
  */
  delOrder:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    var index = e.currentTarget.dataset.index, that = this;
    orderDel(order_id).then(res=>{
      that.data.orderList.splice(index, 1);
      that.setData({ orderList: that.data.orderList, 'orderData.unpaid_count': that.data.orderData.unpaid_count - 1 });
      that.getOrderData();
      return app.Tips({ title: '删除成功', icon: 'success' });
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  myInterval() {
    app.globalData.timeModel = false
    this.queryWxOrderState()
  },
  showCode:function(e){
    var orderId = e.currentTarget.dataset.order_id
    this.setData({
      orderStateId: orderId
    })
    this.setData({
      timer: setInterval(() => {
				this.myInterval()
			}, 3000)
    })
    var that=this;
    var index = e.currentTarget.dataset.index;
    var order = this.data.orderList[index];
    that.setData({codeViewerHidden: false, code: order.getId})
  },
  confirmOrder:function(e){
    var that=this;
    var index = e.currentTarget.dataset.index;
    var order = this.data.orderList[index]
    if (!order) return app.Tips({ title: '系统异常' });
    wx.showModal({
      title: '确认收货',
      content: '为保障权益，请收到货确认无误后，再确认收货',
      success: function (res) {
        if (res.confirm) {
          orderTake(order.orderId).then(res=>{
            return app.Tips({ title: '操作成功', icon: 'success' }, function () {
              that.getOrderList(true);
            });
          }).catch(err=>{
            return app.Tips({title:err});
          })
        }
      }
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
    app.globalData.shopModel = false
    if (app.globalData.isLog && this.data.isClose){
      //this.getOrderData();
      //this.setData({ loadend: false, page: 1, orderList:[]});
      this.getOrderList(true);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose:true});
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //clearInterval(time)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})