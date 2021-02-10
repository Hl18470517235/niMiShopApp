import {
  HTTP_REQUEST_URL,
  CACHE_USERINFO,
  CACHE_TOKEN,
  CACHE_SPID,
  CACHE_EXPIRES_TIME
} from './config.js';
import Server from './utils/Server.js';
import util from './utils/util.js';
import {getRegionId} from './api/api.js';
App({
  onLaunch: function (option) {
    let that = this;
    let token = wx.getStorageSync(CACHE_TOKEN);
    let expiresTime = 0; // wx.getStorageSync(CACHE_EXPIRES_TIME);
    let userInfo = wx.getStorageSync(CACHE_USERINFO);
    let spid = wx.getStorageSync(CACHE_SPID);
    this.globalData.spid = spid || 0;
    this.globalData.isLog = !!userInfo && util.checkLogin(token, expiresTime, true);
    if (this.globalData.isLog) {
      this.globalData.token = token;
      this.globalData.expiresTime = expiresTime;
      this.globalData.userInfo = userInfo ? JSON.parse(userInfo) : {};
    }
    if (option.query.hasOwnProperty('scene')) {
      switch (option.scene) {
        //扫描小程序码
        case 1047:         
          that.globalData.code = option.query.scene;
          break;
          //长按图片识别小程序码
        case 1048:
          that.globalData.code = option.query.scene;
          break;
          //手机相册选取小程序码
        case 1049:
          that.globalData.code = option.query.scene;
          break;
          //直接进入小程序
        case 1001:
          that.globalData.spid = option.query.scene;
          break;
      }
    }
    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
      },
      fail(err) {}
    });
    //获取坐标
    that.getLoc()
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    updateManager.onUpdateFailed(function () {
      return that.Tips({
        title: '新版本下载失败'
      });
    })
    //实例化聊天服务
    this.$chat = new Server(this);
  },
  $chat: null,
  globalData: {
    mapKey:'V3QBZ-HISC6-FCASO-EVOTM-XALBF-3OFKZ',
    navHeight: 0,
    routineStyle: '#ffffff',
    openPages: '',
    spid: 0,
    code: 0,
    urlImages: '',
    url: HTTP_REQUEST_URL,
    token: '',
    model:true,
    isLog: false,
    expiresTime: 0,
    MyMenus: [],
    userInfo: {},
    loginType: 'routine',
    adcode: '',
    city: '',
    region_id: '',
    qrCodeFlag:'',
    scanCodeInfo:'',
    shopModel:false,
    distance: {},
    timeModel: true,
  },
  /**
   * 聊天事件快捷注册
   * 
   */
  $on: function (name, action) {
    this.$chat.$on(name, action);
  },
  /*
   * 信息提示 + 跳转
   * @param object opt {title:'提示语',icon:''} | url
   * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
   */
  Tips: function (opt, to_url) {
    return util.Tips(opt, to_url);
  },
  /**
   * 快捷调取助手函数
   */
  help: function () {
    return util.$h;
  },
  shareData: function() {
    let info = this.globalData.userInfo
    let uid = info.userId || 0
    let data = {
      title: '亿家联创',
      imageUrl: '',
      path: '/pages/index/index?spid=' + uid,
    }
    return data;
  },
  /*
   * 合并数组
   * @param array list 请求返回数据
   * @param array sp 原始数组
   * @return array
   */
  SplitArray: function (list, sp) {
    return util.SplitArray(list, sp)
  },
  getLoc: function(){
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        let key = 'V3QBZ-HISC6-FCASO-EVOTM-XALBF-3OFKZ' //正式
        let url = 'https://apis.map.qq.com/ws/geocoder/v1/?key='+key+'&location=' + res.latitude + ',' + res.longitude
        wx.request({
          url: url,
          success: function (rst) {
            let ad_info = rst.data.result.ad_info
            wx.setStorage({
              key: 'location',
              data: {
                adcode: ad_info.adcode,
                city: ad_info.district
              }
            });
            that.globalData.adcode = ad_info.adcode;
            getRegionId(ad_info.adcode).then(res => {
              that.globalData.region_id = res.regionBean.yjlcRegionId; 
              that.globalData.city = ad_info.district;
            })
          }
        });
      },
      fail(err) {
        wx.getSetting({
          success(res1) {
            if (!res1.authSetting['scope.userLocation']) {
              that.loaded()
              wx.showModal({
                content: '请授权我们获取您的地理位置',
                success(rst){
                  if (!rst.confirm) return
                  wx.openSetting({
                    complete: (res2) => {
                      if (res2.authSetting['scope.userLocation']) {
                        that.getLoc()
                      }
                    },
                  })
                }
              })
            } else {
              that.loaded()
              wx.showModal({
                content: '地理位置信息获取失败, 请打开手机GPS定位后, 重新进入小程序',
                showCancel: false,
              })
            }
          }
        })
      }
    })
  },
  loading: function(){
    wx.showLoading({
      title: '加载中...',
    })
  },
  loaded: function(){
    wx.hideLoading()
    wx.stopPullDownRefresh()
  }
})