import { changeOrderStatus } from '@/api/order_master'
const state = {
  receiveClosingUnitId: 0,
  payClosingUnitId: 0,
  systemFinanceApprove: 'false',
  systemFinanceAudit: 'false',
  orderMasterStatus: 'processing'
}
const mutations = {
  SYSTEM_FINANCE_APPROVE: (state, status) => {
    state.systemFinanceApprove = status
  },
  SYSTEM_FINANCE_AUDIT: (state, status) => {
    state.systemFinanceAudit = status
  },
  CHANGE_RECEIVE_CLOSING: (state, id) => {
    state.receiveClosingUnitId = id
  },
  CHANGE_PAY_CLOSING: (state, id) => {
    state.payClosingUnitId = id
  },
  CHANGE_ORDER_MASTER_STATUS: (state, status) => {
    state.orderMasterStatus = status
  }
}
const actions = {
  setReceiveClosingUnit({ commit }, id) {
    commit('CHANGE_RECEIVE_CLOSING', id)
  },
  setPayClosingUnit({ commit }, id) {
    commit('CHANGE_PAY_CLOSING', id)
  },
  setFinanceApprove({ commit }, status) {
    commit('SYSTEM_FINANCE_APPROVE', status)
  },
  setFinanceAudit({ commit }, status) {
    commit('SYSTEM_FINANCE_AUDIT', status)
  },
  setOrderMasterStatus({ commit }, status) {
    commit('CHANGE_ORDER_MASTER_STATUS', status)
  },
  setOrderMasterLocked({ commit }, order_master_id) {
    const status = 'locked'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setOrderMasterUnlocked({ commit }, order_master_id) {
    const status = 'processing'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setOrderMasterCancel({ commit }, order_master_id) {
    const status = 'cancel'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setOrderMasterFinished({ commit }, order_master_id) {
    const status = 'finished'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setOrderMasterRollback({ commit }, order_master_id) {
    const status = 'processing'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setOrderMasterTakeOrder({ commit }, order_master_id) {
    const status = 'processing'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setOrderMasterAudit({ commit }, order_master_id) {
    const status = 'unprocessed'
    return new Promise((resolve, reject) => {
      changeOrderStatus(order_master_id, status).then(response => {
        const { data } = response
        commit('CHANGE_ORDER_MASTER_STATUS', status)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
