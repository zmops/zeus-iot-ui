import request from '@/utils/request'

// 告警记录列表
export function getAlarmByPage(data) {
  return request({
    url: '/alarm/getAlarmByPage',
    method: 'post',
    data
  })
}
