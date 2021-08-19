import request from '@/utils/request'

// 操作日志
export function getLogList(params) {
  return request({
    url: '/log/getOperationLogByPage',
    method: 'get',
    params
  })
}

// 登录日志
export function getLoginLogList(params) {
  return request({
    url: '/loginLog/getLoginLogByPage',
    method: 'get',
    params
  })
}
