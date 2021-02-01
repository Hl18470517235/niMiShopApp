// pages/BusinessDetail/index.js
const app = getApp();
const Util = require('../../utils/util.js');
import { getCartList1, getCartCounts, changeCartNum, cartDel} from '../../api/order.js';
import { getProductHot, collectAll, getProductDetail } from '../../api/store.js';
import {getProducts,postCartInser, selectMuchShop} from '../../api/store.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //购物车x坐标
    animationx: 0,
    //购物车y坐标
    animationy: 0,
    //是否显示飞行物，默认不显示
    showdot: false,
    //动画对象
    ani: {},
    type:1,
    //商品记数
    count: 0,
    detailNum:0,
    shopId:"",
    ListLength:0,
    detailtotal:true,
    selectShop:{},
    mModel:false,
    selectadminId:"",
    seleModel:false,
    Cindex:0,
    detamodel:false,
    navH: 0,
    model:true,
    cartCount:0,
    carallPrice:0,
    goodsHidden:true,
    footerswitch: true,
    host_product: [],
    cartList:[],
    isAuto:false,
    iShidden:false,
    allshopprice:0,
    isAllSelect:false,//全选
    selectValue:[],//选中的数据
    selectCountPrice:0.00,
    isGoIndex: true,

    loaded: false,
    selectList:[],
    imgtop:-40,
    onelist:[],
    attribute: {
      'cartAttr': false
    }, //属性是否打开
    parameter: {
      coupon: {
        'coupon': false,
        list: [],
      },
      'navbar': '1',
      'return': '1',
      'title': '店铺主页',
      'color': true,
      'class': '5',
    },
    detailList:{},
    goodsList:[],
    productSelect:{},
    shopid:"",
    pageSize:8,
    masModel:false,
    detailModel:false,
    goodnum:1,
    proList:[],
    seleList:[],
    uid:"",
    proPageInfo:{},
    seleNum:0,
    allList:[],
    proDetailList:[]
  }, 
  // carBtn:function(){

  // },
