
// pages/other/applicationpartner/index.js
import {
  addmemberapplication,
  findmemberapplication,
} from '../../../api/user.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    prizeList:[],
    model:1,
    PCD:'',
    street:'',
    mapName:'',
    shopList:[],
    memberApplicationFailRemark:'',// 驳回原因
    latitude:'',
    longitude:'',
    datalist:[],
    flag:2,// 是否有结果
    memberApplicationState:'',// 审核结果
    type:3,// 合伙人类型
    txtype:1,// 提现类型
    storeName:'',// 店铺名称
    regionId:"",// 地区ID
    storeadress:'',// 店铺地址
    businessScope:'',// 业务范围描述
    storeLogoimg:'',// 店铺LOGO
    phone:'',// 电话
    bankcard:'',// 银行卡
    bank:'',// 开户地址
    companyName:'',// 公司名称
    Alipay:'',// 支付宝账号
    AlipayName:'',// 支付宝名称
    weixin:'',// 微信账号
    weixinName:'',// 微信账号
    storeimg:'',// 店铺宣传图
    Frontcardimg:'',// 身份证正面
    Reversecardimg:'',// 身份证反面
    businessimg:'',// 营业执照
    parameter: {  
      'navbar': '1',
      'return': '1',
      'title': '服务站申请',
      'color': false
    },
  },
  shopListAction:function(){
    var that = this
    if(that.data.PCD){
      wx.navigateTo({
        url: '/pages/other/shopList/index?regionId='+that.data.regionId
      })
    }else{
      app.Tips({
        title: '请选择店铺所在地！'
      })
    }
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
            regionId:res.data.result.ad_info.adcode
          })
        }
      })
      }
     })
  },
  radioChange:function(e) {
    var that = this
    that.setData({
      model:e.detail.value
    })
  },
  txChange:function(e) {
    var that = this
    that.setData({
      txtype:e.detail.value
    })
  },
  Input:function(e){
    var that = this
    var name = e.currentTarget.dataset.name
    that.setData({
      [name]:e.detail.value
    })
  },
  imglogoAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.getImageUrl(tempFilePaths,'storeLogoimg')
      }
    })
  },
  storeimgAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.getImageUrl(tempFilePaths,'storeimg')
      }
    })
  },
  FrontcardAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.getImageUrl(tempFilePaths,'Frontcardimg')
      }
    })
  },
  ReversecardAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.getImageUrl(tempFilePaths,'Reversecardimg')
      }
    })
  },
  businessAction:function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        that.getImageUrl(tempFilePaths,'businessimg')
      }
    })
  },
  fromAction:function(){
    var that = this
    if (!that.data.storeName) return app.Tips({
      title: '请填写店铺名称！'
    })
    if (!that.data.PCD) return app.Tips({
      title: '请选择店铺所在位置！'
    })
    if (!that.data.street) return app.Tips({
      title: '请填写详细地址！'
    })
    if(that.data.model == 2){
    if (that.data.shopList.length == 0) return app.Tips({
      title: '请选择联盟商家店铺！'
    })
  }
    if (!that.data.businessScope) return app.Tips({
      title: '请填写业务范围描述！' 
    })
    if (!that.data.storeLogoimg) return app.Tips({
      title: '请上传店铺Logo！'
    })
    if (!that.data.storeimg) return app.Tips({
      title: '请上传店铺宣传图！'
    })
    if (!that.data.phone) return app.Tips({
      title: '请填写个人手机号！'
    })
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.data.phone)) return app.Tips({
      title: '请输入正确的手机号码!'
    });
    if (!that.data.Frontcardimg) return app.Tips({
      title: '请上传身份证正面照片！'
    })
    if (!that.data.Reversecardimg) return app.Tips({
      title: '请上传身份证反面照片！'
    })
    if (!that.data.businessimg) return app.Tips({
      title: '请上传营业执照照片！'
    })
    if(that.data.txtype == 1){
      if (!that.data.bankcard) return app.Tips({
        title: '请填写银行卡号！'
      })
      if (!that.data.bank) return app.Tips({
        title: '请填写开户行名称！'
      })
      if (!that.data.companyName) return app.Tips({
        title: '请填写公司名称！'
      })
    }
    if(that.data.txtype == 2){
      if (!that.data.Alipay) return app.Tips({
        title: '请填写支付宝账号！'
      })
      if (!that.data.AlipayName) return app.Tips({
        title: '请填写支付宝名称！'
      })
    }
    if(that.data.txtype == 3){
      if (!that.data.weixin) return app.Tips({
        title: '请填写微信账号！'
      })
      if (!that.data.weixinName) return app.Tips({
        title: '请填写微信昵称！'
      })
    }
    that.setData({
      storeadress:that.data.PCD + that.data.street
    })
    addmemberapplication({
      registType:that.data.type,
      regionId:that.data.regionId,
      shopName:that.data.storeName,
      shopAdressDetail:that.data.storeadress,
      shopType:that.data.businessScope,
      userPhoto05:that.data.storeLogoimg,
      userPhoto06:that.data.storeimg,
      phoneNo:that.data.phone,
      userPhoto01:that.data.Frontcardimg, 
      userPhoto02:that.data.Reversecardimg,
      userPhoto04:that.data.businessimg,
      bankCardAccountNumber:that.data.bankcard, 
      bankName:that.data.bank,
      corporateName:that.data.companyName,
      alipayAccount:that.data.Alipay,
      alipayName:that.data.AlipayName,
      wechatAccount:that.data.weixin,
      wechatName:that.data.weixinName,
      lat:that.data.latitude,
      lng:that.data.longitude,
      adminIds:JSON.stringify(that.data.prizeList)
    }).then(res => {
      if(res.respCode == '9999'){
        return app.Tips({
          title: res.respMsg
        })
      }
      that.getdetail()
      that.setData({ 
        flag:1,
        memberApplicationState:"01",
      })
    }).catch(err => {
        return app.Tips({
          title: err
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  upAction:function(){
    var that = this 
    var list = that.data.datalist[0]
    that.setData({
      type:list.registType,
      regionId:list.regionId,
      storeName:list.shopName,
      storeadress:'',
      businessScope:list.shopType,
      storeLogoimg:list.userPhoto05,
      storeimg:list.userPhoto06,
      phone:list.phoneNo,
      Frontcardimg:list.userPhoto01,
      Reversecardimg:list.userPhoto02,
      businessimg:list.userPhoto04,
      bankcard:list.bankCardAccountNumber,
      bank:list.bankName,
      companyName:list.corporateName,
      Alipay:list.alipayAccount,
      AlipayName:list.alipayName, 
      weixin:list.wechatAccount,
      weixinName:list.wechatName,
    //  latitude:list.lat,
    //  longitude:list.lng,
      flag:2,
      memberApplicationState:''
    })
  },
  getdetail:function() {
    var that = this
    findmemberapplication({
      type:2
    }).then(res => {
      that.setData({
        flag:res.flag,
        memberApplicationState:res.list[0].memberApplicationState,
        datalist:res.list,
        shopModel: res.list[0].registType
      })
      if(this.data.shopModel == 4) {
        this.setData({
          flag: 2
        })
      }
    })
  },
  onLoad: function (options) {
    this.getdetail()
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
    var that = this;
    that.setData({
      shopList:[]
    })
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页
    var prizeList = currPage.data.prizeList
    if (currPage.data.prizeList) {
      var shopList = []
      for(var item of prizeList) {
        shopList.push(item.name)
      }
      shopList = shopList.join(',')
      that.setData({
        prizeList,
        shopList
      })
    }
  },
  getImageUrl:function(filePathUrl,imgUrl) {
    var that = this
    wx.uploadFile({
      url: 'https://yjlc.yijialianchuang.com/yjlc/api/file/uploadFile',//
      filePath: filePathUrl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: null,
      success: function (res) {
        var imgurl = ''+imgUrl+''
        var url = JSON.parse(res.data).urlPath
        that.setData({
          [imgurl]:url
        })
      }
    })
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