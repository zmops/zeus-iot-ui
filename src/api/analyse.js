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

// 全局概览-事件统计
export function eventNum(params) {
  return request({
    url: '/home/eventNum',
    method: 'get',
    params
  })
}

// 全局概览-今日调用服务
export function serviceExecuteNum(params) {
  return request({
    url: '/home/serviceExecuteNum',
    method: 'get',
    params
  })
}

// 全局概览-告警数量
export function alarmTop(params) {
  return request({
    url: '/home/alarmTop',
    method: 'get',
    params
  })
}

// 全局概览-数据量统计
export function dataLevel(params) {
  return request({
    url: '/home/dataLevel',
    method: 'get',
    params
  })
}

