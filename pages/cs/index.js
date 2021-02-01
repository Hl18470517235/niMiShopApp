// pages/cs/index.js
import {
  getAddressList
} from '../../api/user.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userId:'82020092513102451792153775463944',
  },
 async http() {
   console.log(this)
   var data = {
     userId:this.data.userId,
     page:1,
     limit:8
   }
   let result = await getAddressList(data);
   console.log(result.listadr[0])
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.http();
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

  }
})