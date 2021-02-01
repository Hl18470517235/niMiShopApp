import util from './util.js';
import authLogin from './autuLogin.js';
import { HEADER , TOKENNAME} from './../config.js';

export default function request(api, method, data, {noAuth = false, noVerify = false, region = false})
{
  let app = getApp()
  let Url = getApp().globalData.url, header = HEADER;
  if (data && getApp().globalData.token) {
    header[TOKENNAME] = getApp().globalData.token;
    Object.assign(data, {userId: app.globalData.token})
  }
  if (region === true) {
    if (!data) data = {}
    data.regionId = app.globalData.region_id;
  } else if (region == 'userRegionId') {
    if (!data) data = {}
    data.userRegionId = app.globalData.region_id;
  }
  if(app.globalData.timeModel) {
    app.loading()
  }
  return new Promise((reslove, reject) => {
    wx.request({
      url: Url + '/' + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        app.loaded()
        if (noVerify)
          reslove(res.data, res);
        else if (res.data.respCode === '0000') {
          reslove(res.data, res);
        } else if (res.data.respCode === '9999') {
          wx.showToast({
            title: res.data.respMsg,
            icon: 'none',
            duration: 2000
           })
          reject(res.data.respMsg)
        } else if(res.data.respCode === '9998'){
          if(app.globalData.timeModel) {
            wx.showToast({
              title: res.data.respMsg,
              icon: 'none',
              duration: 2000
             })
          }
          reject(res.data.respMsg)
        }else
          reject(res.data.respMsg || '系统错误');
      },
      fail: (msg) => {
        app.loaded()
        reject('请求失败');
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});