/****************************************购物车******************************************************* */
joincar:function(e) {
  var that = this
  var data = {
    buyCount: 1,
    productId: that.data.proDetailList.productId,
    specificationsDetailId: that.data.proDetailList.productParam[that.data.detailNum].specificationsDetailId
  }
  postCartInser(data).then(res => {
    // this.setData({
    //   'attribute.cartAttr': e.detail.window,
    // })
    this.getCartList()
  }).catch(err => {
    return app.Tips({
      title: err
    })
  })
},
myevent: function (e) {
  this.setData({
    'attribute.cartAttr': e.detail.window,
  })
},
// ChangeAttr:function (e) {},
//   onCloseAuto: function () {
//     this.setData({ iShidden: true });
//   },

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
    this.setData({
      detailModel:false,
      masModel:false  
    })
    let that = this;
    var shopLat = event.currentTarget.dataset.shoplat;
    var shopLng = event.currentTarget.dataset.shoplng;
    var index = event.currentTarget.dataset.cindex;
    var shoppingId =  event.currentTarget.dataset.id;
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
  async getShopList() {
    var data = {
      regionId:app.globalData.region_id,
      pageNo:1,
      pageSize:999,
      type:null
    }
    let result = await selectMuchShop(data)
    let allList = result.list
    let list = {}
    allList.map((item) => {
        if(this.data.shopId == item.shopId) {
          list = item
        }
    })
    if(list.startTime == null){
      list.startTime = null
      list.endTime = null
    }else{
      list.startTime = list.startTime.substr(11,8)
      list.endTime = list.endTime.substr(11,8)
    }
    if(list.startTime == "00:00:00" && list.endTime == "23:59:59"){
      list.startTime = null
      list.endTime = null 
    }
    this.setData({
      detailList: list
    })
  },
  switchSelect:function(){
    var that = this;
    var selectCountPrice  = 0.00;
    var cartList = that.data.cartList;
    var num = that.data.Cindex;
    cartList[num].Allprice = 0.00
      for (var gd of cartList[num].productCarbeans) {
        if (gd.checked) {
           selectCountPrice = Number(selectCountPrice) + Number(gd.buyCount) * Number(gd.price)
           cartList[num].Allprice = selectCountPrice.toFixed(2)
        }
    }
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
    var data = {
      shopId:that.data.shopId,
      regionId: app.globalData.region_id,
    }
    getCartList1(data).then(res=>{
      var cartList = res.shoppingCarbean;
      if(res.shoppingCarbean.length == 0){var num = 0}else{
        var num = res.shoppingCarbean[0].productCarbeans.length
        for (var scart of cartList) {
          scart.Allprice = 0.00
          for (var gd of scart.productCarbeans) {
            gd.price = (gd.price / 100).toFixed(2)
            gd.shopPrice = (parseFloat(gd.shopPrice) /100).toFixed(2)
            gd.allshopprice = parseFloat(gd.shopPrice) * gd.buyCount
            gd.allprice = parseFloat(gd.price) * gd.buyCount
            gd.specificationsValue = JSON.parse(gd.specificationsValue)
          }
        }
      }
      that.setData({
        cartList: cartList,
        loaded: true,
        ListLength:num
      });
      //that.switchSelect();
      that.getAllprice()
    });
  },
  getAllprice:function(){
    var that = this
    that.setData({
      carallPrice:0,
      allshopprice:0
    })
    if(that.data.cartList.length == 0 ){
      that.setData({
        carallPrice: 0,
        allshopprice:0
      })
    }else{
    for(var pr of that.data.cartList[0].productCarbeans){
      var allNum = parseFloat(that.data.carallPrice) + parseFloat(pr.allprice)
      var allshopNum = parseFloat(that.data.allshopprice) + parseFloat(pr.allshopprice) 
        that.setData({
          carallPrice: allNum.toFixed(2),
          allshopprice:allshopNum.toFixed(2)
        })
    }
  }
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
  ChangeAttr:function(e) {
    var that = this
    var goodnum = 0
    var type = false
    var one = ''
    var two = ''
    if(that.data.proDetailList.uguigeBeans.length >1) {
      that.data.proDetailList.productParam.forEach((item, index) => {
        var valueTojson = JSON.parse(item.valueTojson);
        var index1 = 0
        var index2 = 1
        valueTojson.forEach((items,indexs) => {
          if(items.key == '规格') {
            if(indexs == 0) {
            index1 = 1
            index2 = 0
            }
          }
        }) 
        var num = e.detail.indexOf(',')
        one = e.detail.slice(0,num)
        two = e.detail.slice(num + 1)
        if(valueTojson[index1].value == one){
          if(valueTojson[index2].value == two) {
            goodnum = index
            type = true
          }
        }
      })
    }else{
      that.data.proDetailList.uguigeBeans[0].productParamSubIndex.forEach((item, index) => {
        if(item === e.detail) {
          goodnum = index
          type = true
        }
      })
    }
    if(!type) {
      // var oneitem = 'seleList[0].checked'
      // var twoitem = 'seleList[1].checked'
      // console.log(that.data.one)
      // console.log(twoitem)
      // this.setData({
      //   [oneitem]:that.data.one,
      //   [twoitem]:that.data.two
      // })
      // console.log(that.data.seleList)
      // return app.Tips({
      //   title: '该规格库存不足！'
      // })
    }else{
      this.setData({
        detailNum:goodnum,
        ["productSelect.image"]: that.data.proDetailList.productParam[goodnum].photo,
        ["productSelect.price"]: that.data.proDetailList.productParam[goodnum].price,
        ["productSelect.stock"]: that.data.proDetailList.productParam[goodnum].count,
        ["productSelect.butie"]: that.data.proDetailList.productParam[goodnum].userLimit,
        ['productSelect.unique']: that.data.proDetailList.productParam[goodnum].specificationsDetailId,
      })
    }
  },
/****************************************购物车******************************************************* */


  close:function(){
    this.getCartList()
    this.setData({
      masModel:false,
      detailModel:false,
      goodnum:1
    })
  },
  detailclose:function(){
    this.setData({
      detailModel:false,
    })
  },
  selectBoxBtn:function(e){
    var that = this
    this.setData({
      seleNum:e.currentTarget.dataset.index,
      proList:that.data.allList[e.currentTarget.dataset.index]
    })

  },
  shopAction:function(){
    this.setData({
      detailModel:true,
      masModel:true
    })
    this.getCartList()
  },
  addBtn:function(){
    var that = this
    this.setData({
      goodnum: that.data.goodnum + 1
    })
  },
  delBtn:function(){
    var that = this
    if(that.data.goodnum < 1) {
      return
    }else{
      this.setData({
        goodnum:that.data.goodnum - 1
      })
    }
  },
  callPhone(e){
      var phone = e.currentTarget.dataset.s;
      wx.makePhoneCall({
        phoneNumber: phone
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoadFun: function (e) {
  //   getUserInfo().then(res => {
  //     let info = res.userAndQuotaBean
  //     this.setData({
  //       uid: info.userId
  //     });
  //   });
  // },
  onLoad: function (options) {
    Util.chekWxLogin().then(res => {
      app.globalData.model = res.isLogin
      app.globalData.userInfo = res.userinfo
      app.globalData.token = res.userinfo.userId;
      this.getCartList()
    })
    var that = this
    let id = ''
    if(options.shareList) {
      var shareList = JSON.parse(options.shareList) 
      id = shareList.shopId
      app.globalData.region_id = shareList.regionId
    } else {
      id = options.id
    }
    this.setData({
      shopId: id
    })
    this.getShopList()

    var list = this.data.selectShop

      this.setData({
        shopid:that.data.shopId,
        detailList:list
      })
      getProducts({
        shopId:that.data.shopId,
        pageNo:1,
        pageSize:that.data.pageSize,
      }).then(res => {
        var goodList = res.pageInfo.list
        for(var item of goodList) {
          if(item.activityPrice){
            var price = item.price
            item.price = item.activityPrice
            item.shopPrice = ((price)/100).toFixed(2)
          }else{
            item.price = ((item.price)/100).toFixed(2)
            item.shopPrice = ((item.shopPrice)/100).toFixed(2)
          }
        }
        var pageInfo = {pageSize:res.pageInfo.pageSize,pageNo:res.pageInfo.pageNum,total:res.pageInfo.total,next:false}
        if(pageInfo.pageNo*pageInfo.pageSize < pageInfo.total){
          pageInfo.next = true;
        }
        this.setData({
          goodsList:res.pageInfo.list,
          proPageInfo:pageInfo
        })
      })
  },
  selectAction:function(e){
    if(!app.globalData.model){
      this.authorize.setAuthStatus()
      return; 
    }
    var that = this
    this.setData({
      seleNum:0,
      detailNum:0
    })
    var productId = e.currentTarget.dataset.id
    getProductDetail(productId).then(res => {
      var list = res.uproductDetailInfoBean
      list.productParam.forEach((item) => {
        item.price = (item.price/100)
        item.userLimit = (item.userLimit/10)
      })
      list.uguigeBeans[0].checked = list.uguigeBeans[0].productParamSubIndex[0]
      if(list.uguigeBeans.length > 1) {
        list.uguigeBeans[1].checked = list.uguigeBeans[1].productParamSubIndex[0]
      }
      list.uguigeBeans.forEach((item,index) => {
        if(item.productParamIndex == '规格') {
          if(index == 1) {
            var temp;
            for(let i=0; i<list.uguigeBeans.length/2; i++){
              temp=list.uguigeBeans[i];
              list.uguigeBeans[i]=list.uguigeBeans[list.uguigeBeans.length-1-i];
              list.uguigeBeans[list.uguigeBeans.length-1-i]=temp;
            }
          }
        }
      })
      this.setData({
        proDetailList:list,
        allList:list.productParam,
        proList:list.productParam[0],
        seleList:list.uguigeBeans,
        ["productSelect.image"]: list.productParam[that.data.detailNum].photo,
        ["productSelect.price"]: list.productParam[that.data.detailNum].price,
        ["productSelect.stock"]: list.productParam[that.data.detailNum].count,
        ["productSelect.butie"]: list.productParam[that.data.detailNum].userLimit,
        ['productSelect.unique']: list.productParam[that.data.detailNum].specificationsDetailId,
      })
      if(list.productParam.length > 1) {
        that.setData({
          'attribute.cartAttr':true,
        })
        return
      }
      postCartInser({
        productId:that.data.proDetailList.productId,
        buyCount:that.data.goodnum,
        specificationsDetailId:that.data.allList[0].specificationsDetailId,
        userId:that.data.uid
      }).then(res => {
        if(res.respCode == "0000"){
          this.getCartList()
          if(that.data.showdot == true){
            return
          }
          //获取点击点坐标
          var touches = e.touches[0]
          //坐标修正，同上，这么做是为了让飞行点落到点击的中心
          let toptemp = touches.clientY - 20 / 750 * wx.getSystemInfoSync().windowWidth
          let lefttemp = touches.clientX - 20 / 750 * wx.getSystemInfoSync().windowWidth
          var animation1 = wx.createAnimation({
            duration: 1,
            timingFunction: 'ease'
          })
          //通过极短的时间让飞行点移动到手指点击位置，同时让飞行点显示出来
          animation1.left(lefttemp).top(toptemp).step()
          that.setData({
            ani: animation1.export(),
            showdot: true
          })
        
        //然后让飞行点飞行到购物车坐标处，形成添加效果
          setTimeout(function(){
            const animation = wx.createAnimation({
              duration: 1500,
              timingFunction: 'ease'
            })
            //通过Animation的left和top这两个API，将飞行点移动到购物车坐标处
            animation.left(that.data.animationx).top(that.data.animationy).step()
            that.setData({
              ani: animation.export()
            })
            setTimeout(function () {
              var counttemp = that.data.ListLength + 1
              that.setData({
                showdot: false,
                ani: null,
                imgtop:-40
               // ListLength: counttemp
              })
            }.bind(this), 100)
            that.setData({
              imgtop:-50
            })
          },50)
      
      
          // wx.showToast({
          //   title: '加入购物车成功',
          //   icon: 'success',
          //   duration: 2000
          // })
        }
      }).catch(err => {
        return app.Tips({
          title: err
        })
      })
       wx.hideToast()
       this.setData({
        masModel:false,
        detailModel:false,
        goodnum:1
      })
    })



  },
  carAction:function(){
    // wx.switchTab({
    //   url: 'pages/user/user',
    // })
  },
  itemAction:function(index){
    wx.navigateTo({
      url: '/pages/goods/goods_details/index?id='+index.currentTarget.dataset.index,
    })
    // this.setData({
    //   masModel:true
    // })
  },
  yesAction:function(){
    this.setData({
      mModel:false
    })
    app.globalData.shopModel = false
    this.getCartList()
  },
  allAction:function(){
    var that = this
    getProducts({
      shopId:that.data.shopid,
      pageNo:1,
      pageSize:(that.data.pageSize) + 10,
    }).then(res => {
      var goodList = res.pageInfo.list
      for(var item of goodList) {
        item.price = ((item.price)/100).toFixed(2),
        item.shopPrice = ((item.shopPrice)/100).toFixed(2)
      }
      var pageInfo = {pageSize:res.pageInfo.pageSize,pageNo:res.pageInfo.pageNum,total:res.pageInfo.total,next:false}
      if(pageInfo.pageNo*pageInfo.pageSize < pageInfo.total){
        pageInfo.next = true;
      }
      this.setData({
        goodsList:res.pageInfo.list,
        proPageInfo:pageInfo
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    const query = wx.createSelectorQuery()
    query.select('#shopcarimg').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      let point = res[0]
      //坐标修正，让飞行物可以正好落在购物车正中心，20是飞行物宽度一半然后转化成px
      var xtemp = (point.left + point.right) / 2 - 20 / 750 * wx.getSystemInfoSync().windowWidth
      var ytemp = (point.top + point.bottom) / 2 - 20 / 750 * wx.getSystemInfoSync().windowWidth
      that.setData({
      	//获取修正后坐标
        animationx: xtemp,
        animationy: ytemp
      })
    })
    this.authorize = this.selectComponent('#authorize')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      mModel:app.globalData.shopModel
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
    var that = this
    that.setData({
      pageSize:8,
      detailtotal:true
    })
    getProducts({
      shopId:that.data.shopid,
      pageNo:1,
      pageSize:that.data.pageSize,
    }).then(res => {
      var goodList = res.pageInfo.list
      for(var item of goodList) {
        item.price = ((item.price)/100).toFixed(2),
        item.shopPrice = ((item.shopPrice)/100).toFixed(2)
      }
      var pageInfo = {pageSize:res.pageInfo.pageSize,pageNo:res.pageInfo.pageNum,total:res.pageInfo.total,next:false}
      if(pageInfo.pageNo*pageInfo.pageSize < pageInfo.total){
        pageInfo.next = true;
      }
      this.setData({
        goodsList:res.pageInfo.list,
        proPageInfo:pageInfo
      })
    })
  },
  mapAction:function(e) {
    var that = this
    var lat = that.data.detailList.lat
    var lng = that.data.detailList.lng
    var name = that.data.detailList.shopName
    let key = app.globalData.mapKey;  //使用在腾讯位置服务申请的key
    let referer = '亿家速递';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': name,
        'latitude': lat,
        'longitude': lng
    });
    wx.navigateTo({
        url:`plugin://routePlan/index?key=${key}&referer=${referer}&endPoint=${endPoint}`
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if(that.data.detailtotal){
    this.setData({
      pageSize:that.data.pageSize + 8
    })
    getProducts({
      shopId:that.data.shopid,
      pageNo:1,
      pageSize:that.data.pageSize
    }).then(res => {
      var goodList = res.pageInfo.list
      for(var item of goodList) {
        item.price = ((item.price)/100).toFixed(2),
        item.shopPrice = ((item.shopPrice)/100).toFixed(2)
      }
      var pageInfo = {pageSize:res.pageInfo.pageSize,pageNo:res.pageInfo.pageNum,total:res.pageInfo.total,next:false}
      if(pageInfo.pageNo*pageInfo.pageSize < pageInfo.total){
        pageInfo.next = true;
      }else{
        this.setData({
          detailtotal:false,
        })
      }
      this.setData({
        goodsList:res.pageInfo.list,
        proPageInfo:pageInfo,
        pageSize:that.data.pageSize + 8
      })
    })
  }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let regionId = app.globalData.region_id
    let shareList = JSON.stringify({
      regionId,
      shopId: this.data.shopId
    }) 
    return {
      title: this.data.detailList.shopName,
      path: 'pages/BusinessDetail/index?shareList=' + shareList
    }
  }
})