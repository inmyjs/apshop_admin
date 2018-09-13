import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function fetchGoods(id) {
  return request({
    url: '/goods/'+id,
    method: 'get'
  })
}

export function postGoods(json) {
  return request({
    url: '/goods',
    method: 'post',
    data:json
  })
}
export function updateGoodsStatus(json) {
  return request({
    url: '/goods/status',
    method: 'post',
    data:json
  })
}
export function updateRecommendFlag(json) {
  return request({
    url: '/goods/recommend',
    method: 'post',
    data:json
  })
}
export function delGoods(id) {
  return request({
    url: '/goods/'+id,
    method: 'delete',
  })
}
export function fetchPv(pv) {
  return request({
    url: '/goods/pv',
    method: 'get',
    params: { pv }
  })
}

