
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商品清单',
      'color': false,
    },
    goods_list:[],
    count: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = wx.getStorageSync('confirm_goods_list')
    let count = 0
    for(var itm of list){
      itm.price = (itm.price / 100).toFixed(2)
      count += itm.num
    }
    this.setData({
      goods_list: list,
      count: count
    });
  }, 
  onPullDownRefresh: function(){
    app.loaded()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})