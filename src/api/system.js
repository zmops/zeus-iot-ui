import request from '@/utils/request'

// 用户列表
export function getUserList(data) {
  return request({
    url: '/sys/user/getUserByPage',
    method: 'post',
    data
  })
}

// 用户列表-不分页
export function getUserList2(data) {
  return request({
    url: '/sys/user/list',
    method: 'post',
    data
  })
}

// 用户新增
export function createUser(data) {
  return request({
    url: '/sys/user/create',
    method: 'post',
    data
  })
}

// 用户删除
export function deleteUser(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data
  })
}

// 用户修改
export function updateUser(data) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data
  })
}

// 用户重置密码
export function resetPass(params) {
  return request(({
    url: '/sys/user/reset',
    method: 'get',
    params
  }))
}

// 用户组列表
export function getUsrGrpByPage(data) {
  return request({
    url: '/sys/userGroup/getUsrGrpByPage',
    method: 'post',
    data
  })
}

// 用户组列表
export function getUsrGrpList() {
  return request({
    url: '/sys/userGroup/list',
    method: 'post'
  })
}

// 用户组新增
export function createUserGroup(data) {
  return request({
    url: '/sys/userGroup/create',
    method: 'post',
    data
  })
}

// 用户组修改
export function updateUserGroup(data) {
  return request({
    url: '/sys/userGroup/update',
    method: 'post',
    data
  })
}

// 用户组删除
export function deleteUserGroup(data) {
  return request({
    url: '/sys/userGroup/delete',
    method: 'post',
    data
  })
}

// 角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params
  })
}

// 角色新增
export function createRole(data) {
  return request({
    url: '/sys/role/create',
    method: 'post',
    data
  })
}

// 角色修改
export function updateRole(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data
  })
}

// 角色删除
export function deleteRole(data) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data
  })
}

// 角色已绑定菜单
export function roleBoundMenu(params) {
  return request({
    url: '/sys/role/bindedMenu',
    method: 'get',
    params
  })
}

// 绑定菜单
export function roleBindMenu(data) {
  return request({
    url: '/sys/role/bindMenu',
    method: 'post',
    data
  })
}

// 字典类型-列表
export function getDictTypeByPage(data) {
  return request({
    url: '/dictType/getDictTypeByPage',
    method: 'post',
    data
  })
}

// 字典类型-新增
export function createDictType(data) {
  return request({
    url: '/dictType/create',
    method: 'post',
    data
  })
}

// 字典类型-修改
export function updateDictType(data) {
  return request({
    url: '/dictType/update',
    method: 'post',
    data
  })
}

// 字典类型-删除
export function deleteDictType(data) {
  return request({
    url: '/dictType/delete',
    method: 'post',
    data
  })
}

// 字典项-列表-dictTypeId
export function getDictList(params) {
  return request({
    url: '/dict/listDicts',
    method: 'get',
    params
  })
}

// 字典项-列表-Code
export function getDictListByCode(params) {
  return request({
    url: '/dict/listDictByCode',
    method: 'get',
    params
  })
}

// 字典项-列表-分组
export function groupDictByCode(params) {
  return request({
    url: '/dict/groupDictByCode',
    method: 'get',
    params
  })
}

// 字典项-新增
export function createDict(data) {
  return request({
    url: '/dict/create',
    method: 'post',
    data
  })
}

// 字典项-修改
export function updateDict(data) {
  return request({
    url: '/dict/update',
    method: 'post',
    data
  })
}

// 字典项-删除
export function deleteDict(data) {
  return request({
    url: '/dict/delete',
    method: 'post',
    data
  })
}

// 系统参数-查询
export function getParamList() {
  return request({
    url: '/sys/param/list',
    method: 'get'
  })
}

// 系统参数-修改
export function updateParam(data) {
  return request({
    url: '/sys/param/update',
    method: 'post',
    data
  })
}

// 通知方式-查询
export function getMediaTypeList() {
  return request({
    url: '/media/type/list',
    method: 'get'
  })
}

// 通知方式-修改
export function updateMediaType(data) {
  return request({
    url: '/media/type/update',
    method: 'post',
    data
  })
}
