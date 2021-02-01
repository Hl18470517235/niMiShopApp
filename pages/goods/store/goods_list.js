import {
  getProductslist
} from '../../../api/store.js';


const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商品列表',
      'color': true,
      'class': '0'
    },
    navH: "",
    is_switch: true,
    adlist: [],
    where: {
      sid: 0,
      keyword: '',
      priceOrder: '',
      salesOrder: '',
      news: 0,
      page: 1,
      limit: 10,
      cid: 0,
    },
    price: 0,
    stock: 0,
    nows: false,
    loadend: false,
    loading: false,
    loadTitle: '加载更多',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['where.sid']: options.sid || 0,
      navH: app.globalData.navHeight
    });
    this.get_product_list();
    //this.get_host_product();
  },
  Changswitch: function () {
    var that = this;
    that.setData({
      is_switch: !this.data.is_switch
    })
  },
  searchSubmit: function (e) {
    var that = this;
    this.setData({
      ['where.keyword']: e.detail.value,
      loadend: false,
      ['where.page']: 1
    })
    this.get_product_list(true);
  },
  /**
   * 获取我的推荐
   */
  get_host_product: function () {
    var that = this;
    getProductHot().then(res => {
      that.setData({
        host_product: res.data
      });
    });
  },
  //点击事件处理
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
    this.get_product_list(true);
  },
  //设置where条件
  setWhere: function () {
    if (this.data.price) {
      this.data.where.countSqu = 2
      this.data.where.countSquType = this.data.price
    }else if (this.data.stock) {
      this.data.where.countSqu = 1
      this.data.where.countSquType = this.data.stock
    }else if (this.data.zhsort) {
      this.data.where.countSqu = 3
      this.data.where.countSquType = this.data.zhsort
    }
    this.setData({
      where: this.data.where
    });
  },
  //查找产品
  get_product_list: function (isPage) {
    let that = this;
    this.setWhere();
    if (that.data.loadend) return;
    if (that.data.loading) return;
    if (isPage === true) that.setData({
      productList: []
    });
    that.setData({
      loading: true,
      loadTitle: ''
    });
    let where = that.data.where
    let param = {
      shopId: where.sid,
      pageSize: where.limit,
      pageNo: where.page,
      countSqu: where.countSqu,
      countSquType: where.countSquType
    }
    getProductslist(param).then(res => {
      let list = res.pageInfo.list;
      for (var itm of list) {
        itm.price = (itm.price / 100).toFixed(2)
        itm.shopPrice = (itm.shopPrice / 100).toFixed(2)
      }
      let productList = app.SplitArray(list, that.data.productList);
      let loadend = list.length < that.data.where.limit;
      let dt = {
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? '已全部加载' : '加载更多',
        productList: productList,
        ['where.page']: that.data.where.page + 1,
      }
      if (that.data.adlist.length < 1){
        for(var itm of productList) {
          that.data.adlist.push({
            url: '/pages/goods/goods_details/index?id='+itm.productId,
            image: itm.productIndexPhoto,
          })
          if (that.data.adlist.length > 2){
            break;
          }
        }
        dt.adlist = that.data.adlist
      }
      that.setData(dt);
    }).catch(err => {
      that.setData({
        loading: false,
        loadTitle: '加载更多'
      });
    });
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
    this.setData({
      ['where.page']: 1,
      loadend: false,
      productList: []
    });
    this.get_product_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_product_list();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})