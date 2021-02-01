// pages/roomshop/index.js
const format=require("../../utils/util.js");
const app = getApp();
var gettime = require('../../utils/time.js')
import {getNimiRoom,selectNimiIndustryType} from '../../api/store.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '直播商城',
      'color': true,
      'class': '5',
    },
    findType:"2",
    navData:['www','www','www','www','www','www','www','www',],
    categoryNum: 0,
    navScrollLeft: 0,
    timeS:false,
    regionId:'',
    listNum:1,
    roomList:[],
    pageSizeNum:5,
    showModal:false,
    categorylist1:[],
    categoryModel:false,
    categorylist2:[],
    categorylistAll:[],
    miniRoomIndustryType:"",
    navIndex2:-1,
    nowTime: new Date().getTime(),
    pageModel:false,
    floorstatus:false,
    nimiTypeId:""
  },
  allAction:function(){
    this.setData({showModal:true})
  },
  allCategoryAction:function() {
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    });
    if(!that.data.categoryModel){
      if(that.data.categorylist2.length > 6) {
        animation.height(220).step()
      }else{
        animation.height(150).step()
      }
    }else{
      animation.height(68).step()
    }
    this.setData({
      categoryModel:!that.data.categoryModel,
      ani:animation.export()
    })
  },
  navaciton1:function(index){
    wx.navigateTo({
      url: '/pages/goods/goods_details/index?id='+index.currentTarget.dataset.index,
    })
  },
  navaciton2:function(index){
    wx.navigateTo({
      url: '/pages/goods/first-new-product/index?type=7&id='+index.currentTarget.dataset.index,
    })
  },
  roomaction:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/roomshop/roomdetail/index?id='+e.currentTarget.dataset.id,
    })
  },
  twoNavAction:function(index){
    var cur = index.currentTarget.dataset.current; 
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
        navScrollLeft: (cur - 2) * singleNavWidth
    })      
    if (this.data.currentTab == cur) {
        return false;
    } else {
        this.setData({
          currentTab: cur,
          categoryNum: 0
        })
    }
    let num = cur - 1
    var that = this
    this.setData({
      categoryModel:false,
      pageSizeNum:5,
      navIndex2:index.currentTarget.dataset.index,
      nimiTypeId:index.currentTarget.dataset.id
    })
    this.getRoomHttp()
  },
  adInputChange:function(e){
    var that = this
    var data = {
      isMaster:"true",
      pageNo:1,
      type:"1",
      name:e.detail.value,
      pageSize:that.data.pageSizeNum,
      regionId:app.globalData.region_id,
    }
    getNimiRoom(data).then(res => {
    var list = res.pageInfo.list;
    list.forEach((item,index) => {
      item.start_timeone = gettime.formatDate(item.start_time)
      item.end_timeone = gettime.formatDate(item.end_time)
      item.start_timetwo = gettime.formatDate1(item.start_time)
      item.end_timetwo = gettime.formatDate1(item.end_time)
      item.timeModel = "0"
      item.timeModel1 = "0"
      item.timeModel2 = "0"
        var starttime = Date.parse(new Date(item.start_time));
        var endtime = Date.parse(new Date(item.end_time));
        var num = index
        var nowTime = new Date().getTime()
        var finalTime = Date.parse(new Date(starttime)) - nowTime;
        var finalTime2 = Date.parse(new Date(endtime)) - nowTime;
        if(finalTime2 > 0 &&  finalTime < 0 && item.timeModel == "0"){
          item.timeModel = "0"
          item.timeModel2 = "0"
          item.timeModel1 = "1"
        }
            if(finalTime > 0 ){
              item.timeObj = {}
              item.timeModel1 = "0"
              item.timeModel2 = "0"
              item.timeModel = "1"
              var id = item.mini_room_id
              gettime.countDownone(this,starttime,num,id)
            }
        if(finalTime2 < 0){
          item.timeModel = "0"
          item.timeModel1 = "0"
          item.timeModel2 = "1"
        }
    })
      this.setData({
        roomList:list,
        navIndex2:-1
      })
    })
  },
  btnAction:function(){
    this.setData({showModal:false})
  },
  allNavAction:function(){
    var that = this
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
      delay: 0
    });

      animation.height(68).step()
    this.setData({
      ani:animation.export(),
      categoryModel:false,
      navIndex2:-1,
      nimiTypeId:""
    })
this.getRoomHttp()
  },
  getRoomHttp:function(){
    var that = this
    selectNimiIndustryType({
      findType:"1",
    }).then(res => {
      var categorylistone = []
      res.list.forEach((item) => {
        if(item.nimiIndustryTypeLevel == "3") {
          categorylistone.push(item)
        }
      }) 
      this.setData({
        categorylist1:categorylistone,
        categorylist2:categorylistone.slice(4),
        categorylistAll:categorylistone
      })
      // if(that.data.navIndex2 > -1) {
      //   this.setData({
      //     nimiTypeId:that.data.categorylist1[that.data.navIndex2].nimiIndustryTypeId
      //   })
      // }
      var data = {
        isMaster:"true",
        findType:"",
        pageNo:1,
        type:"1",
        name:"",
        pageSize:that.data.pageSizeNum,
        regionId:app.globalData.region_id,

        miniRoomIndustryType:that.data.nimiTypeId
      }
      getNimiRoom(data).then(res => {
        function formatTen(num) { 
          return num > 9 ? (num + "") : ("0" + num); 
      } 
      var list = res.pageInfo.list;
      list.forEach((item,index) => {
        item.start_timeone = gettime.formatDate(item.start_time)
        item.end_timeone = gettime.formatDate(item.end_time)
        item.start_timetwo = gettime.formatDate1(item.start_time)
        item.end_timetwo = gettime.formatDate1(item.end_time)
        item.timeModel = "0"
        item.timeModel1 = "0"
        item.timeModel2 = "0"
              var starttime = Date.parse(new Date(item.start_time));
              var endtime = Date.parse(new Date(item.end_time));
              var num = index
              var nowTime = new Date().getTime()
              var finalTime = Date.parse(new Date(starttime)) - nowTime;
              var finalTime2 = Date.parse(new Date(endtime)) - nowTime;
          if(finalTime2 > 0 &&  finalTime < 0){
            this.setData({
              timeS:false
            })
            item.timeModel = "0"
            item.timeModel2 = "0"
            item.timeModel1 = "1"
          }
              if(finalTime > 0){
                item.timeObj = {}
                item.timeModel1 = "0"
                item.timeModel2 = "0"
                item.timeModel = "1"
                var id = item.mini_room_id
                gettime.countDownone(this,starttime,num,id)
              }
          if(finalTime2 < 0){  
            item.timeModel = "0"
            item.timeModel1 = "0"
            item.timeModel2 = "1"
          }
      })
      if(that.data.pageSizeNum > res.pageInfo.total){
        this.setData({pageModel:true})
      }
        this.setData({
          roomList:list
        })
      })
    })
  },
  switchNav(event){
    var cur = event.currentTarget.dataset.current; 
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
        navScrollLeft: (cur - 2) * singleNavWidth
    })      
    if (this.data.currentTab == cur) {
        return false;
    } else {
        this.setData({
          currentTab: cur,
          categoryNum: 0
        })
    }
    let num = cur - 1
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRoomHttp()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
  })    
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
 this.getRoomHttp()
  },
  onPageScroll:function(e){ // 获取滚动条当前位置
    if (e.scrollTop > 250) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
},
goTop: function (e) {  // 一键回到顶部
  if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var pagesize = that.data.pageSizeNum
    this.setData({pageSizeNum:pagesize+5})
    this.getRoomHttp()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})





