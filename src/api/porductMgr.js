import request from '@/utils/request'

// 产品分类树
export function getProductTypeTree(data) {
  return request({
    url: '/productType/tree',
    method: 'post',
    data
  })
}

// 产品分类-新增
export function createProductType(data) {
  return request({
    url: '/productType/create',
    method: 'post',
    data
  })
}

// 产品分类-删除
export function deleteProductType(data) {
  return request({
    url: '/productType/delete',
    method: 'post',
    data
  })
}

// 产品分类-修改
export function updateProductType(data) {
  return request({
    url: '/productType/update',
    method: 'post',
    data
  })
}

// 产品分页列表
export function getProductByPage(data) {
  return request({
    url: '/product/getProductByPage',
    method: 'post',
    data
  })
}

export function getProductList(data) {
  return request({
    url: '/product/list',
    method: 'post',
    data
  })
}

// 产品详情
export function productDetail(params) {
  return request({
    url: '/product/detail',
    method: 'get',
    params
  })
}

// 新增产品
export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data
  })
}

// 更新产品
export function UpdateProduct(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data
  })
}

// 删除产品
export function DeleteProduct(data) {
  return request({
    url: '/product/delete',
    method: 'post',
    data
  })
}

// 产品标签列表
export function getProdTagList(params) {
  return request({
    url: '/product/tag/list',
    method: 'get',
    params
  })
}

// 更新产品标签
export function updateProdTag(data) {
  return request({
    url: '/product/tag/update',
    method: 'post',
    data
  })
}

// 产品属性列表
export function getAttrTrapperByPage(data) {
  return request({
    url: '/product/model/getAttrTrapperByPage',
    method: 'post',
    data
  })
}

// 产品属性列表-不分页
export function getProductAttrTrapperList(data) {
  return request({
    url: '/product/model/list',
    method: 'post',
    data
  })
}

// 产品属性详情
export function detailAttrTrapper(params) {
  return request({
    url: '/product/model/detail',
    method: 'get',
    params
  })
}

// 产品属性创建
export function createAttrTrapper(data) {
  return request({
    url: '/product/model/attr/trapper/create',
    method: 'post',
    data
  })
}

// 产品属性修改
export function updateAttrTrapper(data) {
  return request({
    url: '/product/model/attr/trapper/update',
    method: 'post',
    data
  })
}

// 产品属性删除
export function deleteAttrTrapper(data) {
  return request({
    url: '/product/model/attr/trapper/delete',
    method: 'post',
    data
  })
}

// 产品值映射列表
export function getValueMapList(params) {
  return request({
    url: '/product/valueMap/list',
    method: 'get',
    params
  })
}

// 产品值映射修改
export function updateValuemap(data) {
  return request({
    url: '/product/valueMap/update',
    method: 'post',
    data
  })
}

// 产品值映射删除
export function deleteValuemap(data) {
  return request({
    url: '/product/valuemap/delete',
    method: 'post',
    data
  })
}

// 产品服务列表
export function getServiceByPage(data) {
  return request({
    url: '/product/service/getServiceByPage',
    method: 'post',
    data
  })
}

// 产品服务列表-不分页
export function getServiceList(data) {
  return request({
    url: '/product/service/list',
    method: 'post',
    data
  })
}

// 产品服务创建
export function createService(data) {
  return request({
    url: '/product/service/create',
    method: 'post',
    data
  })
}

// 产品服务修改
export function updateService(data) {
  return request({
    url: '/product/service/update',
    method: 'post',
    data
  })
}

// 产品服务删除
export function deleteService(data) {
  return request({
    url: '/product/service/delete',
    method: 'post',
    data
  })
}

// 产品服务获取输入参数
export function getServiceData(params) {
  return request({
    url: '/product/service/param/list',
    method: 'get',
    params
  })
}

// 告警规则详情
export function detailEvent(params) {
  return request({
    url: '/product/event/trigger/detail',
    method: 'get',
    params
  })
}

// 告警规则创建
export function createAlarm(data) {
  return request({
    url: '/product/event/trigger/create',
    method: 'post',
    data
  })
}

// 告警规则删除
export function deleteEvent(data) {
  return request({
    url: '/product/event/trigger/delete',
    method: 'post',
    data
  })
}

// 告警规则修改状态
export function modifyStatusEvent(data) {
  return request({
    url: '/product/event/trigger/status',
    method: 'post',
    data
  })
}
