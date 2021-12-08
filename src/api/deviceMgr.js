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

// 设备修改状态
export function modifyStatusDev(data) {
  return request({
    url: '/device/status/update',
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
export function deleteDevValueMap(data) {
  return request({
    url: '/device/valueMap/delete',
    method: 'post',
    data
  })
}

// 设备调试
export function sendData(data) {
  return request({
    url: '/device/api/sendData',
    method: 'post',
    data
  })
}


// 上下线规则创建
export function createTrigger(data) {
  return request({
    url: '/product/status/trigger/create',
    method: 'post',
    data
  })
}

// 上下线规则修改
export function updateTrigger(data) {
  return request({
    url: '/product/status/trigger/update',
    method: 'post',
    data
  })
}

// 上下线规则详情
export function getTrigger(params) {
  return request({
    url: '/product/status/trigger/detail',
    method: 'get',
    params
  })
}

// 告警规则创建
export function createDevAlarm(data) {
  return request({
    url: '/device/event/trigger/create',
    method: 'post',
    data
  })
}

// 告警规则列表
export function getEventByPage(data) {
  return request({
    url: '/product/event/trigger/getEventByPage',
    method: 'post',
    data
  })
}

// 告警规则修改-设备
export function updateEventDev(data) {
  return request({
    url: '/device/event/trigger/update',
    method: 'post',
    data
  })
}

// 告警规则修改-产品
export function updateEvent(data) {
  return request({
    url: '/product/event/trigger/update',
    method: 'post',
    data
  })
}

// 告警规则删除
export function deleteDevEvent(data) {
  return request({
    url: '/device/event/trigger/delete',
    method: 'post',
    data
  })
}

// 告警规则详情
export function detailEventDev(params) {
  return request({
    url: '/device/event/trigger/detail',
    method: 'get',
    params
  })
}

// 告警规则修改状态
export function modifyStatusEventDev(data) {
  return request({
    url: '/device/event/trigger/status',
    method: 'post',
    data
  })
}

// 事件管理列表
export function getAttrEventByPage(data) {
  return request({
    url: '/product/attribute/event/getAttrEventByPage',
    method: 'post',
    data
  })
}

// 事件管理列表-不分页
export function getEventList(data) {
  return request({
    url: '/product/attribute/event/list',
    method: 'post',
    data
  })
}

// 事件管理修改
export function updateAttrEvent(data) {
  return request({
    url: '/product/attribute/event/update',
    method: 'post',
    data
  })
}

// 事件管理删除
export function deleteAttrEvent(data) {
  return request({
    url: '/product/attribute/event/delete',
    method: 'post',
    data
  })
}

// 事件管理创建
export function createAttrEvent(data) {
  return request({
    url: '/product/attribute/event/create',
    method: 'post',
    data
  })
}

// 事件管理详情
export function detailAttrEvent(params) {
  return request({
    url: '/product/attribute/event/detail',
    method: 'get',
    params
  })
}

// 变量管理列表
export function getMacroByPage(data) {
  return request({
    url: '/macro/list',
    method: 'post',
    data
  })
}

// 变量管理修改
export function updateMacro(data) {
  return request({
    url: '/macro/update',
    method: 'post',
    data
  })
}

// 变量管理删除
export function deleteMacro(data) {
  return request({
    url: '/macro/delete',
    method: 'post',
    data
  })
}

// 变量管理创建
export function createMacro(data) {
  return request({
    url: '/macro/create',
    method: 'post',
    data
  })
}

// 设备日志列表
export function getLogByPage(data) {
  return request({
    url: '/device/log/getLogByPage',
    method: 'post',
    data
  })
}

// 设备日志列表-不分页
export function deviceLogList(params) {
  return request({
    url: '/device/log/list',
    method: 'get',
    params
  })
}
