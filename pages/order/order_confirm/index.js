import {
  orderConfirm1,
  getCouponsOrderPrice,
  orderCreate,
  postOrderComputed,
  findUserDefalutTihuoShop,
  horseManDwCheck
} from '../../../api/order.js';
import {
  getAddressDefault,
  getAddressDetail
} from '../../../api/user.js';
import {
  openPaySubscribe
} from '../../../utils/SubscribeMessage.js';
import {
  findTiHuoShopOne
} from '../../../api/order.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopModel:true,
    textareaStatus: true,
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '提交订单',
      'color': true,
      'class': '0'
    },
    //支付方式
    cartArr: [{
        "name": "微信支付",
        "icon": "icon-weixin2",
        value: 'weixin',
        title: '微信快捷支付'
      },
      //{ "name": "余额支付", "icon": "icon-icon-test", value: 'yue',title:'可用余额:'},
      //{ "name": "线下支付", "icon": "icon-yinhangqia", value: 'offline', title: '线下支付' },
    ],
    cartInfo:[],
    shopLat:'',
    allPrices: 0,
    psPrice: 0,
    dispatchingType:1,
    lat:'',
    lng:'',
    isQs:null,
    userRegionId: '',
    shopRegionId: '',
    shopAdminType: '',
    selectNum: 1,
    shopLng:'',
    payType: 'weixin', //支付方式
    openType: 1, //优惠券打开方式 1=使用
    active: 0, //支付方式切换
    coupon: {
      coupon: false,
      list: [],
      statusTile: '立即使用'
    }, //优惠券组件
    address: {
      address: false
    }, //地址组件
    addressInfo: null, //地址信息
    pinkId: 0, //拼团id
    model:false,
    addressId: 0, //地址id
    couponId: 0, //优惠券id
    cartId: '', //购物车id
    tiHuoShopType:false,
    ishorsemanflag:'',
    userInfo: {}, //用户信息
    mark: '', //备注信息
    shopId:"",
    couponTitle: '请选择', //优惠券
    coupon_price: 0, //优惠券抵扣金额
    useIntegral: false, //是否使用积分
    integral_price: 0, //积分抵扣金额
    ChangePrice: 0, //使用积分抵扣变动后的金额
    formIds: [], //收集formid
    status: 0,
    TypeLabel:'小区服务站自提(三天内)',
    TypeLabel2:'到店',
    is_address: false,
    isClose: false,
    toPay: false, //修复进入支付时页面隐藏从新刷新页面
    shippingType: 0,
    system_store: {},
    storePostage: 0,
    totalAmount: 0,
    totalDiscount: 0,
    countType:false,
    contacts: '',
    addressModel: true,
    contactsTel: '',
    shipping_tips_show: false,
    tiHuoShop: {},
    onlyQuShop:false,
    findUserDefalutList:{},
  },
  /**
   * 授权回调事件
   * 
   */
  onLoadFun: function () {
    var that = this
    // this.getaddressInfo();
    findUserDefalutTihuoShop({
      regionId:app.globalData.region_id,
      shopId:that.data.shopId
    }).then(res => {
      var list = res.findTihuoShopBean
      var a = 'cartInfo[0]'
      that.setData({
        findUserDefalutList:list,
        //[a]:{tiHuoShop:{shopId:"sdfasfa",shopName:"你们",shopAdress:"你们好啊"}}
      })
      this.getConfirm();
    })
    //调用子页面方法授权后执行获取地址列表
    this.selectComponent('#address-window').getAddressList();
  },
  hideShippingTips: function(){
    this.setData({
      shipping_tips_show: false,
    })
  },
  showShippingTips: function(){
    this.setData({
      shipping_tips_show: true,
    })
  },
  headerAction(e) {
    const id = e.currentTarget.dataset.id
    if(id == '82021012617480725484294307901120') {
    wx.navigateTo({
      url: '/pages/shopHome/index?id=82021012617480725484294307901120',
    })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    let dt = {
      textareaStatus: true
    }
    let cartInfo = this.data.cartInfo;
    dt.cartInfo = cartInfo
    let address = wx.getStorageSync('selected_address')
    if(!address) {
      this.setData({
        addressModel: false
      })
    } else {
      this.setData({
        addressModel: true
      })
    }
    if (address) {
      that.setData({
        lat:address.lat,
        lng:address.lng,
        userRegionId: address.regionId
      })
      if(this.data.shopAdminType == '2') {
      if(this.data.shopRegionId) {
      if(this.data.userRegionId == this.data.shopRegionId) {
        if(cartInfo.length > 0) {
          let shopType = `cartInfo[0].canShippingToHome`
          this.data.cartInfo[0].shippingTypeList = []
          this.data.cartInfo[0].shippingTypeList.push('小区服务站自提(三天内)');
          this.data.cartInfo[0].shippingTypeList.push('物流配送');
          let totalMoneyLabel = 'cartInfo[0].totalMoneyLabel'
          let shoppingAmount = 'cartInfo[0].shoppingAmount'
          this.setData({
            [shopType]: 1,
            [totalMoneyLabel]: (this.data.allPrices - this.data.psPrice).toFixed(2),
            totalAmount: (this.data.allPrices - this.data.psPrice).toFixed(2),
            [shoppingAmount]: (0 / 100).toFixed(2),
            TypeLabel: '小区服务站自提（三天内）',
            dispatchingType: 1
          })
        }
        that.setData({
          shopModel:true
        })
      } else {
        if(cartInfo.length > 0) {
          let shopType = `cartInfo[0].canShippingToHome`
          let totalMoneyLabel = 'cartInfo[0].totalMoneyLabel'
          let shoppingAmount = 'cartInfo[0].shoppingAmount'
          this.setData({
            totalAmount: this.data.allPrices,
            [totalMoneyLabel]: this.data.allPrices,
            [shoppingAmount]: this.data.psPrice,
            TypeLabel: '物流配送',
            dispatchingType: 3,
            [shopType]: 0
          })
        }
        that.setData({
          shopModel:false
        })
      }
    }
  }
      app.globalData.distance = {
        lat: address.lat,
        lng: address.lng
      }
      dt.addressInfo = address
     if(that.data.tiHuoShopType){
       if(that.data.lat){
        this.getConfirm()
       }else{
        return app.Tips({
          title: '收货地址异常（无位置信息）,请更改收货地址！'
        })
       }
      }
    }

    let shop = wx.getStorageSync('ti_huo_shop')
    if (shop && shop.sid) {
      for(var scart of cartInfo) {
        if (scart.shoppingId == shop.sid) {
          scart.tiHuoShop = shop
        }
      }
    }
    let msg = wx.getStorageSync('order_beizhu')
    if (msg && msg.sid) {
      for(var scart of cartInfo) {
        if (scart.shoppingId == msg.sid) {
          scart.beizhu = msg.content
        }
      }
    }

    this.setData(dt);
    if (app.globalData.isLog && this.data.isClose && this.data.toPay == false) {
      // this.getaddressInfogetaddressInfo();
      this.selectComponent('#address-window').getAddressList();
    }
  },
  viewGlist: function(e) {
    let index = e.currentTarget.dataset.index
    let cart = this.data.cartInfo[index]
    wx.setStorageSync('confirm_goods_list', cart.shoppingSettlementBean);
    wx.navigateTo({
      url: '/pages/order/order_goods/index',
    })
  },
  computedPrice: function () {
    let shippingType = this.data.shippingType;
    postOrderComputed(this.data.orderKey, {
      addressId: this.data.addressId,
      useIntegral: this.data.useIntegral ? 1 : 0,
      couponId: this.data.couponId,
      shipping_type: parseInt(shippingType) + 1
    }).then(res => {
      let result = res.data.result;
      if (result) {
        this.setData({
          totalPrice: result.pay_price,
          integral_price: result.deduction_price,
          coupon_price: result.coupon_price,
          integral: this.data.useIntegral ? result.SurplusIntegral : this.data.userInfo.integral,
          'priceGroup.storePostage': shippingType == 1 ? 0 : result.pay_postage,
        });
      }
    })
  },
  addressType: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      shippingType: parseInt(index)
    });
    this.computedPrice();
  },
  bindPickerChange: function (e) {
    let value = e.detail.value;
    this.setData({
      shippingType: value
    })
    this.computedPrice();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isClose: true
    });
  },
  ChangCouponsClone: function () {
    this.setData({
      'coupon.coupon': false
    });
  },
  changeTextareaStatus: function () {
    for (var i = 0, len = this.data.coupon.list.length; i < len; i++) {
      this.data.coupon.list[i].use_title = '';
      this.data.coupon.list[i].is_use = 0;
    }
    this.setData({
      textareaStatus: true,
      status: 0,
      "coupon.list": this.data.coupon.list
    });
  },
  /**
   * 处理点击优惠券后的事件
   * 
   */
  ChangCoupons: function (e) {
    var index = e.detail,
      list = this.data.coupon.list,
      couponTitle = '请选择',
      couponId = 0;
    for (var i = 0, len = list.length; i < len; i++) {
      if (i != index) {
        list[i].use_title = '';
        list[i].is_use = 0;
      }
    }
    if (list[index].is_use) {
      //不使用优惠券
      list[index].use_title = '';
      list[index].is_use = 0;
    } else {
      //使用优惠券
      list[index].use_title = '不使用';
      list[index].is_use = 1;
      couponTitle = list[index].coupon_title;
      couponId = list[index].id;
    }
    this.setData({
      couponTitle: couponTitle,
      couponId: couponId,
      'coupon.coupon': false,
      "coupon.list": list,
    });
    this.computedPrice();
  },
  /**
   * 使用积分抵扣
   */
  ChangeIntegral: function () {
    this.setData({ 
      useIntegral: !this.data.useIntegral
    });
    this.computedPrice();
  },
  /**
   * 选择地址后改变事件
   * @param object e
   */
  OnChangeAddress: function (e) {
    this.setData({
      textareaStatus: true,
      addressId: e.detail,
      'address.address': false
    });
    // this.getaddressInfo();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.str)
    var that = this
    // var cartInfo = that.data.cartInfo
    // cartInfo[0] = {shippingTypeList:[]}
    var shopid = data.shoppingId
    var ishorsemanflag = data.ishorsemanflag
    that.setData({
      ishorsemanflag,
      shopLat:data.shopLat,
      shopLng:data.shopLng,
      shopId:shopid
    })
    that.setData({
      couponId: options.couponId || 0,
      pinkId: options.pinkId ? parseInt(options.pinkId) : 0,
      addressId: options.addressId || 0,
      cartId: options.cartId,
      is_address: options.is_address ? true : false,
    });
  },
  bindHideKeyboard: function (e) {
    this.setData({
      mark: e.detail.value
    });
  },
  bindShippingTypeChange: function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    let cart = this.data.cartInfo[index]
    let value = e.detail.value
    cart.shippingTypeIndex = value
    cart.shippingTypeLabel = cart.shippingTypeList[value]
    cart.shippingFee = value == 1 ? cart.shoppingAmount : 0;
    cart.totalMoneyLabel = ((cart.totalMoney + cart.shippingFee) / 100).toFixed(2)
    cart.shippingFee = (cart.shippingFee / 100).toFixed(2)
    let totalAmount = 0;
    for(var scart of this.data.cartInfo){
      totalAmount += scart.totalMoneyLabel * 1;
    }
    this.setData({
      TypeLabel:cart.shippingTypeList[value],
      cartInfo: this.data.cartInfo,
      totalAmount: totalAmount.toFixed(2),
    })
    if(value == '3') {
      if(!that.data.addressInfo) {
        return app.Tips({
          title: '请选择收货地址！'
        })
      }else{
        if(that.data.shopLat == null) {
          return app.Tips({
            title: '商店地址异常（无位置信息）！'
          })
        }else{
        if(that.data.lat == null) {
          that.setData({
            TypeLabel:'小区服务站自提（三天内）',
            dispatchingType: 1
          })
          return app.Tips({
            title: '收货地址异常（无位置信息）,请更改收货地址！'
          })
        }else{
        horseManDwCheck({ regionId:app.globalData.region_id}).then(res => {
          if(res.respCode == '9998') {
            that.setData({
              TypeLabel:'小区服务站自提（三天内）',
              dispatchingType: 1
            })
          }else{
            that.setData({
              model:true,
              isQs:'1',
              dispatchingType:4,
              tiHuoShopType:true,
              shopModel:false,
              countType:true
            })
            this.getConfirm()
          }
        }).catch(err => {
          that.setData({
            TypeLabel:'小区服务站自提（三天内）',
            dispatchingType: 1
          })
          return app.Tips({
            title: err
          })
        })
      }
    }
    }
    }else{
      if(that.data.shopAdminType == '2') {
        that.setData({isQs:null,countType:false,shopModel:true,tiHuoShopType:true,selectNum:value})
        this.getConfirm()         
      } else {
        that.setData({isQs:null,countType:false,shopModel:true,tiHuoShopType:false})
        this.getConfirm()
      }         
    }
    if(value == '2'){
      that.setData({countType:true,tiHuoShopType:true,dispatchingType:2})
    }
    if( value == '0' && that.data.cartInfo[0].adminType == 11) {
      that.setData({
        TypeLabel:'到店',
        TypeLabel2:'到店'
      })
    }
    if( value == '1' && that.data.cartInfo[0].adminType == 11) {
      that.setData({
        shopModel:false,
        TypeLabel:'上门',
        TypeLabel2:'上门'
      })
    }
    // if( value == '1' && that.data.cartInfo[0].adminType == 2) {
    //   that.setData({
    //     shopModel:false,
    //     TypeLabel:'物流配送',
    //     TypeLabel2:'物流配送'
    //   })
    // }
    if(this.data.TypeLabel == '物流配送') {
      this.setData({
        dispatchingType: 3,
        shopModel: false,
      })
    }
  },
  /**
   * 获取当前订单详细信息
   * 
   */
  getConfirm: function () {
    var that = this;
    var data = {}
    if(that.data.model) {
      var list = wx.getStorageSync('shopping_list')
      var userLat = that.data.lat
      var userLng = that.data.lng
      list[0].shopLat = that.data.shopLat
      list[0].shopLng = that.data.shopLng
       data = {
        isQs:that.data.isQs,
        shoppingList:list,
        userLng,
        userLat
      }
    
    }else{
       data = {shoppingList:wx.getStorageSync('shopping_list')}
    }
    orderConfirm1(data).then(res => {
      if(!that.data.tiHuoShopType){
      if(res.userAdressBean){
        that.setData({
          userRegionId: res.userAdressBean.regionId,
          lat:res.userAdressBean.lat,
          lng:res.userAdressBean.lng
        })
      }
    }
      let cartInfo = res.shoppingInfoBean
      this.setData({
        shopRegionId: cartInfo[0].regionId,
        shopAdminType: cartInfo[0].adminType
      })
      let totalAmount = 0, totalDiscount = 0
      for(var cart of cartInfo){
        if (cart.adminType == 2) { 
          if(!that.data.tiHuoShopType){
          that.setData({
            TypeLabel:'物流配送',
            dispatchingType: 3,
            shopModel:false,
          })
          if(this.data.userRegionId == this.data.shopRegionId) {
            that.setData({
              shopModel:true
            })
          } else {
            that.setData({
              shopModel:false
            })
          }
          cart.shippingTypeLabel = '物流配送'
          cart.shippingFee = cart.shoppingAmount
        }
        } else {
          cart.shippingTypeLabel = '小区服务站自提(三天内)'
          cart.shippingFee = 0
        }
        if(that.data.countType){
          cart.totalMoneyLabel = cart.totalMoney + cart.shoppingAmount
          cart.totalMoneyLabel = (cart.totalMoneyLabel / 100).toFixed(2)
          cart.shoppingAmount = (cart.shoppingAmount / 100).toFixed(2)
        }else{
          if(cart.adminType == 2) {
            if(that.data.selectNum == 1) { 
            cart.totalMoneyLabel = cart.totalMoney + cart.shoppingAmount
            cart.totalMoneyLabel = (cart.totalMoneyLabel / 100).toFixed(2)
            cart.shoppingAmount = (cart.shoppingAmount / 100).toFixed(2)
            } else {
              var num = 0
              cart.totalMoneyLabel = cart.totalMoney + num
              cart.totalMoneyLabel = (cart.totalMoneyLabel / 100).toFixed(2)
              cart.shoppingAmount = (num / 100).toFixed(2)
            }
            this.setData({
              allPrices: cart.totalMoneyLabel,
              psPrice: cart.shoppingAmount 
            })
          } else {
          var num = 0
          cart.totalMoneyLabel = cart.totalMoney + num
          cart.totalMoneyLabel = (cart.totalMoneyLabel / 100).toFixed(2)
          cart.shoppingAmount = (num / 100).toFixed(2)
          }
        }
        cart.goodsCount = 0
        cart.discountsMoney = (cart.discountsMoney / 100).toFixed(2)
        cart.allLimit = (cart.allLimit / 10).toFixed(2)
        cart.sumMoneyLabel = (cart.sumMoney / 100).toFixed(2)
        cart.shippingFee = (cart.shippingFee / 100).toFixed(2)
        totalAmount += cart.totalMoneyLabel * 1
        totalDiscount += cart.discountsMoney * 1
        if(this.data.userRegionId == this.data.shopRegionId) {
          cart.canShippingToHome = 1
        } else {
          cart.canShippingToHome = 0
        }
        cart.shippingTypeIndex = 0
        for(var item of cart.shoppingSettlementBean) {
          cart.goodsCount += item.num
          if (cart.adminType != 2 && item.productGetType == 2) {
            cart.canShippingToHome = 1;
          }
          if (cart.adminType == 11) {
            cart.canShippingToHome = 1;
            that.setData({
              TypeLabel:that.data.TypeLabel2
            })
          }
            if (cart.adminType == 2) {
              if(!that.data.tiHuoShopType){
            if(this.data.userRegionId == this.data.shopRegionId) {
            cart.canShippingToHome = 1;
              that.setData({
                TypeLabel: '小区服务站自提(三天内)',
                dispatchingType: 1
              })
            }
          }
          } else {
            if(!that.data.tiHuoShopType){
            if(this.data.userRegionId == this.data.shopAdminType) {
            cart.canShippingToHome = 0;
              that.setData({
                TypeLabel: '物流配送',
                dispatchingType: 3,
              })
            }
          }
          }
        }
        if (cart.canShippingToHome) {
          cart.shippingTypeList = [];
          if(app.globalData.scanCodeInfo !== 'undefined' && app.globalData.scanCodeInfo !=='' && cart.adminType !== '2'){
            that.setData({
              TypeLabel:'门店消费'
            })
            cart.shippingTypeLabel = '门店消费';
            let param = {
              pageNo: '1',
              pageSize: '1',
              adminId:app.globalData.scanCodeInfo,
            }
            findTiHuoShopOne(param).then(res => {
              let list = res.pageInfo.list
              let shop = list[0];
              let cartInfo = this.data.cartInfo;
              var flag = true;
              for(var scart of cartInfo) {
                if (scart.adminType !== '2') {
                  scart.tiHuoShop = shop;
                }else{
                  flag = false;
                }
              } 
              this.setData({
                cartInfo:cartInfo,
                onlyQuShop:flag
              })
            })
          }
          if(cart.adminType == 11) {
            cart.shippingTypeList.push('到店');
            cart.shippingTypeList.push('上门');
          }else{
            if(cart.adminType == 2) {
              cart.shippingTypeList.push('小区服务站自提(三天内)');
              cart.shippingTypeList.push('物流配送');
            } else {
              cart.shippingTypeList.push('小区服务站自提(三天内)');
              cart.shippingTypeList.push('门店消费');
              cart.shippingTypeList.push('送货上门(隔天)');
              if(that.data.ishorsemanflag == '1'){
              cart.shippingTypeList.push('骑手配送(即时)');
              }
            }
          }
        }
      }
      if(that.data.findUserDefalutList.shopId === null){
      }else{
        cartInfo[0].tiHuoShop = {shopId:that.data.findUserDefalutList.shopId,shopName:that.data.findUserDefalutList.shopName,shopAdress:that.data.findUserDefalutList.shopAdress}
      }
      if(res.userAdressBean == null){
        that.setData({
          cartInfo: cartInfo,
          addressInfo: wx.getStorageSync('selected_address'),
          totalAmount: totalAmount.toFixed(2),
          totalDiscount: totalDiscount.toFixed(2)
        });
      }else{
        if(!that.data.tiHuoShopType){
          that.setData({
            cartInfo: cartInfo,
            addressInfo: res.userAdressBean,
            totalAmount: totalAmount.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2)
          });
        }else{
          that.setData({
            cartInfo: cartInfo,
            totalAmount: totalAmount.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2)
          });
        }
    }
      // let address = wx.getStorageSync('selected_address')
      // if(address){
      //   that.setData({
      //     addressInfo: res.userAdressBean,
      //   })
      // }
      //that.data.cartArr[1].title = '可用余额:' + res.data.userInfo.now_money;
      //if (res.data.offline_pay_status == 2)  that.data.cartArr.pop();
      //that.setData({ cartArr: that.data.cartArr, ChangePrice: that.data.totalPrice });
      //that.getBargainId();
      //that.getCouponList();
    }).catch(err => {
      return app.Tips({
        title: err
      }, {
        tab: 3,
        url: 1
      });
    });
  },
  /*
   * 提取砍价和拼团id
   */
  getBargainId: function () {
    var that = this;
    var cartINfo = that.data.cartInfo;
    var BargainId = 0;
    var combinationId = 0;
    cartINfo.forEach(function (value, index, cartINfo) {
      BargainId = cartINfo[index].bargain_id,
        combinationId = cartINfo[index].combination_id
    })
    that.setData({
      BargainId: parseInt(BargainId),
      combinationId: parseInt(combinationId)
    });
    if (that.data.cartArr.length == 3 && (BargainId || combinationId || that.data.seckillId)) {
      that.data.cartArr.pop();
      that.setData({
        cartArr: that.data.cartArr
      });
    }
  },
  /**
   * 获取当前金额可用优惠券
   * 
   */
  getCouponList: function () {
    var that = this;
    getCouponsOrderPrice(this.data.totalPrice).then(res => {
      that.setData({
        'coupon.list': res.data,
        openType: 1
      });
    });
  },
  /*
   * 获取默认收货地址或者获取某条地址信息
   */
  getaddressInfo: function () {
    var that = this;
    if (that.data.addressId) {
      getAddressDetail(that.data.addressId).then(res => {
        res.data.is_default = parseInt(res.data.is_default);
        that.setData({
          addressInfo: res.data || {},
          addressId: res.data.id || 0,
          'address.addressId': res.data.id || 0
        });
      })
    } else {
      getAddressDefault().then(res => {
        res.data.is_default = parseInt(res.data.is_default);
        that.setData({
          addressInfo: res.data || {},
          addressId: res.data.id || 0,
          'address.addressId': res.data.id || 0
        });
      })
    }
  },
  payItem: function (e) {
    var that = this;
    var active = e.currentTarget.dataset.index;
    that.setData({
      active: active,
      animated: true,
      payType: that.data.cartArr[active].value,
    })
    setTimeout(function () {
      that.car();
    }, 500);
  },
  coupon: function () {
    this.setData({
      'coupon.coupon': true
    })
  },
  car: function () {
    var that = this;
    that.setData({
      animated: false
    });
  },
  onAddress: function () {
    wx.navigateTo({
      url: '/pages/ucenter/user_address_list/index?select=1',
    })
  },
  realName: function (e) {
    this.setData({
      contacts: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      contactsTel: e.detail.value
    })
  },
  showMap: function(e){
    let lat = e.currentTarget.dataset.lat
    let lng = e.currentTarget.dataset.lng
    wx.openLocation({
      latitude: lat,
      longitude: lng,
    })
  },
  tel: function(e) {
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  toSelectShop: function(e) {
    if(this.data.addressModel) {
    let index = e.currentTarget.dataset.index
    let cart = this.data.cartInfo[index]
    if(cart.adminType === '3'){
      wx.navigateTo({
        url: '/pages/order/order_store/index?sid=' + cart.shoppingId + '&flag=true',
      })
    }else if(cart.adminType === '11') {
      wx.navigateTo({
        url: '/pages/order/order_store/index?sid=' + cart.shoppingId + '&flag=true' + '&type=1',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/order/order_store/index?sid=' + cart.shoppingId + '&flag=false',
      })
    }
  } else {
    wx.showToast({
      title: '请先选择收货地址！',
      icon: 'none',
      duration: 2000
     })
  }
  },
  toBeiZhu: function(e) {
    let index = e.currentTarget.dataset.index
    let cart = this.data.cartInfo[index]
    if (cart.beizhu) {
      wx.setStorageSync('order_beizhu', {content:cart.beizhu})
    } else {
      wx.removeStorageSync('order_beizhu')
    }
    wx.navigateTo({
      url: '/pages/order/order_beizhu/index?sid=' + cart.shoppingId,
    })
  },
  SubOrder: function (e) {
    var that = this,
    data = {};
    let address = that.data.addressInfo
    if (!address || !address.receivingUserName) {
      if(!this.data.onlyQuShop){
        return app.Tips({ title:'请选择收货地址'});
      }
    }
    if(!this.data.onlyQuShop){
      data = {
        receiver: address.receivingUserName,
        receiverAddress: address.detailAdress,
        receiverState: address.provinceId,
        receiverCity: address.cityId,
        receiverDistrict: address.areaId,
        receiverMobile: address.receivingPhone,
        receiverZip: '',
        sourceType: '1',
        lat:that.data.lat,
        lng:that.data.lng,
        createOrderShoppingBean: []
      };
    }else{
      data = {
        receiver: '到店消费',
        receiverAddress: '',
        receiverState: '',
        receiverCity: '',
        receiverDistrict:'',
        receiverMobile: '',
        receiverZip: '',
        sourceType: '1',
        createOrderShoppingBean: []
      };
    }
    let actualPayTotal = 0;
    for (var scart of that.data.cartInfo) {
      if(that.data.shopModel){
      if (scart.adminType == 1){
        if (!scart.tiHuoShop || !scart.tiHuoShop.shopId){
          return app.Tips({ title:'请选择提货体验店'});
        }
      }
      if (scart.adminType == 3){
        if (!scart.tiHuoShop || !scart.tiHuoShop.shopId){
          return app.Tips({ title:'请选择提货体验店'});
        }
      }
      if (scart.adminType == 11){
        if (!scart.tiHuoShop || !scart.tiHuoShop.shopId){
          return app.Tips({ title:'请选择提货体验店'});
        }
      }
    }
      var orderDetails = []
      for (var val of scart.shoppingSettlementBean) {
        let detail = {
          num: val.num,
          price: val.price,         
          productId: val.productId,
          specificationsDetailId: val.specificationsDetailId,
        }
        if (val.acitivtyId){
          detail.acitivtyId = val.acitivtyId
        }
        orderDetails.push(detail)
      }
      var shoppingAmount = scart.shoppingAmount * 100
      let actualPay = scart.totalMoney + shoppingAmount;
      let dispatchingType = 1;
      if (scart.adminType == 2){
      } else if(scart.shippingTypeIndex > 0){
        dispatchingType = 2;
      }
      var shoppingInfo = {
        actualPay: actualPay,
        dispatchingType: that.data.dispatchingType,
        invoiceType: 0,
        shopId: scart.shoppingId,
        totalPay: scart.sumMoney,
        buyerMessage: scart.beizhu,
        orderDetails: orderDetails,
        postFee:shoppingAmount
      }
      if (scart.tiHuoShop){
        if(this.data.TypeLabel == '物流配送'){
          shoppingInfo.pickShoppId = ''
        } else {
          shoppingInfo.pickShoppId = scart.tiHuoShop.shopId
        }
      }
      actualPayTotal += actualPay;
      data.createOrderShoppingBean.push(shoppingInfo)
    }
    openPaySubscribe().then(() => {
      orderCreate(data).then(res => {
        let ids = []
        for (var itm of res.addOrderResponseList) {
          ids.push(itm.addOrderId)
        }
        let data = {
          amt: (actualPayTotal / 100).toFixed(2),    
          ids: ids
        }
        wx.setStorageSync('pay_info', data)
        wx.redirectTo({
          url: '/pages/order/order_pay/index'
        })
      }).catch(err => {
        wx.hideLoading();
        return app.Tips({
          title: err
        });
      });
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  },
  onPullDownRefresh: function(){
    app.loaded()
  },
})