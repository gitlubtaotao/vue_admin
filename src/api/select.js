// 获取下拉数据
import request from '@/utils/request'
export function getSelectApi(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function remoteCompany(query = '', scope = { company_type: 4 }) {
  let url = '/select/companies'
  if (query !== '') {
    url += '?name=' + query
  }
  return new Promise(function (resolve, reject) {
    getSelectApi(url, {
      table_name: 'user_companies',
      scope: scope
    }).then((response) => {
      resolve(response.data)
    })
  })
}
export function remoteEmployee() {

}

