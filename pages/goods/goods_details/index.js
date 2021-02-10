import {
  getProductDetail,
  getProductCode,
  collectAdd,
  collectDel,
  postCartInser
} from '../../../api/store.js';
import {
  getUserInfo,
} from '../../../api/user.js';
import {
  getCoupons
} from '../../../api/api.js';
import {
  getCartCounts
} from '../../../api/order.js';
import WxParse from '../../../wxParse/wxParse.js';
import util from '../../../utils/util.js';
import wxh from '../../../utils/wxh.js';
import { CACHE_SPID } from '../../../config.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareToWechart: "../../../image/wxlogo.png",
    maskHidden: false,
    name: "",
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商品详情'
    },
    attribute: {
      'cartAttr': false
    }, //属性是否打开
    coupon: {
      'coupon': false,
      list: [],
    },
    pans: {
      attr: false,
      butie: false
    },
    attr: '请选择', //属性页面提示
    attrValue: '', //已选属性
    animated: false, //购物车动画
    id: 0, //商品id
    goodModel:false,
    replyCount: 0, //总评论数量
    reply: [], //评论列表
    storeInfo: {}, //商品详情
    allList:[],
    productAttr: [], //组件展示属性
    productValue: [], //系统属性
    couponList: [], //优惠券
    productSelect: {}, //属性选中规格
    cart_num: 1, //购买数量
    isAuto: false, //没有授权的不会自动授权
    iShidden: true, //是否隐藏授权
    isOpen: false, //是否打开属性组件
    isLog: app.globalData.isLog, //是否登录
    actionSheetHidden: true,
    posterImageStatus: false,
    storeImage: '', //海报产品图
    PromotionCode: '', //二维码图片
    canvasStatus: false, //海报绘图标签
    posterImage: '', //海报路径
    posterbackgd: '/images/posterbackgd.png',
    sharePacket: {
      isState: true, //默认不显示
    }, //分销商详细
    uid: 0, //用户uid
    circular: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    clientHeight: "",
    systemStore: {}, //门店信息
    good_list: [],
    isDown: true,
    storeSelfMention: true,
    attrList: [],
    list:[],
    headers:[],
    hasBorder:true,
    detailModel:true
  },
  /**
   * 登录后加载
   * 
   */
  onLoadFun: function (e) {
    //this.setData({ isLog:true});
    //this.getCouponList();
    //this.getCartCount();
    //this.downloadFilePromotionCode();
    this.setData({
      detailModel:true
    })
    this.getUserInfo();
    //this.get_product_collect();
  },
  ChangCouponsClone: function () {
    this.setData({
      'coupon.coupon': false
    });
  },
  /*
   * 获取用户信息
   */
  getUserInfo: function () {
    var that = this;
    getUserInfo().then(res => {
      let info = res.userAndQuotaBean
      that.setData({
        uid: info.userId
      });
    });
  },
  /**
   * 购物车数量加和数量减
   * 
   */
  ChangeCartNum: function (e) {
    //是否 加|减
    var changeValue = e.detail;
    //获取当前变动属性
    var productSelect = this.data.productValue[this.data.attrValue];
    //如果没有属性,赋值给商品默认库存
    if (productSelect === undefined && !this.data.productAttr.length) productSelect = this.data.productSelect;
    //不存在不加数量
    if (productSelect === undefined) return;
    //提取库存
    var stock = productSelect.stock || 1;
    //设置默认数据
    if (productSelect.cart_num == undefined) productSelect.cart_num = 1;
    //数量+
    if (changeValue) {
      productSelect.cart_num++;
      //大于库存时,等于库存
      if (productSelect.cart_num > stock) productSelect.cart_num = stock;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    } else {
      //数量减
      productSelect.cart_num--;
      //小于1时,等于1
      if (productSelect.cart_num < 1) productSelect.cart_num = 1;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    }
  },
  /**
   * 属性变动赋值
   * 
   */
  ChangeAttr: function (e) {
    var values = e.detail;
    if(!this.data.goodModel) {
      var nums = values.indexOf(',')
      var one = values.slice(0,nums)
      var two = values.slice(nums + 1)
      values = [two, one]
    }
    var productSelect = this.data.productValue[values];
    var storeInfo = this.data.storeInfo;
    if (productSelect) {
      this.setData({
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.stock"]: productSelect.stock,
        ["productSelect.butie"]: productSelect.butie,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.cart_num']: 1,
        attrValue: values,
        attr: '已选择',
        detailModel:true
      });
      app.globalData.carmodel = true
    } else {
      this.setData({
        detailModel:false,
        attrValue: '',
        attr: '请选择'
      });
    }
  },
  /**
   * 领取完毕移除当前页面领取过的优惠券展示
   */
  ChangCoupons: function (e) {
    var coupon = e.detail;
    var couponList = util.ArrayRemove(this.data.couponList, 'id', coupon.id);
    this.setData({
      couponList: couponList
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //扫码携带参数处理
    if (options.scene) {
      var value = util.getUrlParams(decodeURIComponent(options.scene));
      if (value.id) options.id = value.id;
      //记录推广人uid
      if (value.pid) {
        app.globalData.spid = value.pid;
        wx.setStorageSync(CACHE_SPID, value.pid)
      }
    }
    if (!options.id) return app.Tips({
      title: '缺少参数无法查看商品'
    }, {
      tab: 3,
      url: 1
    });
    this.setData({
      id: options.id
    });
    //记录推广人uid
    if (options.spid) {
      app.globalData.spid = options.spid;
      wx.setStorageSync(CACHE_SPID, options.spid)
    }
    this.getGoodsDetails();
  },
  setClientHeight: function () {
    if (!this.data.good_list.length) return;
    var query = wx.createSelectorQuery().in(this);
    query.select("#list").boundingClientRect();
    var that = this;
    query.exec(function (res) {
      that.setData({
        clientHeight: res[0].height + 20
      });
    });
  },
  /**
   * 获取产品详情
   * 
   */
  getGoodsDetails: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    getProductDetail(that.data.id).then(res => {
      that.setData({
        allList:res.uproductDetailInfoBean
      })
      that.data.allList.productParam.forEach((items,indexs) => {
        var valueTojson = JSON.parse(items.valueTojson);
          if(that.data.allList.productParamIndex[0] == valueTojson[0].key) {
              that.setData({
                goodModel:false
              })
              if(this.data.allList.uguigeBeans.length == 1) {
                that.setData({
                  goodModel:true
                })
              }
          }else{
            that.setData({
              goodModel:true
            })
          }
      })
      wx.hideLoading()
      var storeInfo = res.uproductDetailInfoBean;
      //商品参数表格参数
      var params = res.uproductDetailInfoBean.productSysParam;
      var slit = [];
      if(params.length > 0){
        for(var i = 0;i<params.length;i++){
            var pad = params[i];
            var dd = [pad.key,pad.value];
            slit.push(dd);
        }
      }
      that.setData({
        list:slit
      });
      storeInfo.price = (storeInfo.price / 100).toFixed(2);
      storeInfo.shopPrice = (storeInfo.shopPrice / 100).toFixed(2);
      if(storeInfo.activityPrice) {
        storeInfo.shopPrice  = storeInfo.price
        storeInfo.price =  parseFloat(storeInfo.activityPrice)
      }
      if (storeInfo.activityPrice) {
        storeInfo.price = storeInfo.activityPrice
      }
      var good_list = storeInfo.uproductInfoBeanList || [];
      for (var good of good_list) {
        good.price = (good.price / 100).toFixed(2)
        good.shopPrice = (good.shopPrice / 100).toFixed(2)
      }
      var reply_list = storeInfo.userTalkBeans || []
      for (var itm of reply_list) {
        itm.crtTm = itm.crtTm.substr(0, 19).replace('T', ' ')
      }
      let pp = storeInfo.productParam;
      let data = {
        storeInfo: storeInfo,
        reply: reply_list,
        replyCount: storeInfo.userTalkCountBean.allCount,
        replyChance: storeInfo.userTalkCountBean.favorableRate * 100,
        productAttr: storeInfo.uguigeBeans,
        productValue: [],
        attrList: storeInfo.productSysParam,
        good_list: good_list
      }
      for (var p of pp) {
        let values = [];
        for (var val of p.specificationsDetailList) {
          values.push(val.value)
        }
        let str = values.join(',')
        let prc = (p.price / 100).toFixed(2)
        if (p.activityPrice) {
          prc = p.activityPrice
        }
        // if (storeInfo.activityPrice) {
        //   prc = storeInfo.activityPrice
        // }
        let label = storeInfo.activityLabel
        if (p.activityLabel !== undefined){
          label = p.activityLabel
        }
        data.productValue[str] = {
          image: p.photo ? p.photo : storeInfo.productIndexPhoto,
          price: prc,
          stock: p.count,
          unique: p.specificationsDetailId,
          label: label,
          butie: (p.userLimit / 10).toFixed(1)
        }
      }
      that.setData(data);
      //that.downloadFilestoreImage();
      that.DefaultSelect();
      //that.setClientHeight();
    }).catch(err => {
      //状态异常返回上级页面
      return app.Tips({
        title: err.toString()
      }, {
        tab: 3,
        url: 1
      });
    })
  },
  goPages: function (e) {
    wx.navigateTo({
      url: '/pages/goods/goods_details/index?id=' + e.currentTarget.dataset.id
    });
  },
  /**
   * 拨打电话
   */
  makePhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.systemStore.phone
    })
  },
  /**
   * 默认选中属性
   */
  DefaultSelect: function () {
    var productAttr = this.data.productAttr,
      storeInfo = this.data.storeInfo;
    for (var i = 0, len = productAttr.length; i < len; i++) {
      if (productAttr[i].productParamSubIndex[0]) productAttr[i].checked = productAttr[i].productParamSubIndex[0];
    }
    var value = this.data.productAttr.map(function (attr) {
      return attr.checked;
    });
    if(productAttr.length > 1) {
      value.reverse();
    }
    var productSelect = this.data.productValue[value.join(',')];
    if (productSelect) {
      this.setData({
        ["productSelect.store_name"]: storeInfo.productName,
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.stock"]: productSelect.stock,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.butie']: productSelect.butie,
        ['productSelect.label']: productSelect.label,
        ['productSelect.cart_num']: 1,
        attrValue: value,
        attr: '已选择'
      });
    } else {
      this.setData({
        ["productSelect.store_name"]: storeInfo.productName,
        ["productSelect.image"]: storeInfo.productIndexPhoto,
        ["productSelect.price"]: storeInfo.price,
        ["productSelect.stock"]: 0,
        ['productSelect.unique']: '',
        ['productSelect.butie']: 0,
        ['productSelect.label']: undefined,
        ['productSelect.cart_num']: 1,
        attrValue: '',
        attr: '请选择'
      });
    }
    this.setData({
      productAttr: productAttr
    });
  },
  /**
   * 获取是否收藏
   */
  get_product_collect: function () {
    var that = this;
    getProductDetail(that.data.id).then(res => {
      that.setData({
        'storeInfo.userCollect': res.data.storeInfo.userCollect
      });
    });
  },
  /**
   * 获取优惠券
   * 
   */
  getCouponList() {
    var that = this;
    getCoupons({
      page: 1,
      limit: 10
    }).then(res => {
      var couponList = [];
      for (var i = 0; i < res.data.length; i++) {
        if (!res.data[i].is_use && couponList.length < 2) couponList.push(res.data[i]);
      }
      that.setData({
        ['coupon.list']: res.data,
        couponList: couponList
      });
    });
  },
  /** 
   * 
   * 
   * 收藏商品
   */
  setCollect: function () {
    if (app.globalData.isLog === false) {
      this.setData({
        isAuto: true,
        iShidden: false,
      });
    } else {
      var that = this;
      if (this.data.storeInfo.userCollect) {
        collectDel(this.data.storeInfo.id).then(res => {
          that.setData({
            ['storeInfo.userCollect']: !that.data.storeInfo.userCollect
          })
        })
      } else {
        collectAdd(this.data.storeInfo.id).then(res => {
          that.setData({
            ['storeInfo.userCollect']: !that.data.storeInfo.userCollect
          })
        })
      }
    }
  },
  /**
   * 打开属性插件
   */
  selecAttr: function () {
    if (app.globalData.isLog === false)
      this.setData({
        isAuto: true,
        iShidden: false
      })
    else
      this.setData({
        'attribute.cartAttr': true,
        isOpen: true
      })
  },
  showattr: function () {
    this.setData({
      'pans.attr': true
    })
  },
  hideattr: function () {
    this.setData({
      'pans.attr': false
    })
  },
  showbutie: function () {
    this.setData({
      'pans.butie': true
    })
  },
  hidebutie: function () {
    this.setData({
      'pans.butie': false
    })
  },
  /**
   * 打开优惠券插件
   */
  coupon: function () {
    if (app.globalData.isLog === false)
      this.setData({
        isAuto: true,
        iShidden: false
      })
    else {
      this.getCouponList();
      this.setData({
        'coupon.coupon': true
      })
    }
  },
  onMyEvent: function (e) {
    this.setData({
      'attribute.cartAttr': e.detail.window,
      isOpen: false
    })
  },
  /**
   * 打开属性加入购物车
   * 
   */
  joinCart: function (e) {
    //是否登录
    if (app.globalData.isLog === false)
      this.setData({
        isAuto: true,
        iShidden: false,
      });
    else {
      this.goCat();
    }
  },
  /*
   * 加入购物车
   */
  goCat: function (isPay) {
    var that = this;
    var productSelect = this.data.productValue[this.data.attrValue];
    //打开属性
    if (this.data.attrValue) {
      //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
      this.setData({
        'attribute.cartAttr': !this.data.isOpen ? true : false
      })
    } else {
      if (this.data.isOpen)
        this.setData({
          'attribute.cartAttr': true
        })
      else
        this.setData({
          'attribute.cartAttr': !this.data.attribute.cartAttr
        });
    }
    //只有关闭属性弹窗时进行加入购物车
    if (this.data.attribute.cartAttr === true && this.data.isOpen == false) return this.setData({
      isOpen: true
    });
    //如果有属性,没有选择,提示用户选择
    if (this.data.productAttr.length && productSelect === undefined && this.data.isOpen == true) return app.Tips({
      title: '请选择属性'
    });
    if (isPay) {
      let info = that.data.storeInfo
      var shoppingInfo = {
        ishorsemanflag: info.isHorseManFlag,
        shoppingId: info.shopId,
        shopLat:info.shopLat,
        shopLng:info.shopLng,
        productList: [{
          productId: info.productId,
          specificationsDetailId: productSelect !== undefined ? productSelect.unique : '',
          num: that.data.cart_num
        }]
      }
      var str = JSON.stringify(shoppingInfo);
      wx.setStorageSync('shopping_list', [shoppingInfo]);
      wx.navigateTo({
        url: '/pages/order/order_confirm/index?str='+str
      });
    } else {
      postCartInser({
        productId: that.data.id,
        buyCount: that.data.cart_num,
        specificationsDetailId: productSelect !== undefined ? productSelect.unique : '',
      }).then(res => {
        that.setData({
          isOpen: false,
          'attribute.cartAttr': false
        });
        app.Tips({
          title: '添加购物车成功',
          icon: 'success'
        }, function () {
          that.getCartCount(true);
        });
      }).catch(err => {
        return app.Tips({
          title: err
        });
      });
    }
  },
  /**
   * 获取购物车数量
   * @param boolean 是否展示购物车动画和重置属性
   */
  getCartCount: function (isAnima) {
    return
    var that = this;

    getCartCounts().then(res => {
      that.setData({
        CartCount: res.data.count
      });
      //加入购物车后重置属性
      if (isAnima) {
        that.setData({
          animated: true,
          attrValue: '',
          attr: '请选择',
          ["productSelect.image"]: that.data.storeInfo.image,
          ["productSelect.price"]: that.data.storeInfo.price,
          ["productSelect.stock"]: that.data.storeInfo.stock,
          ['productSelect.unique']: '',
          ['productSelect.cart_num']: 1,
        });
        that.selectComponent('#product-window').ResetAttr();
        setTimeout(function () {
          that.setData({
            animated: false
          });
        }, 500);
      }
    });
  },
  /**
   * 立即购买
   */
  goBuy: function (e) {
    if (app.globalData.isLog === false) {
      this.setData({
        isAuto: true,
        iShidden: false
      });
      return
    }
    this.goCat(true)
  },
  onPullDownRefresh: function(){
    this.getGoodsDetails()
  },
onShow:function(){
  app.globalData.shopModel = false
},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let info = that.data.storeInfo
    let title = info.productName || ''
    title = '今日抢购价¥' + info.price + '，原价¥' + info.shopPrice + ' ' + title
    let data = {
      title: title,
      imageUrl: info.productIndexPhoto || '',
      path: '/pages/goods/goods_details/index?id=' + that.data.id + '&spid=' + that.data.uid,
    }
    return data;
  },
  /**
  *分享到朋友圈
  */
  onShareTimeline: function () {
  var that = this;
  let info = that.data.storeInfo
  let title = info.productName || ''
  title = '今日抢购价¥' + info.price + '，原价¥' + info.shopPrice + ' ' + title
  let data = {
      title: title,
      imageUrl: info.productIndexPhoto || '',
      path: '/pages/goods/goods_details/index?id=' + that.data.id + '&spid=' + that.data.uid,
    }
  return data;
  }
})