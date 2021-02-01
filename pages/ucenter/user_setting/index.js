import { getUserInfo} from '../../../api/user.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '设置',
      'color': false
    },
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onLoadFun:function(){
    this.getUserInfo();
  },
  getUserInfo:function(){
    var that=this;
    getUserInfo().then(res=>{
      let user = res.userAndQuotaBean
      let phone = user.userPhone
      that.setData({ phone: phone});
    });
  },
  unbind: function(){
    let that = this
    wx.showModal({
      title: '解绑APP账号',
      content: '确定要解除绑定当前APP账号？',
      success: function (res) {
        if (res.confirm) {
          that.setData({phone: ''})
        }
      }
    })
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

  },
})