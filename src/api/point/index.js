import request from '@/utils/request'

export function search(query) {
  return request({
    url: '/system/lushu/points/search?ELat=26.436428354&ELng=106.6681358&SLat=26.436428354&SLng=106.6681358&keyword=%E8%8A%B1%E6%BA%AA&range=50',
    // url: '/system/lushu/points/search?keyword=花溪',
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
