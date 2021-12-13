import request from '@/utils/request'

// 代理监控列表
export function monitorInfo(params) {
  return request({
    url: '/proxy/monitor/info',
    method: 'get',
    params
  })
}

// 操作系统-CPU负载
export function cpuLoad(params) {
  return request({
    url: '/monitor/self/cpuLoad',
    method: 'get',
    params
  })
}

// 操作系统-CPI使用率
export function cpuUtilization(params) {
  return request({
    url: '/monitor/self/cpuUtilization',
    method: 'get',
    params
  })
}

// 操作系统-进程信息
export function process(params) {
  return request({
    url: '/monitor/self/process',
    method: 'get',
    params
  })
}

// 操作系统-内存信息
export function memory(params) {
  return request({
    url: '/monitor/self/memory',
    method: 'get',
    params
  })
}
