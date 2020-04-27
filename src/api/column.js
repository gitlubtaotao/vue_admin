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
  if (data === null || data === '' || typeof (data) === 'undefined'){
    return []
  } else {
    return JSON.parse(data)
  }
}



function setRequest(url) {
  return request({
    url: url + '?token=' + getToken(),
    method: 'get'
  })
}
// eslint-disable-next-line no-unused-vars




