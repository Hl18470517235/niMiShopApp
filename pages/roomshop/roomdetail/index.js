// pages/roomshop/roomdetail/index.js
import {getNimiRoom,getRoomHistory} from '../../../api/store.js'
const app = getApp();
var getTime = require('../../../utils/time.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId:"",
    historyNumber:0,
    nowTime: new Date().getTime(),
    endTime: 1833177202000,//结束日期时间戳
    timeModel:false,
    timeModel1:false,
    remainTime: null,
    countDownTxt:null,
    historyNum:0,
    index:" ",
    historyPage:5,
    historyList:[],
    HistoryRoomUrl:'',
    timestart:"",
    timestart1:"",
    timeModel2:"",
    endtime:"",
    endtime1:"",
    roomItem:{},
    miBaoBaoRoomUrl:'',
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '主播首页',
      'color': true,
      'class': '5',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // roomaction:function(url){
  //   wx.navigateTo({
  //     url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+url.currentTarget.dataset.index+"&custom_params={{customParams}}"
  //   })
  //   console.log(url.currentTarget.dataset.index)
  // },
  // navaciton1:function(index){
  //   wx.navigateTo({
  //     url: '/pages/goods/goods_details/index?id='+index.currentTarget.dataset.index,
  //   })
  // },
  // navaciton2:function(index){
  //   wx.navigateTo({
  //     url: '/pages/goods/first-new-product/index?type=7&id='+index.currentTarget.dataset.index,
  //   })
  // },
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
  getHistoryRoom:function(){
    var that = this
    var data = {
      isMaster:"true",
      type:"1", 
      pageNo:1,
      pageSize:100,
      regionId:app.globalData.region_id,
    }
    getNimiRoom(data).then(res => {
      var Historydata = {
        type:"1",
        miniRoomId:that.data.roomId,
        pageNo:1,
        pageSize:that.data.historyPage
      } 
      getRoomHistory(Historydata).then(res => {
        var list = res.list
        var listNum = res.total
        if(list.length == 0){return}
        list.forEach((item) => {
          function formatTen(num) { 
            return num > 9 ? (num + "") : ("0" + num); 
          } 
          function formatDate(date) { 
              var date = new Date(date)
              var year = date.getFullYear(); 
              var month = date.getMonth() + 1; 
              var day = date.getDate(); 
              var hour = date.getHours(); 
              var minute = date.getMinutes(); 
              var second = date.getSeconds(); 
              return formatTen(month) +"月" + formatTen(day)+ "日" +formatTen(hour)+ ":" +formatTen(minute)+ ":" +formatTen(second); 
          } 
          var time = formatDate(item.start_time)
          item.historytime = time
          item.historyUrl = "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+item.room_id+"&custom_params={{customParams}}"
        })
        that.setData({
          historyList:list,
          historyNum:listNum,
        })
      })
      var RoomList = {}
      res.pageInfo.list.forEach((item) => {
if(that.data.roomId == item.mini_room_id){
RoomList = item
}
      })
      function formatTen(num) { 
        return num > 9 ? (num + "") : ("0" + num); 
    } 
    function formatDate(date) { 
        var date = new Date(date)
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate(); 
        var hour = date.getHours();  
        var minute = date.getMinutes(); 
        var second = date.getSeconds(); 
        return formatTen(month) + "月" + formatTen(day)+ "日" +formatTen(hour)+ ":" +formatTen(minute)+ ":" +formatTen(second); 
    } 
    function formatDate1(date) { 
      var date = new Date(date)
      var hour = date.getHours(); 
      var minute = date.getMinutes(); 
      var second = date.getSeconds(); 
      return formatTen(hour)+ ":" +formatTen(minute)+ ":" +formatTen(second); 
  } 
    var starttime = Date.parse(new Date(RoomList.start_time));
    var endtime = Date.parse(new Date(RoomList.end_time));
    var nowTime = new Date().getTime()
    var finalTime = Date.parse(new Date(starttime)) -  nowTime;
    var finalTime2 = Date.parse(new Date(endtime)) -  nowTime;
    if(finalTime > 0){
      that.setData({
        timeModel:true,
        timeModel1:false
      }) 
      getTime.countDown(this,starttime); 
    }
if(finalTime2 > 0 &&  finalTime < 0){
  that.setData({
    timeModel2:true
  })
}
if(finalTime2 < 0){
  that.setData({
    timeModel1:true,
    timeModel2:false,
    historyNumber:1
  })
}
      this.setData({
        endtime1:formatDate1(RoomList.end_time),
        timestart1:formatDate1(RoomList.start_time),
        timestart:formatDate(RoomList.start_time),
        endtime:formatDate(RoomList.end_time),
        roomItem:RoomList,
        miBaoBaoRoomUrl:"plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+RoomList.room_id+"&custom_params={{customParams}}"
      })
    })
  },
  onLoad: function (options) {
    this.setData({
      roomId:options.id
    })
    this.getHistoryRoom()
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
    this.getHistoryRoom()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      historyPage:this.data.historyPage + 5
    })
    this.getHistoryRoom()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onShareTimeline: function () {
    let data = {
        title: this.data.roomItem.mini_room_name,
        //path: '/pages/roomshop/index',
      }
    return data;
    }
})