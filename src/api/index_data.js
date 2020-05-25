import request from '@/utils/request'

export function getData(url, params, type = 'post') {
  return request({
    url: url,
    method: type,
    params
  })
}

export function createData(url, data, type = 'patch') {
  return request({
    url: url,
    method: type,
    data
  })
}

export function editData(url) {
  return request({
    url: url,
    method: 'post',
  })
}

export function updateData(url, data, type = 'post') {
  return request({
    url: url,
    method: type,
    data
  })
}
export function deleteData(url, type = 'post') {
  return request({
    url: url,
    method: type
  })
}




