import request from '@/utils/request'
import { deleteData } from '@/api/index_data'

export function transportTypeOptions() {
  return [
    { label: '整箱', value: 1 },
    { label: '拼箱', value: 4 },
    { label: '空运', value: 2 },
    { label: '快递', value: 5 },
    { label: '其他', value: 3 }
  ]
}

// 更改订单状态
export function changeOrderStatus(order_master_id, status) {
  return request({
    url: '/order/masters/' + order_master_id + '/changeStatus?status=' + status,
    method: 'patch'
  })
}

export function deleteOrder(order_master_id) {
  return new Promise((resolve, reject) => {
    deleteData('/order/masters/' + order_master_id + '/delete').then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
