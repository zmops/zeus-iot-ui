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

// 设备属性列表
export function getAttrTrapperByPage(data) {
  return request({
    url: '/device/model/getAttrTrapperByPage',
    method: 'post',
    data
  })
}
