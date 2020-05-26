import request from '@/utils/request'
import { getToken } from '@/utils/auth' // get token from cookie
export function getColumn(url) {
  return new Promise((resolve, reject) => {
    setRequest(url).then(function(response) {
      localStorage.setItem(url, JSON.stringify(response.data))
      resolve(response.data)
    }).catch(function(error) {
      reject(error)
    })
  })
}

export function localColumn(url) {
  const data = localStorage.getItem(url)
  if (data === 'null' || data === null || data === '' || typeof (data) === 'undefined') {
    return []
  } else {
    return JSON.parse(data)
  }
}

export function saveCustomerColumn(key, columns) {
  localStorage.setItem(key, JSON.stringify(columns))
}
// 获取表格对应的字段
export function getTableColumn(url) {
  return new Promise((resolve, reject) => {
    setRequest(url).then(function(response) {
      resolve(response.data)
    }).catch(function(error) {
      reject(error)
    })
  })
}

function setRequest(url) {
  return request({
    url: url + '?token=' + getToken(),
    method: 'get'
  })
}
