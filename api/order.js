import request from "./../utils/request.js";
/**
 * 获取购物车列表
 * 
 */
export function getCartList() {
  return request.post("order/selectAll", {}, {region:true});
}
/*********************
 * 
 * 商家联盟购物车
 * 
 * *********************************/
export function getCartList1(data) {
  return request.post("order/selectAll", data);
}

export function userFindShopShares(data) {
  return request.post("/recharge/userFindShopShares", data);
}
/*********************
 * 
 * 订单消费统计
 * 
 * *********************************/
export function findUserOrder(data) {
  return request.post("order/findUserOrderList", data);
}
export function findUserOrderDetail(data) {
  return request.post("order/findUserOrderListDetail", data);
}


export function findUserDefalutTihuoShop(data) {
  return request.post("recharge/findUserDefalutTihuoShop", data);
}
export function horseManDwCheck(data) {
  return request.post("recharge/horseManDwCheck", data);
}

/**
 * 获取购物车列表
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
export function getCartCounts(numType) {
  return request.get("cart/count", { numType: numType === undefined ? true : numType });
}


/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(data) {
  return request.post("order/updateCountById", data);
}

/**
 * 清除购物车
 * @param object ids join(',') 切割成字符串
*/
export function cartDel(ids){
  return request.post('order/deleteCarByListId', { specificationsDetailIds: ids});
}

/**
 * 订单列表
 * @param object data
*/
export function getOrderList(data){
  return request.post('order/APPselectOrderInfo',data);
}
export function findCsWd(data){
  return request.post('recharge/findCsWd',data);
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
*/
export function orderConfirm(list){
  return request.post('order/settlement', {shoppingList: list});
}

export function orderConfirm1(data){
  return request.post('order/settlement', data);
}
/**
 * 再次下单
 * @param string uni
 * 
*/
export function orderAgain(uni){
  return request.post('order/again',{uni:uni});
}

/**
 * 订单支付
 * @param object data
*/
export function orderPay(data){
  return request.post('order/pay',data);
}

/**
 * 订单详情
 * @param string uni 
*/
export function getOrderDetail(uni){
  let p = {
    orderId: uni,
    status: "1"
  }
  return request.post('order/APPselectOrderDetailInfo', p);
}

/**
 * 删除已完成订单
 * @param string uni
 * 
*/
export function orderDel(uni){
  return request.post('order/del',{uni:uni});
}

/**
 * 订单收货
 * @param string uni
 * 
*/
export function orderTake(order_id){
  return request.post('order/updateOrderStatus',{orderId:order_id, orderStatus: 4});
}

/**
 * 订单查看物流
 * @param string uni
*/
export function orderExpress(uni){
  return request.get('order/express/'+uni);
}

/**
 * 订单评价
 * @param object data
 * 
*/
export function orderComment(data){
  return request.post('user/addUserComment',data);
}

// 骑手位置信息
export function getThreeDw(data){
  return request.post('order/getThreeDw',data);
}
/**
 * 订单取消
 * @param string id
 * 
*/
export function orderCancel(id){
  return request.post('order/updateOrderStatus',{orderId:id, orderStatus:5});
}

/**
 * 订单产品信息
 * @param string unique 
*/
export function orderProduct(unique){
  return request.post('order/product', { unique: unique});
}

/**
 * 订单退款审核
 * @param object data
*/
export function orderRefundVerify(data){
  return request.post('order/refund/verify',data);
}

/**
 * 获取退款理由
 * 
*/
export function ordeRefundReason(){
  return request.get('order/refund/reason');
}

/**
 * 订单统计数据
*/
export function orderData(){
  return request.get('order/data')
}

export function getPayment(data){
  return request.post('order/payment', data, {region: 'userRegionId'})
}

export function findTiHuoShop(data) {
  return request.post('recharge/findTihuoShop', data, {region: true})
}

export function findTiHuoShopOne(data) {
  return request.post('recharge/findOneTihuoShop', data, {region: true})
}

/**
 * 获取当前金额能使用的优惠卷
 * @param string price
 * 
*/
export function getCouponsOrderPrice(price){
  return request.get('coupons/order/'+price)
}

/**
 * 订单创建
 * @param string key
 * @param object data
 * 
*/
export function orderCreate(data){
  return request.post('order/createOrder',data, {region: 'userRegionId'});
}
/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(uni) {
  return request.get("order/express/" + uni);
}

export function queryWxOrderState(data) {
  return request.post("order/queryWxOrderState", data);
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
  return request.post("/order/computed/" + key, data);
}