import request from "./../utils/request.js";

/**
 * 获取直播间
 */
export function getNimiRoom(data) {
  return request.post('webmanage/nimiRoom/findNimiRoom', data);
}
/**
 * 获取直播间播放历史
 */
export function getRoomHistory(data) {
  return request.post('webmanage/nimiRoom/findNimiRoomHistory', data);
}
export function selectNimiIndustryType(data) {
  return request.post('product/selectNimiIndustryType', data)
}
//查看商家店铺
export function selectMuchShop(data) {
  return request.post('user/selectMuchShop', data)
}
//查看商家分类
export function selectBusinessAllianceType(data) {
  return request.post('product/selectBusinessAllianceType', data)
}

/**
 * 获取推荐产品
 * 
 */
export function getProductHot(page,limit) {
  return request.post('product/user/findUserLikeProduct', {isFlag: 0}, {region: true, noAuth:true})
}
export function selectIdType(data) {
  return request.post('product/user/selectIdType', data)
}
/**
 * 购车添加
 * 
*/
export function postCartAdd(data) {
  return request.post('order/addProductToCar', data);
}

export function postCartInser(data) {
  return request.post('order/inserCar', data);
}

/**
 * 获取收藏列表
 * @param object data
*/
export function getCollectUserList(data) {
  return request.get('collect/user', data)
}

/**
 * 批量收藏
 * 
 * @param object id  产品编号 join(',') 切割成字符串
 * @param string category 
*/
export function collectAll(id, category) {
  return request.post('collect/all', { id: id, category: category === undefined ? 'product' : category });
}

/**
 * 删除收藏产品
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
*/
export function collectDel(id, category) {
  return request.post('collect/del', { id: id, category: category === undefined ? 'product' : category });
}

/**
 * 添加收藏
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
*/
export function collectAdd(id, category){
  return request.post('collect/add', { id: id, 'product': category === undefined ? 'product' : category });
}

/**
 * 获取产品详情
 * @param int id
 * 
*/
export function getProductDetail(id){
  let p = {
    "productId": id,
    "userId": "",
    "regionId": "82020031118032920222333309702211"
  }
  return request.post('product/user/findDetailProduct', p, { noAuth : true });
}

/**
 * 产品分享二维码 推广员
 * @param int id
*/
export function getProductCode(id){
  return request.get('product/code/' + id, { user_type:'routine'});
}

/**
 * 获取产品评论
 * @param int id
 * @param object data
 * 
*/
export function getReplyList(data){
  return request.post('product/user/userCommentList',data)
}

/**
 * 产品评价数量和好评度
 * @param int id
*/
export function getReplyConfig(id){
  return request.get('reply/config/'+id);
} 

/**
 * 获取分类列表
 * 
*/
export function getCategoryList(type){
  let p = {
    type: type
  }
  return request.post('product/findProductType', p, { noAuth:true})
}

/**
 * 获取产品列表
 * @param object data
*/
export function getProductslist(data){
  return request.post('product/user/findProduct',data,{noAuth:true, region: true});
}
export function getProducts(data){
  return request.post('product/user/findProduct',data);
}

/**
 * 首页产品的轮播图和产品信息
 * @param int type 
 * 
*/
export function getGroomList(type){
  return request.get('groom/list/'+type,{},{noAuth:true});
}

/**
 * 获取搜索关键字获取
 * 
*/
export function getSearchKeyword(){
  return request.get('search/keyword',{},{noAuth:true});
}