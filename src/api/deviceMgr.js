import request from '@/utils/request'

// 设备组列表
export function getDeviceGrpByPage(data) {
  return request({
    url: '/deviceGroup/getDeviceGrpByPage',
    method: 'post',
    data
  })
}

export function getDeviceGrpList(data) {
  return request({
    url: '/deviceGroup/list',
    method: 'post',
    data
  })
}

// 设备组新增
export function createDeviceGroup(data) {
  return request({
    url: '/deviceGroup/create',
    method: 'post',
    data
  })
}

// 设备组修改
export function updateDeviceGroup(data) {
  return request({
    url: '/deviceGroup/update',
    method: 'post',
    data
  })
}

// 设备组删除
export function deleteDeviceGroup(data) {
  return request({
    url: '/deviceGroup/delete',
    method: 'post',
    data
  })
}

// 设备列表
export function getDeviceByPage(data) {
  return request({
    url: '/device/getDeviceByPage',
    method: 'post',
    data
  })
}

// 设备列表-不分页
export function getDeviceList(data) {
  return request({
    url: '/device/list',
    method: 'post',
    data
  })
}

// 设备新增
export function createDevice(data) {
  return request({
    url: '/device/create',
    method: 'post',
    data
  })
}

// 设备修改
export function updateDevice(data) {
  return request({
    url: '/device/update',
    method: 'post',
    data
  })
}

// 设备删除
export function deleteDevice(data) {
  return request({
    url: '/device/delete',
    method: 'post',
    data
  })
}

// 设备详情
export function deviceDetail(params) {
  return request({
    url: '/device/detail',
    method: 'get',
    params
  })
}

// 设备标签
export function getDeviceTag(params) {
  return request({
    url: '/device/tag/list',
    method: 'get',
    params
  })
}

// 更新设备标签
export function updateDevTag(data) {
  return request({
    url: '/device/tag/update',
    method: 'post',
    data
  })
}

// 设备属性列表
export function getAttrTrapperByPage(data) {
  return request({
    url: '/device/model/getAttrTrapperByPage',
    method: 'post',
    data
  })
}

// 设备属性列表--不分页
export function getAttrTrapperList(data) {
  return request({
    url: '/device/model/list',
    method: 'post',
    data
  })
}

// 设备属性创建
export function createAttrTrapper(data) {
  return request({
    url: '/device/model/attr/trapper/create',
    method: 'post',
    data
  })
}

// 设备属性修改
export function updateAttrTrapper(data) {
  return request({
    url: '/device/model/attr/trapper/update',
    method: 'post',
    data
  })
}

// 设备属性删除
export function deleteAttrTrapper(data) {
  return request({
    url: '/device/model/attr/trapper/delete',
    method: 'post',
    data
  })
}

// 设备属性详情
export function detailAttrTrapper(params) {
  return request({
    url: '/device/model/detail',
    method: 'get',
    params
  })
}

// 设备属性历史数据
export function getHistory(data) {
  return request({
    url: '/history/query',
    method: 'post',
    data
  })
}

// 设备属性-历史数据-趋势图
export function getCharts(params) {
  return request({
    url: '/home/getCharts',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 设备值映射列表
export function getDevValueMapList(params) {
  return request({
    url: '/device/valueMap/list',
    method: 'get',
    params
  })
}

// 设备值映射修改
export function updateDevValuemap(data) {
  return request({
    url: '/device/valueMap/update',
    method: 'post',
    data
  })
}

// 设备值映射删除
export function deleteDevValuemap(data) {
  return request({
    url: '/device/valuemap/delete',
    method: 'post',
    data
  })
}

// 上下线规则创建
export function createTrigger(data) {
  return request({
    url: '/product/trigger/status/create',
    method: 'post',
    data
  })
}

// 上下线规则修改
export function updateTrigger(data) {
  return request({
    url: '/product/trigger/status/update',
    method: 'post',
    data
  })
}

// 上下线规则详情
export function getTrigger(params) {
  return request({
    url: '/product/trigger/status/detail',
    method: 'get',
    params
  })
}

// 告警规则创建
export function createAlarm(data) {
  return request({
    url: '/product/event/create',
    method: 'post',
    data
  })
}

// 告警规则列表
export function getEventByPage(data) {
  return request({
    url: '/product/event/getEventByPage',
    method: 'post',
    data
  })
}

// 告警规则修改-设备
export function updateEventDev(data) {
  return request({
    url: '/device/event/update',
    method: 'post',
    data
  })
}

// 告警规则修改-产品
export function updateEvent(data) {
  return request({
    url: '/product/event/update',
    method: 'post',
    data
  })
}

// 告警规则删除
export function deleteEvent(data) {
  return request({
    url: '/product/event/delete',
    method: 'post',
    data
  })
}
// 告警规则详情
export function detailEventDev(params) {
  return request({
    url: '/device/event/detail',
    method: 'get',
    params
  })
}
