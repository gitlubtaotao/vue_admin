// 获取下拉数据
import request from '@/utils/request'

export function getSelectApi(url, data = {}, type = 'post') {
  return request({
    url: url,
    method: type,
    data
  })
}

export function remoteCompany(query = '', scope = { company_type: 4 }) {
  let url = '/select/companies'
  if (query !== '') {
    url += '?name=' + query
  }
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
      table_name: 'user_companies',
      scope: scope
    }).then((response) => {
      resolve(response.data)
    }).catch(reason => {
      console.log(reason)
      reject(reason)
    })
  })
}

export function remoteEmployee(query = '', scope = {}) {
  scope['company_type'] = 4
  let url = '/select/base'
  if (query !== '') {
    url += '?name=' + query
  }
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
      table_name: 'users',
      select_keys: [],
      scope: scope
    }).then((response) => {
      resolve(response.data)
    })
  })
}
export function remoteContact(query = '', scope = {}) {
  scope['company_type'] = [1, 2, 3]
  let url = '/select/base'
  if (query !== '') {
    url += '?name=' + query
  }
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
      table_name: 'users',
      select_keys: [],
      scope: scope
    }).then((response) => {
      resolve(response.data)
    })
  })
}

export function getWarehouseAddress(query) {
  let url = '/select/warehouse'
  if (query !== '') {
    url += '?name=' + query
  }
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
    }, 'get').then((response) => {
      resolve(response.data)
    }).catch(reason => {
      reject(reason)
    })
  })
}

// 获取订单数据
export function remoteOrderMaster(query) {
  let url = '/select/orderMaster'
  if (query !== '') {
    url += '?serial_number=' + query
  }
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
    }, 'get').then((response) => {
      resolve(response.data)
    }).catch(reason => {
      reject(reason)
    })
  })
}

// 获取基础代码数据

export function remoteBaseCode() {
  const url = '/select/baseCode'
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
    }, 'get').then((response) => {
      resolve(response.data)
    }).catch(reason => {
      reject(reason)
    })
  })
}

export function remoteBaseCarrier() {
  const url = '/select/baseCarrier'
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
    }, 'get').then((response) => {
      resolve(response.data)
    }).catch(reason => {
      reject(reason)
    })
  })
}

// 获取港口信息
export function remoteBasePort() {
  const url = '/select/basePort'
  return new Promise(function(resolve, reject) {
    getSelectApi(url, {
    }, 'get').then((response) => {
      resolve(response.data)
    }).catch(reason => {
      reject(reason)
    })
  })
}

