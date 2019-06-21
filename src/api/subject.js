import request from '@/utils/request'

export function postGoods(json) {
  return request({
    url: '/subject/goods',
    method: 'post',
    data:json
  })
}

