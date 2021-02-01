import request from "./../utils/request.js";

export function findShopBindType(data) {
  return request.post('product/findShopBindType', data);
}