import {
  editAddress,
  getAddressDetail,
  delAddress
} from '../../../api/user.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '添加地址'
    },
    region: ['省', '市', '区'],
    cartId: '', //购物车id
    pinkId: 0, //拼团id
    couponId: 0, //优惠券id
    id: 0, //地址id
    userAddress: {
      isDefaultFlag: false
    }, //地址详情
  },
  /**
   * 授权回调
   * 
   */
  onLoadFun: function () {
    this.getUserAddress();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cartId: options.cartId || '',
      pinkId: options.pinkId || 0,
      couponId: options.couponId || 0,
      id: options.id || 0,
      'parameter.title': options.id ? '修改地址' : '添加地址'
    });
  },
  bindRegionChange: function (e) {
    var that = this
    wx.chooseLocation({
      type: 'gcj02',
      success (res) {
      that.setData({
        latitude:res.latitude,
        longitude:res.longitude
      })
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/?location='+that.data.latitude+','+that.data.longitude, 
        data: {
          key:app.globalData.mapKey
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success (res) {
          var list = res.data.result.address_component
          that.setData({
            region:[list.province,list.city,list.district,list.street],
          })
        }
      })
      }
     })
    // this.setData({
    //   region: e.detail.value
    // })
  },
  getUserAddress: function () {
    if (!this.data.id) return false;
    var that = this;
    getAddressDetail(this.data.id).then(res => {
      let bean = res.userAdressbean;
      var region = [bean.provinceId, bean.cityId, bean.areaId];
      var c = 'region[3]'
      that.setData({
        userAddress: {
          real_name: bean.receivingUserName,
          phone: bean.receivingPhone,
          sex: bean.sex,
          label: bean.label, 
          isDefaultFlag: bean.isDefaultFlag,
          detail: bean.detailAdress
        },
        region: region,
        longitude:bean.lng,
        latitude:bean.lat,
        [c]:bean.detailAdress
      });
    });
  },
  delete: function (e) {
    let that = this
    wx.showModal({
      title: '删除确认',
      content: '确定删除当前地址？',
      success: function (res) {
        if (!res.confirm) return
        delAddress(that.data.id).then(res => {
          app.Tips({
            title: '删除成功',
            icon: 'success'
          });
          wx.navigateBack({ changed: true });
        }).catch(err => {
          return app.Tips({
            title: err
          });
        });
      }
    })
  },
  /**
   * 提交用户添加地址
   * 
   */
  formSubmit: function (e) {
    var that = this,
      value = e.detail.value;
    if (!value.real_name) return app.Tips({
      title: '请填写收货人姓名'
    });
    if (!value.phone) return app.Tips({
      title: '请填写联系电话'
    });
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone)) return app.Tips({
      title: '请输入正确的手机号码'
    });
    if (that.data.region[0] == '省') return app.Tips({
      title: '请选择所在地区'
    });
    if (!value.detail) return app.Tips({
      title: '请填写详细地址'
    });
    let param = {
      isDefaultFlag: that.data.userAddress.isDefaultFlag ? 1 : 0,
      cityId: that.data.region[1],
      areaId: that.data.region[2],
      provinceId: that.data.region[0],
      sex: that.data.userAddress.sex,
      receivingUserName: value.real_name,
      receivingPhone: value.phone,
      detailAdress: value.detail,
      label: value.label,
      lat:that.data.latitude,
      lng:that.data.longitude 
    }
    if (that.data.id) {
      param.adressId = that.data.id;
    }
    editAddress(param).then(res => {
      if (that.data.id)
        app.Tips({ 
          title: '修改成功',
          icon: 'success'
        });
      else
        app.Tips({
          title: '添加成功',
          icon: 'success'
        });
      setTimeout(function () {
        if (that.data.cartId) {
          var cartId = that.data.cartId;
          var pinkId = that.data.pinkId;
          var couponId = that.data.couponId;
          that.setData({
            cartId: '',
            pinkId: '',
            couponId: ''
          })
          wx.navigateTo({
            url: '/pages/order/order_confirm/index?cartId=' + cartId + '&addressId=' + (that.data.id ? that.data.id : res.data.id) + '&pinkId=' + pinkId + '&couponId=' + couponId
          });
        } else {
          wx.navigateBack({
            delta: 1
          });
        }
      }, 1000);
    }).catch(err => {
      return app.Tips({
        title: err
      });
    })
  },
  ChangeIsDefault: function (e) {
    this.setData({
      'userAddress.isDefaultFlag': !this.data.userAddress.isDefaultFlag
    });
  },
  onPullDownRefresh: function(){
    app.loaded()
  },
  ChangeSex: function (e) {
    let sex = 0
    if (e.detail.value.length > 0) {
      sex = e.detail.value.pop()
    }
    this.setData({
      'userAddress.sex': sex
    })
  }
})