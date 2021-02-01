import request from "./../utils/request.js";
/**
 * 
 * 用户相关接口
 * 
*/
export function spreadPeople (data) {
  return request.post('user/selectReferrerInfo', data)
}
// 骑手接口
export function updateHorseman(data) {
  return request.post("recharge/updateHorseman", data);
}
export function findHorseman(data) {
  return request.post("recharge/findHorseman", data);
}
export function mebHorseman(data) {
  return request.post("recharge/mebHorseman", data);
}
export function miniSetPwd(data) {
  return request.post("user/miniSetPwd", data);
}
/**
 * 
 *提交申请接口
 * 
*/
export function selectSjShopInfo (data) {
  return request.post('user/selectSjShopInfo', data)
}
export function findRegion (data) {
  return request.post('webmanage/findRegion', data)
}
export function findmemberapplication (data) {
  return request.post('user/findmemberapplication', data)
}
export function addmemberapplication (data) {
  return request.post('user/addmemberapplication', data)
}
/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function login(data) {
  return request.post("user/minilogin", data, { noAuth : true });
}

export function miniBindAppAccount(data) {
  return request.post("user/miniBindAppAccount", data);
}

export function codeToSessionKey(data) {
  return request.post("user/miniParam", data, { noAuth : true });
}

/**
 * 获取用户信息
 * 
*/
export function getUserInfo(){
  return request.post('user/findUserinfoAll', {}).then(res => {
    if (res.userAndQuotaBean && res.userAndQuotaBean.userDetaliAdress) {
      getApp().globalData.userInfo.userDetaliAdress = res.userAndQuotaBean.userDetaliAdress
    }
    return new Promise((resolve, reject) => {
      resolve(res)
    });
  });
}

export function getFindMember(){
  return request.post('user/findmemberapplication', {type:"2"}).then(res => {
    return new Promise((resolve, reject) => {
      resolve(res)
    });
  });
}
export function addMember(obj){
  return request.post('user/addmemberapplication', obj).then(res => {
    return new Promise((resolve, reject) => {
      resolve(res)
    });
  });
}

/**
 * 修改用户信息
 * @param object
*/
export function userEdit(data){
  return request.post('user/updateMessuser',data);
}

/**
 * 
 * 地址列表
 * @param object data
*/
export function getAddressList(data){
  return request.post('user/seleteAll',data);
}

/**
 * 获取默认地址
 * 
*/
// export function getAddressDefault(){
//   return request.get('address/default');
// }
/**
 * 删除地址
 * @param int id
 * 
*/
export function delAddress(id){
  return request.post('user/deleteAdress',{adressId:id})
}

export function setPwd(data) {
  return request.post('user/miniSetPwd', data)
}

/**
 * 修改 添加地址
 * @param object data
*/
export function editAddress(data){
  if (data.adressId) {
    return request.post('user/updateAdress',data);
  } else {
    return request.post('user/addAdress',data);
  }
}

/**
 * 获取单个地址
 * @param int id 
*/
export function getAddressDetail(id){
  let data = {
    'adressId': id
  }
  return request.post('user/findAdress', data);
}