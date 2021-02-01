
import { getAddressList, editAddress} from '../../../api/user.js';
var app = getApp();
let QQMapWX = require('../../../utils/qqmap-wx-jssdk');
let qqmapsdk = new QQMapWX({
  key: app.globalData.mapKey 
});
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '地址管理'
    },
    addressList:[],
    cartId:'',
    pinkId:0,
    couponId:0,
    loading:false,
    loadend:false,
    loadTitle:'加载更多',
    page:1,
    limit:8,
    select: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cartId: options.cartId || '',
      pinkId: options.pinkId || 0,
      couponId: options.couponId || 0,
      select: options.select || 0,
    })
  },
  onShow:function(){
    var that = this;
    if (app.globalData.isLog) that.getAddressList(true);
  },
  onLoadFun:function(){
    this.getAddressList();
  },
  /*
  * 导入微信地址
  */
  getWxAddress: function () {
    var that = this;
    wx.authorize({
      scope: 'scope.address',
      success: function (res) {
        wx.chooseAddress({
          success: function (res) {
            let newAddress = res.provinceName + res.cityName + res.countyName + res.detailInfo
              var _this = this;
              qqmapsdk.geocoder({
                address: newAddress, 
                success: function(rest) {
                  console.log(res);
                  console.log(rest.result.location)
                  editAddress({
                    provinceId: res.provinceName,
                    cityId: res.cityName,
                    areaId: res.countyName,
                    isDefaultFlag: 1,
                    label: '',
                    lat: rest.result.location.lat,
                    lng: rest.result.location.lng,
                    receivingUserName: res.userName,
                    receivingPhone: res.telNumber,
                    detailAdress: res.detailInfo,
                  }).then(res=>{
                    app.Tips({ title: "添加成功", icon: 'success' }, function () {
                      that.getAddressList(true);
                    });
                  }).catch(err=>{
                    return app.Tips({title:err});
                  });
                }
              })
          },
          fail: function (res) {
            if (res.errMsg == 'chooseAddress:cancel') return app.Tips({ title:'取消选择'});
          },
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '您已拒绝导入微信地址权限',
          content:'是否进入权限管理，调整授权？',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                }
              });
            } else if (res.cancel){
              return app.Tips({ title: '已取消！' });
            }
          }
        })
      },
    })
  },
  /**
   * 获取地址列表
   * 
  */
  getAddressList: function (isPage){
    var that=this;
    if (isPage) that.setData({ loadend: false, page: 1, addressList:[]});
    if (that.data.loading) return;
    if (that.data.loadend) return;
    that.setData({ loading:true,loadTitle:''});
    getAddressList({ page: that.data.page, limit: that.data.limit }).then(res=>{
      var list = res.listadr;
      var loadend = list.length < that.data.limit;
      that.data.addressList = app.SplitArray(list, that.data.addressList);
      that.setData({
        addressList: that.data.addressList,
        loadend: loadend,
        loadTitle: loadend ? '我也是有底线的' : '加载更多',
        page: that.data.page + 1,
        loading: false,
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: '加载更多' });
    });
  },
  /**
   * 编辑地址
  */
  editAddress:function(e){
    var cartId = this.data.cartId,pinkId = this.data.pinkId,couponId = this.data.couponId;
    this.setData({cartId: '',pinkId: '',couponId: ''})
    wx.navigateTo({ 
      url: '/pages/ucenter/user_address/index?id=' + e.currentTarget.dataset.id + '&cartId=' + cartId + '&pinkId=' + pinkId + '&couponId=' + couponId
    })
  },
  /**
   * 新增地址 
  */
  addAddress: function () {
    var cartId = this.data.cartId,pinkId = this.data.pinkId,couponId = this.data.couponId;
    this.setData({ cartId: '', pinkId: '', couponId: ''})
    wx.navigateTo({
      url: '/pages/ucenter/user_address/index?cartId=' + cartId + '&pinkId=' + pinkId + '&couponId=' + couponId
    })
  },
  goOrder:function(e){
    if (this.data.select < 1) {
      return;
    }
    var index = e.currentTarget.dataset.index;
    let address = this.data.addressList[index]
    wx.setStorageSync('selected_address', address)
    wx.navigateBack({
      complete: (res) => { 

      },
    })
  },
  onPullDownRefresh: function(){
    this.getAddressList(true);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getAddressList();
  }
})