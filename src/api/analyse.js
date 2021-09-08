import request from '@/utils/request'

// 最新数据列表
export function getLatestList(data) {
  return request({
    url: '/latest/query',
    method: 'post',
    data
  })
}

// 全局概览-设备数量统计
export function deviceNum(params) {
  return request({
    url: '/home/deviceNum',
    method: 'get',
    params
  })
}

// 全局概览-告警统计
export function alarmNum(params) {
  return request({
    url: '/home/alarmNum',
    method: 'get',
    params
  })
}

// 全局概览-取数速率
export function collectonRate(params) {
  return request({
    url: '/home/collectonRate',
    method: 'get',
    params
  })
}

