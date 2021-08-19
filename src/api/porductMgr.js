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
    url: '/product/prodTag/list',
    method: 'get',
    params
  })
}

// 更新产品标签
export function updateTag(data) {
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
    url: '/product/valuemap/update',
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
