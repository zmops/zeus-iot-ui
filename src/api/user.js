import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/sys/menu/list',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
// 修改密码
export function changePwd(data) {
  return request({
    url: '/sys/user/changePwd',
    method: 'post',
    data
  })
}
