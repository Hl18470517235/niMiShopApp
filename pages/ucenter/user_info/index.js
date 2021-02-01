import { getUserInfo, userEdit} from '../../../api/user.js';
import util from '../../../utils/util.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '个人信息',
      'color': true,
      'class': '0'
    },
    userInfo:{},
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function(){
    this.getUserInfo();
  },

  /**
   * 获取用户详情
  */
  getUserInfo:function(){
    var that=this;
    getUserInfo().then(res=>{
      let info = res.userAndQuotaBean
      if (!info.userNike) {
        info.userNike = info.userPhone;
      }
      info.existPwd = res.existPwd
      that.setData({ userInfo: info});
    });
  },

  /**
  * 上传文件
  * 
 */
  resetAvatar: function () {
    var that = this;
    util.uploadImageOne({url: 'file/uploadFile', inputName: 'file'}, function (res){
      userEdit({userPhoto: res.urlPath}).then(rst=>{
        let userInfo = that.data.userInfo
        userInfo.userPhoto = res.urlPath
        that.setData({userInfo: userInfo})
        app.Tips({ title: '修改成功', icon: 'success' });
      }).catch(msg=>{
        return app.Tips({ title: '修改失败' });
      });
    });
  },
  onPullDownRefresh: function(){
    app.loaded()
  },

  

})