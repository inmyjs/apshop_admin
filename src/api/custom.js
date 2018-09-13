import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/custom/list',
    method: 'get',
    params: query
  })
}

export function fetchCustom(id) {
  return request({
    url: '/custom/'+id,
    method: 'get'
  })
}

export function updateCustomStatus(json) {
  return request({
    url: '/custom/status',
    method: 'post',
    data:json
  })
}

export function delCustom(id) {
  return request({
    url: '/custom/'+id,
    method: 'delete',
  })
}


