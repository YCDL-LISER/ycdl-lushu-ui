import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/system/lushu/routes/search',
    method: 'get',
    params: query
  })
}

export function loadRoute(id) {
  return request({
    url: '/system/lushu/routes/details/' + id,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/lushu/api/images/' + id,
    method: 'get'
  })
}
