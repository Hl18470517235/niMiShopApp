const app = getApp();

import {
  getUserInfo,
  miniSetPwd
} from '../../api/user.js';
import {
  switchH5Login
} from '../../api/api.js';
import authLogin from '../../utils/autuLogin.js';
import util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '个人中心',
      'color': true,
      'class': '0'
    },
    userInfo: {},
    isGoIndex: true,
    iShidden: false,
    password:'',
    password2:'',
    detailModel:false,
    masModel:false,
    isAuto: true,
    switchActive: false,
    loginType: app.globalData.loginType,
    orderStatusNum: {},
  },
  inputAction:function(e) {
    var that = this
    that.setData({
      password:e.detail.value
    })
  },
  inputAction2:function(e) {
    var that = this
    that.setData({
      password2:e.detail.value
    })
  },
  close: function () {
    this.setData({
      switchActive: false,
      detailModel:false,
      masModel:false
    });
  },
  /**
   * 授权回调
   */
  onLoadFun: function (e) {
    this.getUserInfo();
  },
  /**
   * 获取个人用户信息
   */
  getUserInfo: function () {
    var that = this;
    getUserInfo().then(res => {
      let userOrderCountBean = res.userOrderCountBean
      console.log(userOrderCountBean)
      for(let count in userOrderCountBean) {
        if(userOrderCountBean[count] > 99) {
          userOrderCountBean[count] = "99+"
        }
      }
      let info = res.userAndQuotaBean
      info.existPwd = res.existPwd
      that.setData({
        userInfo: info,
        userOrderCountBean
      });
    });
  },
  getPassword:function() {
    var that = this
    if(that.data.password == that.data.password2) {
      var data = {
        userId:app.globalData.userInfo.userId,
        pwd:that.data.password2
      }
      miniSetPwd(data).then(res => {
        app.Tips({
          title: res.respMsg
        });
        this.setData({
          detailModel:false,
          masModel:false
        })
      })
    }else{
      app.Tips({
        title: '两次密码输入不一致,请重新输入！'
      });
  }
  },
  editPassword:function() {
    this.setData({
      detailModel:true,
      masModel:true
    })
  },
  gotoDownload: function () {
    let userInfo = this.data.userInfo
    if (userInfo.existPwd == 0) {
      wx.navigateTo({
        url: '/pages/other/download/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/ucenter/user_phone/index',
      })
    }
  },
  /**
   * 关闭授权
   * 
   */
  onCloseAuto: function () {
    this.setData({
      iShidden: true
    });
  },
  /**
   * 页面跳转
   */
  goPages: function (e) {
    if (app.globalData.isLog) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    } else {
      this.setData({
        iShidden: false
      });
    }
  },
  gomebHorse:function(){
      wx.navigateToMiniProgram({
        appId: 'wx703782b4d6e042ff',
        path: 'pages/index/index',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  apponly: function () {
    // wx.showModal({
    //   title: '钱包功能仅支持在APP中使用',
    //   cancelColor: '#919191',
    //   confirmColor: '#06B7A4',
    //   cancelText: '知道了',
    //   confirmText: '去下载',
    //   success: function (res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '/pages/other/download/index',
    //       })
    //     }
    //   }
    // })
    wx.navigateTo({
      url: '/pages/withdrawal/index',
    })
  },
  showQrcode: function (e) {
    let url = this.data.userInfo.qrCodeUrl;
    wx.previewImage({
      current: '',
      urls: [url]
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      switchActive: false
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onShow: function () {
    wx.showTabBar({
      animation: false,
    })
    if (app.globalData.isLog) {
      this.getUserInfo();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  onPullDownRefresh: function () {
    if (app.globalData.isLog) {
      this.getUserInfo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})