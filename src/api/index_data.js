import request from '@/utils/request'
import { getToken } from '@/utils/auth' // get token from cookie
export function getData(url,params, type = 'post') {
  return request({
    url: url + '?token=' + getToken(),
    method: type,
    params
  })
}




