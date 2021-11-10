import request from '@/utils/request'

// 场景联动列表
export function getSceneByPage(data) {
  return request({
    url: '/multiple/device/event/trigger/getEventByPage',
    method: 'post',
    data
  })
}

// 场景联动列表-不分页
export function getSceneList(data) {
  return request({
    url: '/multiple/device/event/trigger/list',
    method: 'post',
    data
  })
}

// 场景联动创建
export function createScene(data) {
  return request({
    url: '/multiple/device/event/trigger/create',
    method: 'post',
    data
  })
}

// 场景联动删除
export function deleteScene(data) {
  return request({
    url: '/multiple/device/event/trigger/delete',
    method: 'post',
    data
  })
}

// 场景联动详情
export function detailScene(params) {
  return request({
    url: '/multiple/device/event/trigger/detail',
    method: 'get',
    params
  })
}

// 场景联动修改状态
export function modifyStatusScene(data) {
  return request({
    url: '/multiple/device/event/trigger/status',
    method: 'post',
    data
  })
}

// 场景联动修改
export function updateScene(data) {
  return request({
    url: '/multiple/device/event/trigger/update',
    method: 'post',
    data
  })
}
