// pages/businessAlliance/index.js
const app = getApp();
import {selectMuchShop,selectBusinessAllianceType} from '../../api/store.js'
import {
  getUserInfo,
} from '../../api/user.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商家联盟',
      'color': true,
      'class': '5',
    },
    categoryList:[],
    categoryModel:false,
    BusinessList:[],
    navIndex:-1,
    uid:"",
    categorytype:'2',
    pageSize:10,
    isAuto: false,
    iShidden:false
  },
  itemAction:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var list = JSON.stringify(that.data.BusinessList[index]);
    wx.navigateTo({
      url: '/pages/BusinessDetail/index?id='+id,
    })
    app.globalData.shopModel = false
  },
  allnavbtn:function(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    });
    var that = this
    this.setData({navIndex:-1})
    var data = {
      regionId:app.globalData.region_id,
      pageNo:1,
      pageSize:that.data.pageSize,
      type:that.data.shoptype
    }
    selectMuchShop(data).then(res => {
      var list = res.list;
      if(list !== 'undefined' && list !== null && list.length >0){
        for(var i = 0;i<list.length;i++){
          var label = list[i].shopType.split(",");
          list[i].labels = label;
        }
      }
      animation.height(64).step()
      this.setData({
        ani:animation.export(),
        categoryModel:false,
        BusinessList:list
      })
    })
  },
  catenavbtn:function() {
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    if(!that.data.categoryModel){
      if(that.data.categoryList.length > 6) {
        animation.height(198).step()
      }else{
        animation.height(135).step()
      }
    }else{
      animation.height(64).step()
    }
    this.setData({
      categoryModel:!that.data.categoryModel,
      ani:animation.export()
    })
  },
  navbtn:function(e){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    });
    var that = this
    this.setData({navIndex:e.currentTarget.dataset.index})
    var id = e.currentTarget.dataset.id
    var data = {
      regionId:app.globalData.region_id,
      pageNo:1,
      pageSize:that.data.pageSize,
      shopType:id,
      type:that.data.shoptype
    } 
    selectMuchShop(data).then(res => {
      var list = res.list
      if(list !== 'undefined' && list !== null && list.length >0){
        for(var i = 0;i<list.length;i++){
          var label = list[i].shopType.split(",");
          list[i].labels = label;
        }
      }
      animation.height(64).step()
      this.setData({
        ani:animation.export(),
        BusinessList:list,
        categoryModel:false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadFun: function (e) {
    getUserInfo().then(res => {
      let info = res.userAndQuotaBean
      this.setData({
        uid: info.userId
      });
    });
  },
  onLoad: function (options) {
    var that = this
     var shoptype = ''
     options.type == '3' ? shoptype = '2' : shoptype = null
    that.setData({
      shoptype,
      categorytype:options.type
    })
    var data = {
      type:shoptype,
      regionId:app.globalData.region_id,
      pageNo:1,
      pageSize:that.data.pageSize,
      type:that.data.shoptype
    }
    selectMuchShop(data).then(res => {
      var list = res.list
      if(list !== 'undefined' && list !== null && list.length >0){
        for(var i = 0;i<list.length;i++){
          var label = list[i].shopType.split(",");
          list[i].labels = label;
        }
      }
      this.setData({
        BusinessList:list
      })
    })
    selectBusinessAllianceType({
      pageNo:1,
      pageSize:10,
      findType:"2",
      type:that.data.categorytype
    }).then(res => {
      var list = []
      res.list.forEach((item) => {
        if(item.nimiIndustryTypeLevel == 2){
          list.push(item)
        }
      })
      this.setData({
        tabList:list.slice(0,4),
        categoryList:list.slice(4)
      })
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
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      pageSize:10
    })
    var data = {
      regionId:app.globalData.region_id,
      pageNo:1,
      pageSize:that.data.pageSize,
      type:that.data.shoptype
    }
    selectMuchShop(data).then(res => {
      var list = res.list
      if(list !== 'undefined' && list !== null && list.length >0){
        for(var i = 0;i<list.length;i++){
          var label = list[i].shopType.split(",");
          list[i].labels = label;
        }
      }
      this.setData({
        BusinessList:list
      })
    })
    selectBusinessAllianceType({
      pageNo:1,
      pageSize:10,
      findType:"2",
      type:that.data.categorytype
    }).then(res => {
      var list = []
      res.list.forEach((item) => {
        if(item.nimiIndustryTypeLevel == 2){
          list.push(item)
        }
      })
      this.setData({
        tabList:list.slice(0,4),
        categoryList:list.slice(4)
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.setData({
      pageSize:that.data.pageSize +10
    })
    var data = {
      regionId:app.globalData.region_id,
      pageNo:1,
      pageSize:that.data.pageSize,
      type:that.data.shoptype
    }
    selectMuchShop(data).then(res => {
      var list = res.list
      if(list !== 'undefined' && list !== null && list.length >0){
        for(var i = 0;i<list.length;i++){
          var label = list[i].shopType.split(",");
          list[i].labels = label;
        }
      }
      this.setData({
        BusinessList:list
      })
    })
    selectBusinessAllianceType({
      pageNo:1,
      pageSize:10,
      findType:"2",
      type:that.data.categorytype
    }).then(res => {
      var list = []
      res.list.forEach((item) => {
        if(item.nimiIndustryTypeLevel == 2){
          list.push(item)
        }
      })
      this.setData({
        tabList:list.slice(0,4),
        categoryList:list.slice(4)
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})