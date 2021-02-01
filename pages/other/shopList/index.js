// pages/other/shopList/index.js
import {
  selectSjShopInfo
} from '../../../api/user.js';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {  
      'navbar': '1',
      'return': '1',
      'title': '联盟商店列表',
      'color': false
    },
    regionId:'',
    pageSize:20,
    shopList:[],
    selectList:[],
    detailModel:false,
    masModel:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  fromAction:function(){
    var that = this;
    var pages = getCurrentPages(); 
    var prevPage = pages[pages.length - 2];   //上一页
    prevPage.setData({
      prizeList: that.data.selectList
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },
  close:function(){
    var that = this
    that.setData({
      detailModel:false,
      masModel:false
    })
  },
  searchAction:function(){
    var that = this 
    if(that.data.selectList.length == 0){
      return app.Tips({
        title: '您还没有选择商店哦~'
      })
    }else{
      that.setData({
        detailModel:true,
        masModel:true
      })
    }
  },
  delAction:function(e){
    var that = this
    var adminId = e.currentTarget.dataset.adminid
    var index = e.currentTarget.dataset.index
    var list = that.data.selectList
    list.splice(index,1)
    var shopList = that.data. shopList
    shopList.forEach(item => {
      if(item.adminId == adminId) {
        item.model = true
      }
    })
    that.setData({
      selectList:list,
      shopList
    })
  },
  addAction:function(e){
    var that = this
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var list = that.data.selectList
    list.push(item)
    var c = 'shopList['+index+'].model'
    that.setData({
      selectList:list,
      [c]:false
    })
  },
  getShopList:function(){
    var that = this
    var data = {
      pageNo:1,
      pageSize:that.data.pageSize,
      yjlcRegionId:that.data.regionId
    }
    selectSjShopInfo(data).then(res => {
      var shopList = res.pageInfo.list
      for(var item of shopList) {
        item.model = true
      }
      that.setData({
        shopList
      })
    })
  },
  onLoad: function (options) {
    var that = this 
    that.setData({
      //regionId:options.regionId
      regionId:'360902'
    })
    this.getShopList()
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