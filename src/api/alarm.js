import request from '@/utils/request'

// 告警记录列表
export function getAlarmByPage(data) {
  return request({
    url: '/alarm/getAlarmByPage',
    method: 'post',
    data
  })
}

// 告警记录-解决
export function resolve(params) {
  return request({
    url: '/alarm/resolve',
    method: 'get',
    params
  })
}

// 告警记录-确认
export function acknowledgement(params) {
  return request({
    url: '/alarm/acknowledgement',
    method: 'get',
    params
  })
}
