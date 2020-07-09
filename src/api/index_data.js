import request from '@/utils/request'

export function getData(url, params, type = 'post', data = {}) {
  return request({
    url: url,
    method: type,
    params,
    data
  })
}

export function createData(url, data, type = 'post') {
  return request({
    url: url,
    method: type,
    data
  })
}

export function editData(url, type = 'post') {
  return request({
    url: url,
    method: type
  })
}

export function updateData(url, data, type = 'post') {
  return request({
    url: url,
    method: type,
    data
  })
}
export function deleteData(url, type = 'delete') {
  return request({
    url: url,
    method: type
  })
}

