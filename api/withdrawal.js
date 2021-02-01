import request from "./../utils/request.js";

export function findByUSerId (data) {
  return request.post('user/findByUSerId', data)
}

export function findUserQuotaList (data) {
  return request.post('user/findUserQuotaList', data)
}

export function createWithdraw (data) {
  return request.post('recharge/createWithdraw', data)
}

export function findUserCheckGoldList (data) {
  return request.post('user/findUserCheckGoldList', data)
}

export function reconciliationSq (data) {
  return request.post('financial/reconciliationSq', data)
}