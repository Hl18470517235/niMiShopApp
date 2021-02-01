import { getReplyList, getReplyConfig} from '../../../api/store.js';

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '用户评价',
      'color': false,
    },
    replyData:{},
    product_id:0,
    reply:[],
    type:0,
    loading:false,
    loadend:false,
    loadTitle:'加载更多',
    page:1,
    limit:10,
    reply_chance: 100,
    total: 0
  },
  /**
   * 授权回调
   * 
  */
  onLoadFun:function(){
    //this.getProductReplyCount();
    this.getProductReplyList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.product_id) return app.Tips({title:'缺少参数'},{tab:3,url:1});
    this.setData({
      product_id:options.product_id,
      reply_chance: options.chance
    });
  }, 
  /**
   * 获取评论统计数据
   * 
  */
  getProductReplyCount:function(){
    var that=this;
    getReplyConfig(that.data.product_id).then(res=>{
      that.setData({ replyData: res.data });
    });
  },
  /**
   * 分页获取评论
  */
  getProductReplyList:function(){
    var that=this;
    if (that.data.loadend) return;
    if (that.data.loading) return;
    that.setData({loading:true,loadTitle:''});
    getReplyList({
      productId: that.data.product_id,
      pageNo: that.data.page,
      pageSize: that.data.limit,
      //type: that.data.type,
    }).then(res=>{
      var list = res.pageInfo.list, loadend = list.length < that.data.limit;
      for(var itm of list) {
        itm.crtTm = itm.crtTm.substr(0, 19).replace('T', ' ')
      }
      that.data.reply = app.SplitArray(list, that.data.reply);
      that.setData({
        reply: that.data.reply,
        total: res.pageInfo.total,
        loading: false,
        loadend: loadend,
        loadTitle: loadend ? "😕人家是有底线的~~" : "加载更多",
        page: that.data.page + 1
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: '加载更多' });
    });
  },
    /*
    * 点击事件切换
    * */
  changeType:function(e){
    var type = e.target.dataset.type;
    type=parseInt(type);
    if(type==this.data.type) return;
    this.setData({type:type,page:1,loadend:false,reply:[]});
    this.getProductReplyList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getProductReplyList();
  },
/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().shareData();
  },
  onPullDownRefresh: function(){
    app.loaded()
  }
})