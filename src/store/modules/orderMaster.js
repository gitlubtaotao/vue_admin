const state = {
  receiveClosingUnitId: 0,
  payClosingUnitId: 0
}
const mutations = {
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
