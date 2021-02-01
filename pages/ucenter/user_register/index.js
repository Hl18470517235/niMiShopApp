import { registerVerify, phoneRegister} from '../../../api/api.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '注册APP账号',
      'color': true,
      'class': '0'
    },
    disabled: false,
    active: false,
    timetext: '获取验证码',
    userInfo: {},
    phone: '',
    password: '',
    sessionId: '',
    captcha: '',
    inviter: '',
    pwdType: 'password',
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
  onLoadFun:function(){

  },
  toggleSee: function(){
    let type = this.data.pwdType == 'password' ? 'text' : 'password'
    this.setData({pwdType: type})
  },
  clearPhone: function(){
    this.setData({phone: ''})
  },
  scan: function(){
    let that = this
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        that.setData({inviter: result})
      }
    })
  },
  editPwd:function(){
    let that = this;
    if (!this.data.phone) return app.Tips({ title: '请填写手机号码！' });
    if (!this.data.password) return app.Tips({ title: '请填写登录密码！' });
    if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) return app.Tips({ title: '请输入正确的手机号码！' });
    if (!this.data.captcha) return app.Tips({title:'请填写验证码'});
    if (this.data.inviter && !(/^1[3456789]\d{9}$/.test(this.data.inviter))){
      return app.Tips({ title: '邀请人的手机号码不正确！' });
    }
    phoneRegister({
      account:this.data.phone,
      referrer: this.data.inviter,
      code: this.data.captcha,
      pwd: this.data.password,
      sessionId: this.data.sessionId,
      userAddSource: 1
    }).then(res=>{
      return app.Tips({ title: '注册成功', icon: 'success' }, { tab: 5, url: '/pages/user/user' });
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  /**
   * 发送验证码
   * 
  */
  code: function () {
    let that = this;
    if (!this.data.phone) return app.Tips({ title: '请填写手机号码！' });
    if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) return app.Tips({ title: '请输入正确的手机号码！' });
    registerVerify(this.data.phone, 1).then(res => {
      that.setData({ disabled: true, active: true, sessionId: res.sessionId });
      let n = 60;
      let run = setInterval(function () {
        n--;
        if (n < 0) {
          clearInterval(run);
          that.setData({ disabled: false, active: false, timetext: '重新获取' });
        } else {
          that.setData({ timetext: "剩余 " + n + "s" })
        }
      }, 1000);
      return app.Tips({title:'发送成功',icon:'success'});
    }).catch(err => {
      return app.Tips({ title: err });
    });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})