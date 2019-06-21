import request from '@/utils/request'

export function fetchList(model,query) {
  return request({
    url: '/model/'+model,
    method: 'get',
    params: query
  })
}

export function fetchRegion(parent_id) {
  return request({
    url: '/region',
    method: 'get',
    params: {parent_id}
  })
}

export function fetchModel(model,id) {
  return request({
    url: '/model/'+model+"/"+id,
    method: 'get'
  })
}


export function delModel(model,id) {
  return request({
    url: '/model/'+model+"/"+id,
    method: 'delete',
  })
}

export function createModel(model,data) {
  return request({
    url: '/model/'+model,
    method: 'post',
    data
  })
}
export function updateModel(model,id,data) {
  return request({
    url: '/model/'+model+'/'+id,
    method: 'put',
    data
  })
}
export function updateModelStatus(model,id,status) {
  return request({
    url: '/model/'+model+'/'+id,
    method: 'post',
    data:{status}
  })
}



