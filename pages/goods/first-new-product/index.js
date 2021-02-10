import { findTimeLimitProduct } from '../../../api/api.js';
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
      // 'bgcolor': '#D2FBF7',
      'title': '活动专区'
    },
    imgUrls: [],
    benefit:[],
    name:'',
    icon:'',
    type:1,
    status:0,
    page: 1,
    limit: 20,
    loading: false,
    loaded: false,
    loadTitle: '',
    roomId:"5",
    miniroomId:'',
    customParams:encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 }))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type !== undefined){
      this.setData({
        type:options.type,
        miniRoomId:options.id
      })
    }
    this.getIndexGroomList();
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
    var type = this.data.type;
    if (type == 1){
      this.setData({ 'parameter.title': '清凉钜惠', name: '清凉钜惠', icon: 'icon-jingpintuijian'});
    } else if (type == 2) {
      this.setData({ 'parameter.title': '热门榜单', name: '热门榜单', icon: 'icon-remen', status: 1});
    } else if (type == 3) {
      this.setData({ 'parameter.title': '首发新品', name: '首发新品', icon: 'icon-xinpin' });
    } else if (type == 4) {
      this.setData({ 'parameter.title': '促销单品', name: '促销单品', icon: 'icon-cuxiaoguanli' });
    }else if (type == 5) {
      this.setData({ 'parameter.title': '活动专区', name: '活动专区', icon: 'icon-xinpin' });
    }else if (type == 6) {
      this.setData({ 'parameter.title': '本地直供专区', name: '本地直供专区', icon: 'icon-xinpin' });
    }else if (type == 7) {
      this.setData({ 'parameter.title': '直播间商品列表', name: '直播间商品列表', icon: 'icon-xinpin' });
    }else{
      this.setData({})
    }
    
  },
  getIndexGroomList: function (isPage) {
    var that = this;
    if (that.data.loaded || that.data.loading) return
    let dts = {
      loading: true,
    }
    if (isPage === true) {
      dts.benefit = []
      dts.page = 1
    }
    that.setData(dts);
    let param = {
      isFlag: '100',
      pageNo: that.data.page,
      pageSize: that.data.limit,
    }
    if(this.data.type === '6'){
      param.productTypeId = '82020082509340648619537603449845';
      getProductslist(param).then(res=>{
        let list = res.pageInfo.list
        for (var item of list) {
          item.shopPrice = (item.shopPrice / 100).toFixed(2);
          item.price = (item.price / 100).toFixed(2);
        }
        let loaded = list.length < that.data.limit
        that.setData({
          benefit: app.SplitArray(list, that.data.benefit),
          page: that.data.page + 1,
          loaded: loaded,
          loading: false,
          loadTitle: loaded ? '已全部加载' : '加载更多',
        })
      });
    }if(this.data.type === '7'){
      param.selectNimiProduct='1';
      param.miniRoomId = that.data.miniRoomId;
      getProductslist(param).then(res=>{
        let list = res.pageInfo.list
        for (var item of list) {
          item.shopPrice = (item.shopPrice / 100).toFixed(2);
          item.price = (item.price / 100).toFixed(2);
        }
        let loaded = list.length < that.data.limit
        that.setData({
          benefit: app.SplitArray(list, that.data.benefit),
          page: that.data.page + 1,
          loaded: loaded,
          loading: false,
          loadTitle: loaded ? '已全部加载' : '加载更多',
        })
      });
    }else{
      findTimeLimitProduct(param).then(res=>{
        console.log(1111111111111111111)
        console.log(res)
        let list = res.pageInfo.list
        for (var item of list) {
          item.shopPrice = (item.shopPrice / 100).toFixed(2);
          item.price = (item.price / 100).toFixed(2);
        }
        let loaded = list.length < that.data.limit
        that.setData({
          benefit: app.SplitArray(list, that.data.benefit),
          page: that.data.page + 1,
          loaded: loaded,
          loading: false,
          loadTitle: loaded ? '已全部加载' : '加载更多',
        })
      });
    }
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
    this.getIndexGroomList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getIndexGroomList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})