// pages/ucenter/user_ promotion/index.js
const app = getApp();
import { CACHE_SUBSCRIBE_MESSAGE, CACHE_SPID } from '../../../config';
import {getUserInfo,codeToSessionKey,getFindMember,addMember} from '../../../api/user.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '推广申请'
    },
    uid:"",
    isAuto: false, //没有授权的不会自动授权
    iShidden: true, //是否隐藏授权
    isFlag:'2', //是否有申请  1 = 有 2 = 没有
    isFlagSuccess:'01', //是否申请成功  (00 = 审核通过 01 = 待审核 98 = 审核拒绝
    userName:"",
    userAccount:"",
    isHidden:true,
    bgstyle:{},
    userInfo:{},
    //memberInfo:{userId:"",userName:"",phoneNo:"",registType:"4",regionId:""}
  },
  onLoadFun: function (e) {
    //this.setData({ isLog:true});
    //this.getCouponList();
    //this.getCartCount();
    //this.downloadFilePromotionCode();
    this.getUserInfo();
    this.getFindMember();
    //this.get_product_collect();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var height =  wx.getSystemInfoSync().windowHeight - 55 + "px";
    var bgstyles = "width: 100%;height: "+height + ";";
    this.setData({
      bgstyle:bgstyles
    });
  },
  userNameInput(e){this.data.userName = e.detail.value;},
  userAccountInput(e){this.data.userAccount = e.detail.value;},
  addQuMember(){
    if(this.data.isFlag == '1' && this.data.isFlagSuccess == '00'){
      wx.showToast({title: '您已是注册体验官啦,快去推广吧!',icon: 'none',duration: 3000})
      return;
    }
    if(this.data.userInfo.qrCodeFlag == '0'){
      wx.showToast({title: '您已是注册体验官啦,快去推广吧!',icon: 'none',duration: 3000})
      return;
    }
    var memberInfom = {};
    memberInfom.regionId = app.globalData.region_id;
    memberInfom.userId = this.data.uid;
    memberInfom.registType = "4";
    if(this.data.userInfo.userName == null){
      memberInfom.userName = this.data.userInfo.userNike
    }else{
      memberInfom.userName = this.data.userInfo.userName ;
    }
    memberInfom.phoneNo = this.data.userInfo.userPhone;
    var that = this;
    addMember(memberInfom).then(res=>{
      if(res.respCode == '0000'){
        wx.showToast({title: '恭喜您,申请成功!',icon: 'none',duration: 3000})
        that.setData({
          isFlag:'1',
          isFlagSuccess:'00'
        })
      }else{
        wx.showToast({title: res.respMsg,icon: 'none',duration: 3000})
      }
    });
  },
  // addMember(){
  //   var memberInfom = {};
  //   memberInfom.regionId = app.globalData.region_id;
  //   memberInfom.userId = this.data.uid;
  //   memberInfom.registType = "4";
  //   memberInfom.userName = this.data.userName;
  //   memberInfom.phoneNo = this.data.userAccount;
  //   if(memberInfom.userName.length==0){
  //     wx.showToast({title: "姓名不能为空哦",icon: 'none',duration: 3000})
  //     return;
  //   }
  //   if(memberInfom.userName.length>8){
  //     wx.showToast({title: "名字不能长度不能超过8位哦",icon: 'none',duration: 3000})
  //     return;
  //   }
  //   if(memberInfom.userName.length>15){
  //     wx.showToast({title: "手机号不正确",icon: 'none',duration: 3000})
  //     return;
  //   }
  //   if(memberInfom.phoneNo.length==0){
  //     wx.showToast({title: "手机号不能为空哦",icon: 'none',duration: 3000})
  //     return;
  //   }
  //   var that = this;
  //   addMember(memberInfom).then(res=>{
  //     if(res.respCode == '0000'){
  //       that.setData({
  //         isFlag : 1,
  //         isFlagSuccess:'01'
  //       })
  //     }else{
  //       wx.showToast({title: res.respMsg,icon: 'none',duration: 3000})
  //     }
  //   })
  // },
  // add(){
  //   this.setData({
  //     isFlag : 2
  //   })
  // },
  /**
   * 查询用户审核信息
   */
  getFindMember:function(){
    var that = this;
    getFindMember().then(res=>{
      if(res.respCode = '0000'){
        if(res.list != null && res.list.length>0){
          var info = res.list[0];
          that.setData({
            isFlagSuccess : info.memberApplicationState,
            isFlag :  res.flag
          })
        }
      }else{
        wx.showToast({title: res.respMsg,icon: 'error',duration: 3000})
      }
    })
  },
 /*
   * 获取用户信息
   */
  getUserInfo: function () {
    var that = this;
    getUserInfo().then(res => {
      let info = res.userAndQuotaBean
      that.setData({
        uid: info.userId,
        userInfo:info
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
   
  toBack(){
    wx.navigateBack({
      delta: 2
    })
  }
})