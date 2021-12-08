import request from '@/utils/request'
/* 查询地点详情 */
export function getLocationDetail(data) {
  return request({
    url: '/location/getLocationDetail',
    method: 'post',
    data
  });
}

/* 查询地点告警详情 */
export function LinkedMo(params) {
  return request({
    url: '/mo/LinkedMo',
    method: 'get',
    params
  })
}
