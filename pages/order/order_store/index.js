import {
  findTiHuoShop,
  findCsWd
} from '../../../api/order.js';
let QQMapWX = require('../../../utils/qqmap-wx-jssdk');
const app = getApp();
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
      'title': '小区服务站列表'
    },
    storeList: [],
    allList: [],
    page: 1,
    storeName: '',
    showList: [],
    limit: 9999,
    loading: false,
    loaded: false,
    loadTitle: '',
    addressInfo: {},
    sid: 0,
    flag:'false',
    type:'',
    showActionsheet: false,
    groups: [
      { text: '联系服务店', value: 1 },
      { text: '联系配送员', value: 2 },
  ]
  },
  searchStore(list) {
    let newList = []
    list.map((item, index) => {
      if(item.shopName.indexOf(this.data.storeName) == '-1') {
        return
      } else {
        newList.push(item)
        this.setData({
          storeList: newList
        })
      }
    })
  },
  storeChange(e) {
    const value = e.detail.value
    this.setData({
      storeName: value
    })
    if(value == '' ) {
    this.setData({
      storeList: this.data.allList
    })
    } else {
      this.searchStore(this.data.storeList)
    }
  },
  formSubmit(e){
    var _this = this;
    let list = e
    let from = {
      latitude: app.globalData.distance.lat,
      longitude: app.globalData.distance.lng
    }
    let dest = []
    list.map((item, index) => {
      let obj = {
        latitude: item.lat,
        longitude: item.lng
      }
      list[index].distance = ''
      if(obj.latitude) {
      dest.push(obj)
      }
    })
    let oneList = dest.slice(0,190)
    let twoList = dest.slice(190,999)
    //调用距离计算接口    
    qqmapsdk.calculateDistance({
        mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        from: from || '', //若起点有数据则采用起点坐标，若为空默认当前地址
        to: oneList, //终点坐标              
        success: function(res) {//成功后的回调
          var res = res.result;
          var dis = [];
          for (var i = 0; i < res.elements.length; i++) {
            dis.push(res.elements[i].distance); //将返回数据存入dis数组，
          }
          if(twoList.length == 0) {
            let distanceList = dis
            list.map((item, index) => {
              item.distance = distanceList[index]
            })
            function compare(property){
              return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
              }
          }
        let newList = []
        newList = list.sort(compare('distance'))
        newList.map((item, index) => {
          let distanceName = item.distance + ''
          if(distanceName.length < 4) {
            newList[index].distanceName = distanceName + 'm'
          }
          if(distanceName.length > 3) {
            newList[index].distanceName = (item.distance / 1000).toFixed(1) + 'km'
          }
        })
        let loaded = list.length < _this.data.limit
        _this.setData({
          storeList: newList,
          allList: newList,
          page: _this.data.page + 1,
          loaded: loaded,
          loading: false,
          loadTitle: loaded ? '已全部加载' : '加载更多',
        })
        return
          }
          qqmapsdk.calculateDistance({
            mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
            from: from || '', //若起点有数据则采用起点坐标，若为空默认当前地址
            to: twoList, //终点坐标
            success: function(re) {//成功后的回调
              var re = re.result;
              var disList = [];
              for (var i = 0; i < re.elements.length; i++) {
                disList.push(re.elements[i].distance); //将返回数据存入dis数组，
              }
              let distanceList = [...dis, ...disList]
              list.map((item, index) => {
                item.distance = distanceList[index]
              })
              function compare(property){
                return function(a,b){
                  var value1 = a[property];
                  var value2 = b[property];
                  return value1 - value2;
                }
            }
          let newList = []
          newList = list.sort(compare('distance'))
          newList.map((item, index) => {
            let distanceName = item.distance + ''
            if(distanceName.length < 4) {
              newList[index].distanceName = distanceName + 'm'
            }
            if(distanceName.length > 3) {
              newList[index].distanceName = (item.distance / 1000).toFixed(1) + 'km'
            }
          })
          let loaded = list.length < _this.data.limit
          _this.setData({
            storeList: newList,
            allList: newList,
            page: _this.data.page + 1,
            loaded: loaded,
            loading: false,
            loadTitle: loaded ? '已全部加载' : '加载更多',
          })
          // wx.hideLoading()
            }
          });
        }
    });
},
  onLoadFun: function () {
    if(this.data.type == '1') {
      this.findCsWd();
    }else{
      //this.getStoreList();
    }
  },
  close: function () {
    this.setData({
      showActionsheet: false
    })
  },
  btnClick(e) {
    const index = e.detail.index
    let phone = ''
    if(index == 0) {
      phone = this.data.fwphone
    } else {
      phone = this.data.hmphoneno
    }
      wx.makePhoneCall({
        phoneNumber: phone
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async findCsWd () {
    var data = {
      adminId: this.data.sid
    };
    const result = await findCsWd(data);
    this.setData({
      storeList:result.list
    })
  },
  onAddress: function () {
    wx.navigateTo({
      url: '/pages/ucenter/user_address_list/index?select=1',
    })
  },
  onLoad: function (options) {
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'none',
    //   duration: 2000
    // })
    let address = wx.getStorageSync('selected_address')
    app.globalData.distance = {
      lat: address.lat,
      lng: address.lng
    }
    this.setData({
      addressInfo: address,
      sid: options.sid, 
      flag: options.flag,
      type:options.type
    })
  },
  async findShop() {
    let that = this
    const data = {
      pageNo: 1,
      pageSize: this.data.limit
    }
    if(this.data.flag === 'true'){
      data.adminId = that.data.sid;
    }
    let result = await findTiHuoShop(data)
    let list = result.pageInfo.list  
    this.formSubmit(list)
  },
  getStoreList: function (isPage) {
    var that = this;
    if (that.data.loaded || that.data.loading) return
    let dts = {
      loading: true,
    }
    if (isPage) {
      dts.storeList = []
      dts.page = 1
    }
    that.setData(dts);
    var param = {
      pageNo: 1,
      pageSize: that.data.limit,
    }
    if(this.data.flag === 'true'){
      param.adminId = that.data.sid;
    }
    findTiHuoShop(param).then(res => {
      let list = res.pageInfo.list  
      let loaded = list.length < that.data.limit
      this.setData({
        showList: list
      })
      this.formSubmit(this.data.showList)
      // that.setData({
      //   storeList: app.SplitArray(list, that.data.storeList),
      //   page: that.data.page + 1,
      //   loaded: loaded,
      //   loading: false,
      //   loadTitle: loaded ? '已全部加载' : '加载更多',
      // })
    }).catch(() => {
      // app.Tips({
      //   title: '数据加载失败'
      // })
    });
  },
  selectShop: function (e) {
    let index = e.currentTarget.dataset.index
    let shop = this.data.storeList[index]
    shop.sid = this.data.sid
    if(this.data.type == '1') {
      shop.shopId = shop.adminId
      shop.shopAdress = shop.shopAdressDetail
      shop.phonNo = shop.phoneNo 
    }
    wx.setStorageSync('ti_huo_shop', shop);
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  showMap: function (e) {
    let lat = parseFloat(e.currentTarget.dataset.lat) 
    let lng = parseFloat(e.currentTarget.dataset.lng) 
    if(e.currentTarget.dataset.lat == null ){
      return app.Tips({
        title: '该商家未设置坐标！'
      })
    }else{
      wx.openLocation({
        latitude: lat,
        longitude: lng, 
      })
    }
  },
  tel: function (e) {
    let fwphone = e.currentTarget.dataset.phone
    let hmphoneno = e.currentTarget.dataset.hmphoneno
    this.setData({
      fwphone,
      hmphoneno,
      showActionsheet: true
    })
  },

  onPullDownRefresh: function(){
    this.findShop();
    this.setData({
      storeName: ''
    })
  },

  onReachBottom: function () {
    this.findShop();
    this.setData({
      storeName: ''
    })
  },
  onShow() {
    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    animation.rotate(360).step()
    this.setData({
      animation: animation.export()
    })
    let address = wx.getStorageSync('selected_address')
    app.globalData.distance = {
      lat: address.lat,
      lng: address.lng
    }
    this.setData({
      addressInfo: address,
    })
    this.findShop();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }

})