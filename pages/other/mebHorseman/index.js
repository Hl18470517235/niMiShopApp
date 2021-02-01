import {
  mebHorseman,
  findHorseman,
  updateHorseman
} from '../../../api/user.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['省', '市', '区'],
    detailModel:false,
    upDataList:{},
    horseManId:'',
    masModel:false,
    horseManPhotoOne:'',// 身份证正面
    horseManPhotoTwo:'',// 身份证反面
    horseManName:'',//姓名
    horseManType:1,//1全职，2兼职
    horseManRegion:'',//负责区域
    horseManPhone:'',//工作电话
    horseManRealPhone:'',//平常电话
    PCD:'',
    street:'',
    horseManState:'',
    horseManStateRemark:'',
    memberApplicationFailRemark:'',// 驳回原因
    latitude:'',
    longitude:'',
    datalist:[],
    flag:0,// 是否有结果
    memberApplicationState:'',// 审核结果
    regionId:"",// 地区ID
    parameter: {  
      'navbar': '1',
      'return': '1',
      'title': '申请骑手',
      'color': false
    },
  },
  close:function(){
    var that = this
    that.setData({
      detailModel:false,
      masModel:false
    })
  },
  shopAction:function() {
    var that = this
    wx.chooseLocation({
      type: 'gcj02',
      success (res) {
      that.setData({
        //storeadress:res.address,
        latitude:res.latitude,
        longitude:res.longitude
      })
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/?location='+that.data.latitude+','+that.data.longitude, //仅为示例，并非真实的接口地址
        data: {
          key:app.globalData.mapKey
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          var detailList = res.data.result.address_component
          var province = detailList.province
          var city = detailList.city
          var district = detailList.district
          var street_number = detailList.street_number
          var PCD = province + city + district
          that.setData({
            street:street_number,
            PCD,
            horseManRegion:res.data.result.ad_info.adcode
          })
        }
      })
      }
     })
  },
  successAction:function(){
    var that = this
    that.setData({
      horseManPhone:that.data.upDataList.horseManPhone,
      horseManRealPhone:that.data.upDataList.horseManRealPhone,
      horseManId:that.data.upDataList.horseManId,
      detailModel:true,
      masModel:true,
    })
  },
  radioChange:function(e) {
    var that = this
    that.setData({
      horseManType:e.detail.value
    })
  },
  Input:function(e){
    var that = this
    var name = e.currentTarget.dataset.name
    that.setData({
      [name]:e.detail.value
    })
  },
  //身份证正面
  FrontcardAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          horseManPhotoOne:tempFilePaths
        })
      }
    })
  },
  // 身份证反面
  ReversecardAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.setData({
          horseManPhotoTwo:tempFilePaths
        })
      }
    })
  },
  upData:function(){
    var that = this
    if (!that.data.horseManPhone) return app.Tips({
      title: '请填写工作手机号！'
    })
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.data.horseManPhone)) return app.Tips({
      title: '工作手机号有误!'
    });
    if (!that.data.horseManRealPhone) return app.Tips({
      title: '请填写常用手机号！'
    })
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.data.horseManRealPhone)) return app.Tips({
      title: '常用手机号有误!'
    });
    var data = {
      horseManPhone:that.data.horseManPhone,
      horseManRealPhone:that.data.horseManRealPhone,
      horseManId:that.data.horseManId
    }
    updateHorseman(data).then(res => {
      if(res.respCode == '0000'){
        return app.Tips({
          title: res.respMsg
        })
      }else{
        return app.Tips({
          title: res.respMsg
        })
      }
    })
    this.close()
  },
  getmebHorseman:function(){
    var that = this
    var data = {
      horseManPhotoOne:that.data.horseManPhotoOne,// 身份证正面
      horseManPhotoTwo:that.data.horseManPhotoTwo,// 身份证反面
      horseManName:that.data.horseManName,//姓名
      horseManType:that.data.horseManType,//1全职，2兼职
      horseManRegion:that.data.horseManRegion,//负责区域
      horseManPhone:that.data.horseManPhone,//工作电话
      horseManRealPhone:that.data.horseManRealPhone,//平常电话
    }
    mebHorseman(data).then(res => {
      this.findHorse()
      that.setData({
        flag:1,
        horseManState:98
      })
    })
  },
  fromAction:function(){
    var that = this
    if (!that.data.horseManName) return app.Tips({
      title: '请填写骑手姓名！'
    })
    if (!that.data.horseManRegion) return app.Tips({
      title: '请填写负责地区！'
    })
    if (!that.data.horseManPhone) return app.Tips({
      title: '请填写工作手机号！'
    })
    if (!that.data.horseManRealPhone) return app.Tips({
      title: '请填写常用手机号！'
    })
    if (!that.data.horseManPhotoOne) return app.Tips({
      title: '请上传身份证正面！'
    })
    if (!that.data.horseManPhotoTwo) return app.Tips({
      title: '请上传身份证反面！'
    })
    this.getmebHorseman()
  },
  bindRegionChange: function (e) {
    this.setData({
      horseManRegion:e.detail.code[2],
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  upAction:function(){
    var that = this
    var list = that.data.upDataList
    that.setData({
      horseManPhotoOne:list.horseManPhotoOne,
      horseManPhotoTwo:list.horseManPhotoTwo,
      horseManName:list.horseManName,
      horseManType:list.horseManType,
      horseManPhone:list.horseManPhone,
      horseManRealPhone:list.horseManRealPhone,
      flag:2
    })
  },
  findHorse:function(){
    var that = this
    findHorseman({}).then(res => {
      that.setData({
        flag:res.flag,
        horseManState:res.horseManBean.horseManState,
        horseManStateRemark:res.horseManBean.horseManStateRemark,
        upDataList:res.horseManBean
      })
    })
  },
  onLoad: function (options) {
    this.findHorse()
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
    this.getdetail()
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