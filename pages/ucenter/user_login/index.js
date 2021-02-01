import {loginWithPwd} from '../../../api/api.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '登录',
      'color': true,
      'class': '0'
    },
    disabled: false,
    active: true,
    timetext: '获取验证码',
    userInfo: {},
    phone: '',
    password: ''
  },
  inputgetName(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    if (name.indexOf('.') != -1) {
      let nameList = name.split('.')
      if (that.data[nameList[0]]) {
        nameMap[nameList[0]] = that.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      nameMap[nameList[0]][nameList[1]] = e.detail.value
    } else {
      nameMap[name] = e.detail.value
    }
    that.setData(nameMap);
  },
  login:function(){
    let that = this;
    let p = {
      account:"13330192433",
      pwd: "aqT+hXW3ferPRcMCaTWtkA\u003d\u003d\r\n"
    }
    loginWithPwd(p).then(res=>{
      app.globalData.token = res.userId;
      app.globalData.isLog = true;
      app.globalData.expiresTime = 26000000000000000
      if (res.userId !== undefined){
        wx.showModal({
          title:'是否绑定账号',
          content:res.msg,
          confirmText:'绑定',
          success(res){
            
          }
        });
      }else
        return app.Tips({title:'绑定成功！',icon:'success'},{tab:5,url:'/pages/ucenter/user_info/index'});
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    app.loaded()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})