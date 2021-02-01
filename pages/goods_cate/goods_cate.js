import {
  getCategoryList,
  getProductslist
} from '../../api/store.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navlist: [],
    productList: [],
    categories: [],
    categories2: [],
    categories3: [],
    fstActive: 0,
    navActive: 0,
    thdActive: 0,
    category: {},
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '分类'
    },
    pageNo: 1,
    pageSize: 10,
    navH: "",
    number: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //设置商品列表高度
    wx.getSystemInfo({
      success: function (res) {
        //高度为窗口高度 - 导航高度 - 顶级分类栏高度 - 滚动栏外的padding
        let h = (res.windowHeight) * (750 / res.windowWidth) - 172 - app.globalData.navHeight
        that.setData({
          height: h,
          height1: h,
          height2: h - 44
        })
      },
    });
    this.getAllCategory();
  },
  tap: function (e) {
    var index = e.currentTarget.dataset.index;
    let category = this.data.categories2[index]
    let data = {
      navActive: index,
      thdActive: -1,
      categories3: [],
      height: this.data.height1
    }
    if (category.list && category.list.length > 0) {
      data.categories3 = category.list;
      data.height = this.data.height2;
    }
    data.category = category
    this.setData(data);
    this.getProductList()
  },
  fchanged: function (e) {
    var index = e.currentTarget.dataset.index;
    let category = this.data.categories[index]
    let data = {
      fstActive: index,
      navActive: -1,
      categories3: [],
      categories2: [],
      height: this.data.height1
    }
    if (category.list && category.list.length > 0) {
      data.categories2 = category.list;
    }
    data.category = category
    this.setData(data);
    this.getProductList()
  },
  tchanged: function (e) {
    var index = e.currentTarget.dataset.index;
    let category = this.data.categories3[index]
    this.setData({
      thdActive: index,
      category: category
    });
    this.getProductList()
  },
  getProductList: function (isNext) {
    var that = this;
    if (!isNext) {
      that.setData({pageNo: 1})
    }
    let p = {
      isFlag: 2, //地区商城1， 全国商城2， 商家联盟3
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      productTypeId: that.data.category.productTypeId
    }
    app.loading()
    getProductslist(p).then(res => {
      let list = res.pageInfo.list;
      for(var itm of list){
        itm.price = (itm.price / 100).toFixed(2)
        itm.shopPrice = (itm.shopPrice / 100).toFixed(2)
      }
      let productList = []
      if (res.pageInfo.pageNum == 1) {
        productList = list
      } else {
        productList = app.SplitArray(list, that.data.productList);
      }
      let loadend = list.length < that.data.pageSize;
      that.setData({
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? '已全部加载' : '加载更多',
        productList: productList,
        pageNo: that.data.pageNo + 1,
      });
      app.loaded()
    })
  },
  getAllCategory: function () {
    var that = this;
    app.loading()
    getCategoryList(2).then(res => {
      let list = res.list[0].list
      let category = list[0]
      let data = {
        categories: list,
        category: category,
        categories2: category.list,
        navActive: -1
      }
      that.setData(data);
      this.getProductList()
    })
  },
  loadMore: function () {
    this.getProductList(1)
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
    wx.showTabBar({
      animation: false,
    })
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
    this.getAllCategory()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})