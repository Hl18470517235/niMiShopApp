import { getSearchKeyword, getProductslist, getProductHot} from '../../../api/store.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '搜索',
    },
    host_product:[],
    searchValue:'',
    focus:true,
    bastList:[],
    hotSearchList:[],
    first: 0,
    limit: 8,
    page:1,
    loading:false,
    loadend:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getRoutineHotSearch: function () {
    var that = this;
    getSearchKeyword().then(res=>{
      that.setData({ hotSearchList: res.data });
    });
  },
  getProductList:function(){
    var that = this;
    if(this.data.loading) return;
    if(this.data.loadend) return;
    this.setData({loading:true,loadTitle:'正在搜索'});
    getProductslist({
      keyword: that.data.searchValue,
      page: this.data.page,
      limit: this.data.limit
    }).then(res=>{
      console.log(res)
      wx.hideLoading();
      var list = res.data, loadend = list.length < that.data.limit;
      that.data.bastList = app.SplitArray(list, that.data.bastList);
      that.setData({
        bastList: that.data.bastList,
        loading: false,
        loadend: loadend,
        page: that.data.page + 1,
        loadTitle: loadend ? '已全部加载' : '加载更多',
      });
    }).catch(err=>{
      wx.hideLoading();
      that.setData({ loading: false, loadTitle: "加载更多" });
    });
  },
  getHostProduct: function () {
    var that = this;
    getProductHot().then(res=>{
      for(var itm of res.uproductInfoBeanList){
        itm.price = (itm.price / 100).toFixed(2)
        itm.shopPrice = (itm.shopPrice / 100).toFixed(2)
      }
      that.setData({ host_product: res.uproductInfoBeanList });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }, 
  setHotSearchValue: function (event) {
    this.setData({ searchValue: event.currentTarget.dataset.item });
    this.saveWord()
    wx.redirectTo({
      url: '/pages/goods/goods_searcher/index',
    })
  },
  setValue: function (event){
    this.setData({ searchValue: event.detail.value});
  },
  saveWord: function () {
    let words = wx.getStorageSync('search_key_words')
    let value = this.data.searchValue
    if (!words) words = []
    for(var i in words) {
      var w = words[i]
      if (w == value) {
        words.splice(i, 1)
      }
    }
    words.push(value)
    wx.setStorageSync('search_key_words', words)
  },
  searchBut:function(){
    var that = this;
    this.setData({ focus: false });
    if (that.data.searchValue.length > 0){
      that.saveWord()
      wx.redirectTo({
        url: '/pages/goods/goods_searcher/index',
      })
    }else{
      return app.Tips({
        title: '请输入要搜索的商品',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
    }
  },
  goCart: function() {
    wx.switchTab({
      url: '/pages/order_addcart/order_addcart',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getRoutineHotSearch();
    this.getHostProduct();
    let words = wx.getStorageSync('search_key_words')
    if (words.length < 1) {
      words.push('大米')
    }
    this.setData({ hotSearchList: words });
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
    this.getHostProduct()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getProductList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }

})