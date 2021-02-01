// pages/order/ordermap/index.js
import { getThreeDw } from '../../../api/order.js';
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    name:'',
    phone:'',
    s:"",
    parameter: {
      'navbar': '1', 
      'return': '1',
      'title': '位置信息',
      'color': true,
      'class': '0'
    },
    shopLat: "",
    shopLng: "",
    distributionStatus:'1',
    toData:'',
    distance:'',
    horseManLat: "",
    horseManLng: "",
    //纬度
    latitude: '',
    //经度
    longitude: '',
    //标记点
    markers: [{
      //标记点 id
      id: 1,
      //标记点纬度
      latitude: '',
      //标记点经度
      longitude: '',
      title:'',
      iconPath: "/image/shopmap.png",
      width:35,
      height:35
    },
    {
      //标记点 id
      id: 2,
      //标记点纬度
      latitude: '',
      //标记点经度
      longitude: '',
      iconPath: "/image/mapwm.png",
      width:35,
      height:35
    },
    {
      //标记点 id
      id: 3,
      //标记点纬度
      latitude: '',
      //标记点经度
      longitude: '',
      iconPath: "/image/mapuser.png",
      width:35,
      height:35
    }
  ],
  },
  callPhone:function(e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.phone
    })
  },
  getHorsemanHttp:function() {
    var that = this
    var data = {
      orderId:that.data.orderId
    }
    getThreeDw(data).then(res => {
      var shopLat = 'markers[0].latitude'
      var title = 'markers[0].title'
      var shopLng = 'markers[0].longitude'
      var horseLat = 'markers[1].latitude'
      var horseLng = 'markers[1].longitude'
      var userLat = 'markers[2].latitude'
      var userLng = 'markers[2].longitude'
      //进行经纬度转换为距离的计算
      function Rad(d){
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
      }
 
     var phone = res.horseManPhone
     var name = res.horseManName
      that.setData({
        [title]:res.shopName,
        [shopLat]:res.shopLat,
        [shopLng]:res.shopLng,
        [horseLat]:res.horseManLat,
        [horseLng]:res.horseManLng,
        [userLat]:res.userLat,
        [userLng]:res.userLng,
        latitude:res.userLat,
        longitude:res.userLng,
        distributionStatus:res.distributionStatus,
        phone,
        name,
      })
      console.log(that.data.longitude)
      this.formSubmit()
      this.formSubmit1()
    })
  },
  formSubmit1(){
    var _this = this;
    var from =  _this.data.markers[1].latitude + ',' +_this.data.markers[1].longitude
    var toData = _this.data.markers[0].latitude + ',' +_this.data.markers[0].longitude
    if(_this.data.distributionStatus == '2') {
      var toData = _this.data.latitude + ',' +_this.data.longitude
    }
    //调用距离计算接口
    qqmapsdk.calculateDistance({
        //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        //from参数不填默认当前地址
        //获取表单提交的经纬度并设置from和to参数（示例为string格式）
        from:from || '', //若起点有数据则采用起点坐标，若为空默认当前地址
        to: toData, //终点坐标
        success: function(res) {//成功后的回调
          var res = res.result;
          var dis = [];
          for (var i = 0; i < res.elements.length; i++) {
            dis.push(res.elements[i].distance); //将返回数据存入dis数组，
          }
          _this.setData({ //设置并更新distance数据
            distance: dis
          });
        },
        fail: function(error) {

        },
        complete: function(res) {

        }
    });
},
  formSubmit(e) {
    var _this = this;
    var from =  _this.data.markers[1].latitude + ',' +_this.data.markers[1].longitude
    var toData = _this.data.markers[0].latitude + ',' +_this.data.markers[0].longitude
    if(_this.data.distributionStatus == '2') {
      var toData = _this.data.latitude + ',' +_this.data.longitude
    }
    //调用距离计算接口
    qqmapsdk.direction({
      mode: _this.data.mode,//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: from,
      to: toData, 
      success: function (res) {
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {

      },
      complete: function (res) {

      }
    });
  },
  /**
   * 
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    qqmapsdk = new QQMapWX({
      key: app.globalData.mapKey
  });
    // wx.getLocation({
    //   type: 'wgs84',
    //   success (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     that.setData({
    //       latitude,
    //       longitude
    //     })
    //   } 
    //  })
    var orderId = options.orderId
    this.setData({
      orderId
    })
    this.getHorsemanHttp()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
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