import {  postCartAdd } from '../../api/store.js';
const app = getApp();
Component({
  properties: {
    status: {
      type: String,
      value: 0,
    },
    imgType: {
      type: String,
      value: '0'
    },
    type: {
      type: String,
      value: 0,
    },
    bastList: {
      type: Object,
      value: [],
    },
    rlabel: {
      type: String,
      value: 1,
    }
  },
  data: {
    type:1,
    isAuto:false,
    iShidden:false,
  },
  attached(){
    this.authorize = this.selectComponent('#authorize')
  },
  methods: {
    addToCart(e){
      var that = this 
      if(!app.globalData.model){
        this.authorize.setAuthStatus()
        return; 
      }
      let id = e.currentTarget.dataset.id
      that.data.bastList.forEach((item) => {
        if(item.productId == id) {
          if(item.count == 0) {
            return app.Tips({
              title: '商品库存不足'
            })
          }else{
            //wx.showLoading({ title:'请稍候'});
            postCartAdd({productId: id}).then(res => {
              //wx.hideLoading()
              wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 2000
              })
            }).catch(err => {
             // wx.hideLoading()
            })
          }
        }
      })
    },
    toDetail (e) {
      let id = e.currentTarget.dataset.id
      let replace = e.currentTarget.dataset.replace
      if (replace == 1) {
        wx.redirectTo({
          url: '/pages/goods/goods_details/index?id=' + id
        })
      } else {
        wx.navigateTo({
          url: '/pages/goods/goods_details/index?id=' + id,
        })
      }
    }
  }
})