
import Util from '../../utils/util.js';
import {
  login,
} from '../../api/user.js';
let app = getApp();
Component({
  properties: {
    iShidden: {
      type: Boolean,
      value: true,
    },
    type: {
      type: Number,
      value: 2,
    },
    //是否自动登录
    isAuto: {
      type: Boolean,
      value: true,
    },
    isGoIndex: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    cloneIner: null,
    loading: false,
    errorSum: 0,
    errorNum: 3
  },
  attached() {
    var that = this
   
   if(that.data.type == 2) {
    this.setAuthStatus();
   }else{
    that.setData({
      iShidden:true
     })
   }
  },
  methods: {
    close() {
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      if (this.data.isGoIndex) {
        wx.switchTab({
          url: '/pages/index/index'
        });
      } else {
        this.setData({
          iShidden: true
        });
        if (currPage && currPage.data.iShidden != undefined) {
          currPage.setData({
            iShidden: true
          });
        }
      }
    },
    //检测登录状态并执行自动登录
    setAuthStatus() {
      var that = this;
      that.setData({
        loading: true
      })
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      if (currPage && currPage.data.iShidden != undefined) {
        currPage.setData({
          iShidden: true
        });
      }
      Util.chekWxLogin().then((res) => {
        that.setData({
          loading: false
        })
        if (res.isLogin) {
          app.globalData.isLog = true
          app.globalData.expiresTime = 2000000000000000000000; //TODO,不设过期时间
          app.globalData.userInfo = res.userinfo
          app.globalData.token = res.userinfo.userId;
          that.triggerEvent('onLoadFun', app.globalData.userInfo);
        } else {
          that.setData({
            iShidden: false
          });
        }
      }).catch(res => {
        that.setData({
          loading: false
        })
        //没有授权不会自动弹出登录框
        if (that.data.isAuto === false){
          return;
        } else{
        //自动弹出授权
        that.setData({
          iShidden: false
        });
        }
      })
    },
    //授权
    setUserInfo(userInfo, isLogin) {
      let that = this;
      wx.showLoading({
        title: '正在登录中'
      });
      if (userInfo.detail.errMsg == "getPhoneNumber:ok") {
        let data = {}
        data.sessionKey = app.globalData.session_key;
        data.openId = app.globalData.openid;
        data.iv = userInfo.detail.iv,
        data.encryptedData = userInfo.detail.encryptedData;
        that.getWxUserInfo(data);
      } else {
        wx.hideLoading();
      }
    },
    closeUserInfo:function() {
      var that = this
      that.setData({
        iShidden:true
      })
    },
    getWxUserInfo: function (userInfo) {
      let that = this;
      let param = {
        sessionKey: userInfo.sessionKey,
        openId: userInfo.openId,
        userPhoto: userInfo.avatarUrl || '',
        userNike: userInfo.nickName || '',
        vi: userInfo.iv,
        account: userInfo.encryptedData,
      }
      if (app.globalData.spid) {
        param.referrer = app.globalData.spid
      }
      login(param).then(res => {
        app.globalData.token = res.userId;
        app.globalData.isLog = true;
        app.globalData.userInfo = res;
        app.globalData.expiresTime = 2000000000000000000000; //TODO,不设过期时间
        //wx.setStorageSync('wx_session_key', res.session_key);
        //wx.setStorageSync(CACHE_TOKEN, app.globalData.token);
        //wx.setStorageSync(CACHE_EXPIRES_TIME, app.globalData.expiresTime);
        //wx.setStorageSync(CACHE_USERINFO, JSON.stringify(app.globalData.userInfo));
        //if (res.cache_key) wx.setStorage({ key: 'cache_key', data: res.cache_key });
        //取消登录提示
        wx.hideLoading();
        //关闭登录弹出窗口
        that.setData({
          iShidden: true,
          errorSum: 0
        });
        //执行登录完成回调
        that.triggerEvent('onLoadFun', app.globalData.userInfo);
      }).catch((err) => {
        wx.hideLoading();
        Util.Tips({
          title: err
        });
      });
    }
  },
})