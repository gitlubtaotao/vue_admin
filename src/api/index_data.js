import request from '@/utils/request'
export function getData(url,params, type = 'post') {
  return request({
    url: url,
    method: type,
    params
  })
}

export function createData(url, data, type = 'post') {
  return request({
    url: url,
    method: type,
    data
  })
}




