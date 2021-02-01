import { setPwd} from '../../../api/user.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '设置登录密码',
      'color': true,
      'class': '0'
    },
    disabled: false,
    active: false,
    timetext: '获取验证码',
    userInfo: {},
    phone: '',
    password: '',
    pwdType: 'text',
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
  editPwd:function(){
    let that = this;
    //if (!this.data.phone) return app.Tips({ title: '请填写手机号码！' });
    //if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) return app.Tips({ title: '请输入正确的手机号码！' });
    setPwd({
      pwd: this.data.password
    }).then(res => {
      return app.Tips({title:'修改成功！',icon:'success'},{tab:5,url:'/pages/other/download/index'});
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  register: function (){
    wx.navigateTo({
      url: '/pages/ucenter/user_register/index',
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
  onPullDownRefresh: function(){
    app.loaded()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})