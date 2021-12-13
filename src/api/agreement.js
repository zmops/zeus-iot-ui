import request from '@/utils/request'

// 协议组件-新增
export function createComponent(data) {
  return request({
    url: '/protocol/component/create',
    method: 'post',
    data
  })
}

// 协议组件-列表
export function getProtocolComponentByPage(data) {
  return request({
    url: '/protocol/component/getProtocolComponentByPage',
    method: 'post',
    data
  })
}

// 协议组件-列表-不分页
export function getComponentList(data) {
  return request({
    url: '/protocol/component/list',
    method: 'post',
    data
  })
}

// 协议组件-上传
export function uploadComponent(data) {
  return request({
    url: '/protocol/component/upload',
    method: 'post',
    data
  })
}

// 协议组件-删除
export function deleteComponent(data) {
  return request({
    url: '/protocol/component/delete',
    method: 'post',
    data
  })
}

// 协议组件-修改
export function updateComponent(data) {
  return request({
    url: '/protocol/component/update',
    method: 'post',
    data
  })
}

// 协议组件-发布
export function publish(params) {
  return request({
    url: '/protocol/component/publish',
    method: 'get',
    params
  })
}

// 协议组件-重新发布
export function unPublish(params) {
  return request({
    url: '/protocol/component/unPublish',
    method: 'get',
    params
  })
}

// 通讯服务-新增
export function createService(data) {
  return request({
    url: '/protocol/service/create',
    method: 'post',
    data
  })
}

// 通讯服务-修改
export function updateService(data) {
  return request({
    url: '/protocol/service/update',
    method: 'post',
    data
  })
}

// 通讯服务-列表
export function getProtocolServiceByPage(data) {
  return request({
    url: '/protocol/service/getProtocolServiceByPage',
    method: 'post',
    data
  })
}

// 通讯服务-列表-不分页
export function getServiceList(data) {
  return request({
    url: '/protocol/service/list',
    method: 'post',
    data
  })
}

// 通讯服务-删除
export function deleteService(data) {
  return request({
    url: '/protocol/service/delete',
    method: 'post',
    data
  })
}

// 协议网关-新增
export function createGateway(data) {
  return request({
    url: '/protocol/gateway/create',
    method: 'post',
    data
  })
}

// 协议网关-修改
export function updateGateway(data) {
  return request({
    url: '/protocol/gateway/update',
    method: 'post',
    data
  })
}

// 协议网关-列表
export function getProtocolGatewayByPage(data) {
  return request({
    url: '/protocol/gateway/getProtocolGatewayByPage',
    method: 'post',
    data
  })
}

// 协议网关-删除
export function deleteGateway(data) {
  return request({
    url: '/protocol/gateway/delete',
    method: 'post',
    data
  })
}

// 协议组件-启动
export function startGateway(params) {
  return request({
    url: '/protocol/gateway/start',
    method: 'get',
    params
  })
}

// 协议组件-停止
export function stopGateway(params) {
  return request({
    url: '/protocol/gateway/stop',
    method: 'get',
    params
  })
}
