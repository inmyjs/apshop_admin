import request from '@/utils/request'

export function getReportAPI() {
  return request({
    url: '/report',
    method: 'get'
  })
}
export function getReportDetail(json) {
  return request({
    url: '/report/detail',
    method: 'get',
    params: json
  })
}



