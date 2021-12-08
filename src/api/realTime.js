import request from '@/utils/request'

// 代理监控列表
export function monitorInfo(params) {
  return request({
    url: '/proxy/monitor/info',
    method: 'get',
    params
  })
}
