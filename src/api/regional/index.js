import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/easy/lushu/regional',
    method: 'get',
    params: query
  })
}

export function loadRoute() {
  return request({
    url: '/system/lushu/routes/details/3355370391714406425',
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/lushu/api/images/' + id,
    method: 'get'
  })
}
