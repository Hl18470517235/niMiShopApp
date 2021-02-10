// pages/shopHome/index.js
import { findShopBindType } from '../../api/shopHome.js'
import {  postCartAdd } from '../../api/store.js';
import Util from '../../utils/util.js';
import {
  getCategoryList,
  getProductslist
} from '../../api/store.js';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '江西宜春富硒年货馆',
      'color': true,
      'class': '6'
    },
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    type:1,
    isAuto:false,
    iShidden:false,
    navModal: true,
    categoryList: [],
    navScrollLeft: 0,
    currentTab: 0,
    categoryNum: 0,
    adminId: '',
    aniModel: false,
    pageNo: 1,
    navData: [],
    barHeight: 0,
    toView: ''
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
    this.setData({
      toView: `item${cur}`,
    })
},
  async getProductslist(index) {
    const data = {
      isFlag: 2, //地区商城1， 全国商城2， 商家联盟3
      pageNo: this.data.categoryList[index].pageNo,
      shopId: '82021012617480725484294307901120',
      pageSize: 9,
      productTypeId: this.data.productTypeId
    }
    let result = await getProductslist(data)
    this.getProductList(result.pageInfo.list, result.pageInfo.total, index)
  },
  async findShopBindType() {
    const data = {
      type: '2',
      adminId: this.data.adminId
    }
    const result = await findShopBindType(data)
    this.setCategory(result.list)
  },
  getProductList(list, total, index) {
    let dataList = `categoryList[${index}].productList`
    let totalModal = `categoryList[${index}].totalModal`
    let itemModal = `categoryList[${index}].itemModal`
    if(list.length % 3 == 0) {
      this.setData({
        [itemModal]: false
      })
    } else {
      this.setData({
        [itemModal]: true
      })
    }
    list.map((item, index) => {
      item.price = (item.price / 100).toFixed(2)
      item.shopPrice = (item.shopPrice / 100).toFixed(2)
      item.showImg = false
    })
    if(this.data.categoryList[index].pageNo * 9 > total) {
      this.setData({
        [totalModal]: false
      })
    }
    let newList = this.data.categoryList[index].productList
    newList.push(...list)
    this.setData({
      [dataList]: newList
    })
    this.scrollShow()
  },
  addToCart(e) {
    if(!app.globalData.model){
      this.authorize.setAuthStatus()
      return; 
    }
    let item = e.currentTarget.dataset.item
    if(item.count == 0) {
      return app.Tips({
        title: '商品库存不足'
      })
    }
    postCartAdd({productId: item.productId}).then(res => {
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
    })
  },
  setCategory(list) {
    let leaveId = ''
    let categoryList = []
    list.map(item => {
      if(item.productTypeLeaveId == null) {
        leaveId = item.productTypeId
      }
    })
    let navData = []
    list.map((item, index) => {
      if(item.productTypeLeaveId !== leaveId) {
        if(item.productTypeLeaveId) {
        list[index].productList = []
        list[index].totalModal = true
        list[index].pageNo = 1
        list[index].itemModal = false
        categoryList.push(item)
        navData.push(item.productTypeName)
        }
      }
    })
    this.setData({
      categoryList,
      navData
    })
    categoryList.map((item, index) => {
      this.setData({
        productTypeId: item.productTypeId
      })
      this.getProductslist(index)
    })
  },
  itemAction(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/goods_details/index?id=' + id
    })
  },
  bindscroll(e) {
    let that = this
    let id = `#navbar`
    wx.createSelectorQuery().select(id).boundingClientRect(function(rect){
      // 节点的上边界坐标
      let top = rect.top;
      let barHeight = that.data.barHeight
      if(top - barHeight < 0) {
        that.setData({
          navModal: false
        })
      } 
      if(top - barHeight > 0) {
        that.setData({
          navModal: true
        })
      }
  }).exec()
  wx.nextTick(() => {
    that.scrollShow()
  })
  },
  scrollShow() {
    const that = this
    wx.createSelectorQuery().selectAll('.header-boxs').boundingClientRect((ret)=>{
      ret.forEach((item, index) => {
        if(item.top < that.data.windowHeight)
        that.showImg(index)
      })
    }).exec()
  },
  showImg(index) {
    const that = this
    let item = '.img' + index
    wx.createSelectorQuery().selectAll(item).boundingClientRect((ret)=>{
      ret.forEach((item, indexs) => {
        if(item.top < that.data.windowHeight) {
          let showImgData = `categoryList[${index}].productList[${indexs}].showImg`
          that.setData({
            [showImgData]: true
          })
        }
      })
    }).exec()
  },
  searchAll(e) {
    const index = e.currentTarget.dataset.index
    let pageNo = `categoryList[${index}].pageNo`
    this.setData({
      [pageNo]: this.data.categoryList[index].pageNo + 1,
      productTypeId: this.data.categoryList[index].productTypeId
    })
    this.getProductslist(index)
  },
  fixdBtnEvent() {
    let animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    let animations = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.setData({
      aniModel: !this.data.aniModel
    })
    if(this.data.aniModel) {
      animation.rotate(45).step()
      animations.height(180).step()
    } else {
      animation.rotate(0).step()
      animations.height(30).step({
        duration: 200,
        timingFunction: 'ease',
      })
    }
    this.setData({
      animationData: animation.export(),
      heightAni: animations.export()
    })
  },
  goHome() {
  wx.switchTab({
    url: '/pages/index/index',
  }); 
  },
  goCar() {
    wx.switchTab({
      url: '/pages/order_addcart/order_addcart',
    }); 
  },
  goTop: function (e) {  // 一键回到顶部
    this.setData({
      toView: 'item100',
    })
    // if (wx.pageScrollTo) {
    //   wx.pageScrollTo({
    //     scrollTop: 0
    //   })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      adminId: options.id
    })
    Util.chekWxLogin().then(res => {
      app.globalData.model = res.isLogin
      app.globalData.userInfo = res.userinfo
      app.globalData.token = res.userinfo.userId;
    })
    this.findShopBindType()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      success: (res) => {
        wx.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
          that.setData({
            barHeight: rect.height,
          })
        }).exec()
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
  }) 
  this.authorize = this.selectComponent('#authorize')
  this.scrollShow()   
  },
   goLiving() {
      wx.switchTab({
        url: '/pages/roomshop/index',
      }); 
   },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currentTab: 0,
      categoryNum: 0
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
    let data = {
      title: '2021“美好生活·富硒年货”宜春市网上年货节丨火热进行中，快来抢购家乡味',
      imageUrl: 'https://yjlc.yijialianchuang.com/yjlc/file/group3/M00/00/78/wKh9DGAPvJyAb5FWAAq3NBw3-8I138.png',
      path: '/pages/shopHome/index?id=82021012617480725484294307901120',
    }
    return data;
  },
  /**
  *分享到朋友圈
  */
  onShareTimeline: function () {
  let data = {
      title: '2021“美好生活·富硒年货”宜春市网上年货节丨火热进行中，快来抢购家乡味',
      imageUrl:  'https://yjlc.yijialianchuang.com/yjlc/file/group3/M00/00/78/wKh9DGAPvJyAb5FWAAq3NBw3-8I138.png',
      path: '/pages/shopHome/index?id=82021012617480725484294307901120',
    }
  return data;
  }
})