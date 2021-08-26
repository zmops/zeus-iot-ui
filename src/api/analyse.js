import request from '@/utils/request'

// 最新数据列表
export function getLatestList(data) {
  return request({
    url: '/latest/query',
    method: 'post',
    data
  })
}
