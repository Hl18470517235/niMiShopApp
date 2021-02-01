import { orderProduct, orderComment} from '../../../api/order.js';


const app=getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '发表评价',
      'color': false,
    },
    scoreList:[
      { 'name': '商品评价','stars':0},
      { 'name': '配送包装','stars':0},
      { 'name': '配送员服务','stars':0},
    ],
    pics:[],
    orderId:'',
    unique:'',
    productInfo:{},
    cart_num:0,
    sended: 0
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.setData({productInfo: app.globalData.productToPing})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.productToPing) {
      return app.Tips({title:'缺少参数'},{tab:3,url:1});
    }
  },
  /**
   * 获取某个产品详情
   * 
  */
  getOrderProduct:function(){
    var that=this;
    orderProduct(that.data.unique).then(res=>{
      that.setData({ productInfo: res.data.productInfo, cart_num: res.data.cart_num });
    });
  },
  stars: function (e) {
    var index = e.target.dataset.index;
    var indexw = e.target.dataset.indexw;
    this.data.scoreList[indexw].stars = index
    this.setData({
      scoreList: this.data.scoreList
    })
  },

  /**
   * 删除图片
   * 
  */
  DelPic: function (e) {
    var index = e.target.dataset.index, that = this, pic = this.data.pics[index];
    that.data.pics.splice(index, 1);
    that.setData({ pics: that.data.pics });
  },

  /**
   * 上传文件
   * 
  */
  uploadpic: function () {
    var that = this;
    util.uploadImageOne('file/uploadFile', function (res) {
      that.data.pics.push(res.urlPath);
      that.setData({ pics: that.data.pics });
    });
  },

  /**
   * 立即评价
  */
  formSubmit:function(e){
    var formId = e.detail.formId, value = e.detail.value, that = this;
    if (!value.evaluateBody) return app.Tips({ title:'请填写你对宝贝的心得！'});
    value.evaluateCount01 = that.data.scoreList[0].stars;
    value.evaluateCount02 = that.data.scoreList[1].stars;
    value.evaluateCount03 = that.data.scoreList[2].stars;
    value.userCommentPhotos = that.data.pics;
    value.orderId = that.data.productInfo.orderId;
    value.productId = that.data.productInfo.productId;
    value.id = that.data.productInfo.id;
    wx.showLoading({ title: "正在发布评论……" });
    orderComment(value).then(res=>{
      wx.hideLoading();
      that.setData({sended: true});
    }).catch(err=>{
      wx.hideLoading();
      return app.Tips({ title: err });
    });
  },
  goIndex: function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goCommentPage: function(){
    wx.redirectTo({
      url: '/pages/goods/goods_comment_list/index?product_id=' + this.data.productInfo.productId,
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