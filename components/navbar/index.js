var app = getApp();
Component({
  properties: {
    parameter:{
      type: Object,
      value:{
        class:'0'
      },
    }, 
    logoUrl:{
      type:String,
      value:'',
    }
  },
  data: {
    navH: "",
    masModel:true
  },
  ready: function(){
    this.setClass();
    this.setData({
      'parameter.color': true,
      'parameter.return': 1,
    });
  },
  attached: function () {
    this.setData({
      navH: app.globalData.navHeight
    });
  },
  methods: {
    close:function(){
      this.setData({
        masModel:false,
      })
    },
    return:function(){
      var pages = getCurrentPages();
      console.log(pages)
      if (pages.length <= 1) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
          wx.navigateBack()
      }
    },
    setGoodsSearch:function(){
       wx.navigateTo({
         url: '/pages/goods/goods_search/index',
       })
    },
    setClass:function(){
      var color = '';
      switch (this.data.parameter.class) {
        case "0": case 'on':
          color = 'on'
          break;
        case '1': case 'black':
          color = 'black'
          break;
        case '2': case 'gray':
          color = 'gray'
          break;
        case '3': case "red":
          color = 'red'
          break;
        case '4': case "gradual01":
          color = 'gradual01'
          break;
        case '5': case "zhibo":
          color = 'zhibo'
          break;
        case '6': case "shopHome":
          color = 'shopHome'
          break;
        case '7': case "bgcHome":
          color = 'bgcHome'
          break;
        default:
          color = 'on'
          break;
      }
      this.setData({
        'parameter.class': color
      })
    }
  }
})