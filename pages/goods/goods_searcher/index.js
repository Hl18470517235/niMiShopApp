import { getProductslist } from '../../../api/store.js';
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
    searchValue:'',
    focus:true,
    bastList:[],
    first: 0,
    limit: 15,
    page:1,
    loading:false,
    loadend:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
    let words = wx.getStorageSync('search_key_words')
    if (words.length) {
      let w = words.pop()
      this.setData({ searchValue: w });
      wx.showLoading({ title:'正在搜索中'});
      this.getProductList();
    }
  },
  set_where: function (e) {
    var dataset = e.currentTarget.dataset;
    let dt = {
      zhsort: 0,
      price: 0,
      stock: 0,
    }
    switch (dataset.type) {
      case '1':
        dt.zhsort = this.data.zhsort == 1 ? 2 : 1;
        break;
      case '2':
        dt.price = this.data.price == 1 ? 2 : 1;
        break;
      case '3':
        dt.stock = this.data.stock == 1 ? 2 : 1;
        break;
    }
    this.setData({
      loadend: false,
      zhsort: dt.zhsort,
      price: dt.price,
      stock: dt.stock,
      ['where.page']: 1
    });
    this.getProductList(true);
  },
  setWhere: function () {
    let data = {}
    if (this.data.price) {
      data.countSqu = 2
      data.countSquType = this.data.price
    }else if (this.data.stock) {
      data.countSqu = 1
      data.countSquType = this.data.stock
    }else if (this.data.zhsort) {
      data.countSqu = 3
      data.countSquType = this.data.zhsort
    }
    this.setData(data);
  },
  getProductList:function(isPage){
    var that = this;
    this.setWhere()
    if(this.data.loading) return;
    let data = {loading:true,loadTitle:'正在搜索'}
    if (isPage) {
      data.bastList = [];
      data.page = 1;
      data.loadend = false;
    }
    this.setData(data);
    if(this.data.loadend) return;
    getProductslist({
      sname: that.data.searchValue,
      pageNo: this.data.page,
      isFlag: 0,
      pageSize: this.data.limit,
      countSqu: that.data.countSqu,
      countSquType: that.data.countSquType
    }).then(res=>{
      wx.hideLoading();
      var list = res.pageInfo.list, loadend = list.length < that.data.limit;
      for(var itm of list) {
        itm.price = (itm.price / 100).toFixed(2)
        itm.shopPrice = (itm.shopPrice / 100).toFixed(2)
      }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }, 
  setValue: function (event){
    this.setData({ searchValue: event.detail.value});
  },
  searchBut:function(){
    var that = this;
    this.setData({ focus: false });
    if (that.data.searchValue.length > 0){
      that.setData({ page: 1, loadend: false, bastList:[]});
      wx.showLoading({ title:'正在搜索中'});
      that.saveWord()
      that.getProductList();
    }else{
      return app.Tips({
        title: '请输入要搜索的商品',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
    }
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
    this.getProductList(true)
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