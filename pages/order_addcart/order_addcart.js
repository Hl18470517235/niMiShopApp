
import { getCartList, getCartCounts, changeCartNum, cartDel} from '../../api/order.js';
import { getProductHot, collectAll  } from '../../api/store.js';

const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '购物车',
      'class': '0',
      'color': true
    },
    selectadminId:"",
    seleModel:false,
    masModel:false,
    Cindex:0,
    navH: 0,
    cartCount:0,
    goodsHidden:true,
    footerswitch: true,
    host_product: [],
    cartList:[],
    isAllSelect:false,//全选
    selectValue:[],//选中的数据
    selectCountPrice:0.00,
    isGoIndex: true,
    iShidden: false,
    loaded: false,
    selectList:[],
    onelist:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.globalData.shopModel = false
    that.setData({
      navH: app.globalData.navHeight
    });
    if (app.globalData.token) that.setData({ iShidden:true});
  },

  /**
   * 关闭授权
   * 
  */
  onCloseAuto: function () {
    this.setData({ iShidden: true });
  },

  subDel:function (event) {
    let that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0) 
      cartDel(selectValue).then(res=>{
        that.getCartList();
      });
    else 
      return app.Tips({ title:'请选择产品'});
  },
  getSelectValueProductId:function(){
    var that = this;
    var validList = that.data.cartList.valid;
    var selectValue = that.data.selectValue;
    var productId = [];
    if (selectValue.length > 0){ for (var index in validList){if(that.inArray(validList[index].id, selectValue)) { productId.push(validList[index].product_id);}}};
    return productId;
  },
  subCollect: function (event){
    let that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0) {
      var selectValueProductId = that.getSelectValueProductId();
      collectAll(that.getSelectValueProductId().join(',')).then(res=>{
        return app.Tips({title:res.msg,icon:'success'});
      }).catch(err=>{
        return app.Tips({ title: err });
      });
    } else {
      return app.Tips({ title:'请选择产品'});
    }
  },
  subOrder: function (event){
    let that = this;
    var shopLat = event.currentTarget.dataset.shoplat;
    var shopLng = event.currentTarget.dataset.shoplng;
    var index = event.currentTarget.dataset.cindex;
    var shoppingId = event.currentTarget.dataset.adminid;
    var ishorsemanflag = event.currentTarget.dataset.ishorsemanflag;
    var data = {
      ishorsemanflag,
      shopLat,
      shopLng,
      shoppingId,
    }
    var str= JSON.stringify(data);
    var cartList = that.data.cartList;
    var shoppingList = [];
 //   for (var scart of cartList) {
      var shoppingInfo = {
        //shoppingId: scart.adminId,
        shoppingId: cartList[index].adminId,
        productList: []
      }
      for (var gd of cartList[index].productCarbeans) {
        if (gd.checked) {
          shoppingInfo.productList.push({
            productId: gd.productId,
            specificationsDetailId: gd.specificationsDetailId,
            num: gd.buyCount
          }) 
        }
      }
      if (shoppingInfo.productList.length > 0) {
        shoppingList.push(shoppingInfo)
      }
   // }
    if (shoppingList.length > 0){
      wx.setStorageSync('shopping_list', shoppingList);
      wx.navigateTo({url:'/pages/order/order_confirm/index?str='+str});
    }else{
      return app.Tips({ title:'请选择产品'});
    }
  },
  subCollect: function (event){
    let that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0) {
      var selectValueProductId = that.getSelectValueProductId();
      collectAll(that.getSelectValueProductId().join(',')).then(res=>{
        return app.Tips({title:res.msg,icon:'success'});
      }).catch(err=>{
        return app.Tips({ title: err });
      });
    } else {
      return app.Tips({ title:'请选择产品'});
    }
  },
  delete: function (event){
    let that = this
    var cartList = that.data.cartList;
    var ids = [];
    for (var scart of cartList) {
      for (var gd of scart.productCarbeans) {
        if (gd.checked) {
          ids.push(gd.specificationsDetailId);
        }
      }
    }
    if (ids.length < 1) {
      return app.Tips({title: '请选择需要删除的商品'})
    }
    wx.showModal({
      title: '确认要删除选中的商品吗？',
        cancelColor: '#06B7A4',
        confirmColor: '#06B7A4',
        cancelText: '删除',
        confirmText: '再想想',
        success: function (res) {
          if (!res.cancel) return
          cartDel(ids).then(res=>{
            app.Tips({ title: '删除成功' });
            that.setData({
              selectValue:[]
            })
            that.getCartList()
          }).catch(res=>{

          });
        }
    })
  },
  checkboxAllChange: function (event){
    var value = event.detail.value;
    if (value.length > 0) { this.setAllSelectValue(1)}
    else { this.setAllSelectValue(0) }
  },
  setAllSelectValue:function(status){
    var that = this;
    var selectValue = [];
    var cartList = that.data.cartList;
    if (cartList.length > 0) {
      for (var scart of cartList) {
        scart.checked = status == 1;
        for (var gd of scart.productCarbeans) {
          gd.checked = scart.checked
          gd.checked && selectValue.push(gd.shoppingCarId)
        }
      }
      that.setData({
        cartList: cartList,
        selectValue: selectValue,
      });
      that.switchSelect();
    }
  },
  checkboxPartChange: function (event){
    var that = this;
    var index = event.currentTarget.dataset.cindex;
    var value = event.currentTarget.dataset.id;
    var selectValue = []
    var isAllSelect = true
    var cartList = that.data.cartList;
    this.setData({
      selectadminId:value
    })
    for (var scart of cartList) {
      if (value == scart.adminId){
        scart.checked = !scart.checked;
      }else{
        scart.seleModel = !scart.seleModel
        for(var item of scart.productCarbeans){
          if(that.data.onelist.length > 0 ) {
            item.seleModel = true
            scart.seleModel = true
          }else{
          item.seleModel = !item.seleModel
        }
        if(that.data.onelist.length == that.data.cartList[index].productCarbeans.length){
          item.seleModel = false
          scart.seleModel = false
        }
        //  scart.seleModel = !scart.seleModel
        }
      }
      for (var gd of scart.productCarbeans) {
        gd.checked = scart.checked
        if (gd.checked) {
          selectValue.push(gd.shoppingCarId)
        } else {
          isAllSelect = false
        }
        // if(selectValue.length == 0){
        //   for(var item of cartList){
        //     item.seleModel = false
        //     for(var value of item.productCarbeans){
        //       value.seleModel = false
        //     }
        //   }
        // }
      }
    }
    this.setData({
      Cindex:index,
      cartList: cartList,
      isAllSelect: isAllSelect,
      selectValue: selectValue,
      onelist:[]
    })
    this.switchSelect();
  },
  
    checkboxChange: function (event){
        var that = this;
        var adminId = event.currentTarget.dataset.adminid;
        var value = event.currentTarget.dataset.id;
        var index = event.currentTarget.dataset.cindex;
        var selectValue = []
        var isAllSelect = true
        var cartList = that.data.cartList;
        var onelist = []
        if(that.data.selectValue.length == 0){
            this.setData({
              selectadminId:adminId,
            })
          }
        for (var scart of cartList) {
          scart.checked = true;
          for (var gd of scart.productCarbeans) {
      if(scart.adminId == that.data.selectadminId){
        gd.seleModel = false
      }
      else{
        gd.seleModel = true
        scart.seleModel = true
      }
            if (value == gd.shoppingCarId){
              gd.checked = !gd.checked;

            }
            if (gd.checked) {
              selectValue.push(gd.shoppingCarId)
              onelist.push(gd.shoppingCarId)
            } else {
              scart.checked = false
              isAllSelect = false
            }
          }
        }
    if(selectValue.length == 0){
      for(var item of cartList){
        item.seleModel = false 
        for(var value of item.productCarbeans){
          value.seleModel = false
        }
      }
    }
        this.setData({ 
          cartList: cartList,
          isAllSelect: isAllSelect,
          selectValue: selectValue,
          Cindex:index,
          onelist:onelist
        })
        this.switchSelect();
      },
  inArray:function(search, array){
    for (var i in array) { if (array[i] == search) { return true; } }
    return false;
  },
  switchSelect:function(){
    var that = this;
    var selectCountPrice  = 0.00;
    var cartList = that.data.cartList;
    var num = that.data.Cindex;
    cartList[num].Allprice = 0.00
    //for (var scart of cartList) {
      for (var gd of cartList[num].productCarbeans) {
        if (gd.checked) {
           selectCountPrice = Number(selectCountPrice) + Number(gd.buyCount) * Number(gd.price)
           cartList[num].Allprice = selectCountPrice.toFixed(2)
        }
     // }
    }
    // that.setData({ selectCountPrice: cartList[num].Allprice.toFixed(2) });
    that.setData({cartList:cartList})
  },
  subCart:function(event){
    var that = this;
    var status = false;
    var index = event.currentTarget.dataset.index;
    var cindex = event.currentTarget.dataset.cindex;
    var items = that.data.cartList[cindex];
    var item = items.productCarbeans[index]
    item.buyCount = item.buyCount - 1;
    if (item.buyCount < 1){
      status = true;
      wx.showModal({
        title: '您真的要删除这个商品吗？',
        cancelColor: '#06B7A4',
        confirmColor: '#06B7A4',
        cancelText: '删除',
        confirmText: '再想想',
        success: function (res) {
          if (res.cancel) {
            cartDel([item.specificationsDetailId]).then(res=>{
              app.Tips({ title: '删除成功' });
              that.getCartList()
            }).catch(res=>{
        
            });
          }
        }
      })
    } 
    if (item.buyCount <= 1) { 
      item.buyCount = 1;
      item.numSub = true; 
    } else { item.numSub = false;item.numAdd = false; }
    if (false == status) {
      let param = {
        shoppingCarId: item.shoppingCarId,
        count: item.buyCount,
        specificationsDetailId: item.specificationsDetailId
      }
      that.setCartNum(param, function (data) { 
        var itemData = "cartList[" + cindex + "].productCarbeans[" + index + "]";
        that.setData({ [itemData]: item });
        that.switchSelect();
      });
    }
  },
  addCart: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var cindex = event.currentTarget.dataset.cindex;
    var items = that.data.cartList[cindex];
    var item = items.productCarbeans[index]
    item.buyCount = item.buyCount + 1;
    if (item.buyCount >= item.speCount) {
      item.buyCount = item.speCount;
      item.numAdd = true;
      item.numSub = false; 
    } else { item.numAdd = false; item.numSub = false; }
    let param = {
      shoppingCarId: item.shoppingCarId,
      count: item.buyCount,
      specificationsDetailId: item.specificationsDetailId
    }
    that.setCartNum(param, function (data) {
      var itemData = "cartList[" + cindex + "].productCarbeans[" + index + "]";
      that.setData({ [itemData]: item });
      that.switchSelect();
    });
  },
  setCartNum(param, successCallback) {
    var that = this;
    changeCartNum(param).then(res=>{
      successCallback && successCallback(res.data);
    });
  },
  getCartNum: function () {
    var that = this;
    getCartCounts().then(res=>{
      that.setData({ cartCount: res.data.count });
    });
  },
  getCartList: function () {
    var that = this;
    getCartList().then(res=>{
      var cartList = res.shoppingCarbean;
      for (var scart of cartList) {
        scart.Allprice = 0.00
        for (var gd of scart.productCarbeans) {
          gd.price = (gd.price / 100).toFixed(2)
          gd.specificationsValue = JSON.parse(gd.specificationsValue)
        }
      }
      that.setData({
        cartList: cartList,
        loaded: true
      });
      that.switchSelect();
    });
  },
  getHostProduct: function () {
    var that = this;
    getProductHot().then(res=>{
      that.setData({ host_product: res.data });
    });
  },
  goodsOpen:function(){
     var that = this;
     that.setData({
       goodsHidden: !that.data.goodsHidden
     })
  },
  manage:function(){
    var that = this;
    that.setData({
      footerswitch: !that.data.footerswitch
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoadFun: function () {
    this.getCartList();
  },
  yesAction:function(){
    this.setData({
      masModel:false
    })
    app.globalData.shopModel = false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog == true) {
      this.getCartList();
      this.setData({
        goodsHidden: true,
        footerswitch: true,
        host_product: [],
        cartList: [],
        isAllSelect: false,//全选
        selectValue: [],//选中的数据
        selectCountPrice: 0.00,
        cartCount: 0,
        iShidden:true,
        masModel:app.globalData.shopModel
      });
    }
  },
  unsetCart:function(){
    let that=this,ids=[];
    for (var i = 0, len = that.data.cartList.invalid.length;i < len;i++){
      ids.push(that.data.cartList.invalid[i].id);
    }
    cartDel(ids).then(res=>{
      app.Tips({ title: '清除成功' });
      that.setData({ 'cartList.invalid': [] });
    }).catch(res=>{

    });
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
    this.getCartList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  }
})