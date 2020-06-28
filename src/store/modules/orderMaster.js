const state = {
  receiveClosingUnitId: 0,
  payClosingUnitId: 0,
  systemFinanceApprove: 'false',
  systemFinanceAudit: 'false'
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
