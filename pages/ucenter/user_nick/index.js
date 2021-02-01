import { getUserInfo, userEdit} from '../../../api/user.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '修改头像',
      'color': true,
      'class': '0'
    },
    userInfo:{},
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },

  getUserInfo:function(){
    var that=this;
    getUserInfo().then(res=>{
      that.setData({ userInfo: res.userAndQuotaBean});
    });
  },

  /**
   * 提交修改
  */
  formSubmit:function(e){
    var that = this, value = e.detail.value
    if (!value.nickname) return app.Tips({title:'昵称不能为空'});
    userEdit({userNike: value.nickname}).then(res=>{
      app.Tips({ title: '修改成功', icon: 'success' });
      wx.navigateBack()
    }).catch(msg=>{
      return app.Tips({ title: '修改失败' });
    });
  },
  onPullDownRefresh: function(){
    app.loaded()
  },
  

})