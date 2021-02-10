const app = getApp();

import { getIndexData, findTimeLimitProduct, findRecommendProduct ,getTemlIds} from '../../api/api.js';
import { CACHE_SUBSCRIBE_MESSAGE, CACHE_SPID } from '../../config.js';
import {  postCartAdd,getNimiRoom,selectIdType } from '../../api/store.js';
import {
  getUserInfo
} from '../../api/user.js';
import Util from '../../utils/util.js';
let livePlayer = requirePlugin('live-player-plugin')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid:"",
    isAuto: false,
    iShidden:false,    
    imgUrls: [],
    itemNew:[],
    activityList:[],
    menus: [],
    bastBanner: [],
    bastInfo: '',
    bastList: [],
    fastInfo: '',
    fastList: [],
    firstInfo: '',
    firstList: [],
    salesInfo: '',
    likeInfo: [],
    lovelyBanner: {},
    benefit:[],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    parameter:{
      'navbar': '0',
      'color': true,
      'class': '6',
      'return': '0'
    },
    window: false,
    iShidden:false,
    navH: "",
    newGoodsBananr:'',
    adcode: '',
    timer: 0,
    address: '',
    page: 1,
    limit: 10,
    loaded: false,
    loading: false,
    loadTitle: '',
    tuiHidden:true,
    zhiBoDesc:'已结束',
    zhiBoStatus:'1',
    miBaoBaoRoomUrl:'',
    aaaUrl: '/pages/goods/goods_details/index?id=82021012110044487996848119162002',
    bbbUrl: '/pages/shopHome/index?id=82021012617480725484294307901120'
  },
  closeTip:function(){
    wx.setStorageSync('msg_key',true);
    this.setData({
      iShidden:true
    })
  },
  onLoadFun: function (e) {
    getUserInfo().then(res => {
      let info = res.userAndQuotaBean
      this.setData({
        uid: info.userId
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Util.chekWxLogin().then(res => {
      app.globalData.model = res.isLogin
      app.globalData.userInfo = res.userinfo
      app.globalData.token = res.userinfo.userId;
    })
    const scene = decodeURIComponent(options.scene)
    if(scene == 'undefined'){
      return
    }else {
      selectIdType({
        id:scene
      }).then(res => {
        if(res.type === '1'){
          wx.navigateTo({
            url: '/pages/goods/goods_details/index?id='+scene,
          })
        }else if(res.type === '2'){
          app.globalData.scanCodeInfo = scene;
        }else if(res.type === '3'){
          wx.navigateTo({
            url: '/pages/BusinessDetail/index?id='+scene,
          })
        }
      })
    }
    let data = {
      navH: app.globalData.navHeight
    }
    this.setData(data);
    if (options.spid){
      app.globalData.spid = options.spid;
      wx.setStorageSync(CACHE_SPID, options.spid)
    }
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
    if (wx.getStorageSync('msg_key')) this.setData({ iShidden:true});
    wx.showLoading({
      title: '加载中...',
    })
    if (app.globalData.isLog) {
      this.getUserInfo()
    }
  },
  getTemlIds(){
    let messageTmplIds = wx.getStorageSync(CACHE_SUBSCRIBE_MESSAGE);
    if (!messageTmplIds){
      getTemlIds().then(res=>{
        if (res.data) 
          wx.setStorageSync(CACHE_SUBSCRIBE_MESSAGE, JSON.stringify(res.data));
      })
    }
  },
  catchTouchMove: function (res) {
    return false
  },
  onColse:function(){
    this.setData({ window: false});
  },
  touchStart(){
    this.setData({
      tuiHidden:false
    })
  },
  touchEnd(){
    this.setData({
      tuiHidden:true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUserInfo: function () {
    var that = this;
    getUserInfo().then(res => {
      that.setData({address: app.globalData.userInfo.userDetaliAdress})
    });
  },
  isZhibo: function () {
    var that = this;
    // 首次获取立马返回直播状态
    const roomId = 5 // 房间 id
    livePlayer.getLiveStatus({ room_id: roomId }).then(res => {
        // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
        const liveStatus = res.liveStatus
        if(liveStatus === 101){
        that.setData({zhiBoDesc:"直播中",zhiBoStatus:"1",})
        }else if(liveStatus === 102){
          that.setData({zhiBoDesc:"未开始",zhiBoStatus:"2",})
        }else if(liveStatus === 103){
          that.setData({zhiBoDesc:"已结束",zhiBoStatus:"2",})
        }else if(liveStatus === 105){
          that.setData({zhiBoDesc:"暂停中",zhiBoStatus:"2",})
        }else{that.setData({ zhiBoDesc:"已结束",zhiBoStatus:"2",})}
        console.log('get live status', liveStatus)
    }).catch(err => {console.log('get live status', err)})
    // 往后间隔1分钟或更慢的频率去轮询获取直播状态
    setInterval(() => {
      livePlayer.getLiveStatus({ room_id: roomId }).then(res => {
          const liveStatus = res.liveStatus
          if(liveStatus === 101){
            that.setData({zhiBoDesc:"直播中",zhiBoStatus:"1",})
          }else if(liveStatus === 102){
            that.setData({zhiBoDesc:"未开始",zhiBoStatus:"2",})
          }else if(liveStatus === 103){
            that.setData({zhiBoDesc:"已结束",zhiBoStatus:"2",})
          }else if(liveStatus === 105){
            that.setData({zhiBoDesc:"暂停中",zhiBoStatus:"2",})
          }else{that.setData({ zhiBoDesc:"已结束",zhiBoStatus:"2",})}
            console.log('get live status', liveStatus)
          }).catch(err => {console.log('get live status', err) })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var param = {miniRoomId:"82020050912371712080805828627111",pageSize:1,pageNo:1,type: 3};
    getNimiRoom(param).then(res=>{
        this.setData({
          miBaoBaoRoomUrl:"plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+res.pageInfo.list[0].room_id+"&custom_params={{customParams}}"
        })
    });
    var that = this;
    this.isZhibo();
    wx.showTabBar({
      animation: false,
    })
    that.setData({address: app.globalData.userInfo.userDetaliAdress})
    that.timer = setInterval(function(){
      if (app.globalData.city && that.data.parameter.city != app.globalData.city){
        that.setData({'parameter.city': app.globalData.city})
        clearInterval(that.timer)
        wx.hideLoading();
        that.getIndexConfig();
        that.findProductList();
      }
    }, 100)
  },
  getIndexConfig:function(){
    var that = this;
    getIndexData().then(res=>{
      let list = []
      for(var itm of res.adverType1) {
        list.push(itm);
      }
      for(var itm of res.adverType2) {
        itm.url = '/pages/goods/goods_details/index?id=' + itm.remark
        list.push(itm);
      }
      for(var itm of res.adverType4) {
        list.push(itm);
      }
      list.map((item, index) => {
        if(item.adverType == '5') {
          item.url = '/pages/goods/goods_details/index?id=' + item.remark
          if(item.adverId == '82021012710385433817649657259449') {
            item.url = '/pages/shopHome/index?id=82021012617480725484294307901120'
          }
        }
      })
      that.setData({
        imgUrls: list,
        itemNew: res.adverType3,
      });
    });
    findTimeLimitProduct({pageNo:1, pageSize:10}).then(res => {
      if (res.pageInfo.total < 1) {
        return
      }
      let dt = []
      for (var item of res.pageInfo.list) {
        item.shopPrice = (item.shopPrice / 100).toFixed(2);
        dt.push(item)
      }
      that.setData({firstList: dt})
    });
  },
  findProductList(isPage){
    let that = this
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
      pageNo: that.data.page,
      pageSize: that.data.limit,
    }
    app.loading()
    findRecommendProduct(param).then(res => {
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
      app.loaded()
    });
  },
  addToCart(e){
    let id = e.currentTarget.dataset.id
    wx.showLoading({ title:'请稍候'});
    postCartAdd({productId: id,userId:uid}).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
    }).catch(err => {
      wx.hideLoading()
    })
  },
  toUserPromotion(e){
    wx.navigateTo({
      title:'用户注册推广',
      url: '/pages/ucenter/user_ promotion/index',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ window:false});
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
    if (!app.globalData.region_id) {
      app.getLoc();
      return
    }
    this.getIndexConfig();
    this.findProductList(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.findProductList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  },
})