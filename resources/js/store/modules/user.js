import Vue from 'vue'

const state = () => ({
  items: {}
})

const getters = {
}

const actions = {
  setupItems({ commit, rootState }) {
    for (const component of rootState.items.components) {
      commit('setItemsKeyValuePair', { key: component.id, value: 0 })
    }
  },
  addItem({ state, commit, dispatch }, id) {
    commit('changeUserItem', { id, value: state.items[id] + 1 })

    // Recalculate build order
    dispatch('builds/calculateItemScores', {}, { root: true })
  },
  removeItem({ state, commit, dispatch }, id) {
    if (state.items[id] > 0) {
      commit('changeUserItem', { id, value: state.items[id] - 1 })
    }

    // Recalculate build order
    dispatch('builds/calculateItemScores', {}, { root: true })
  },
  clearAllItems({ state, commit, dispatch }) {
    for (const id in state.items) {
      commit('changeUserItem', { id, value: 0 })
    }

    // Recalculate build order
    dispatch('builds/calculateItemScores', {}, { root: true })
  }
}

const mutations = {
  setItemsKeyValuePair(state, { key, value }) {
    Vue.set(state.items, key, value)
  },
  changeUserItem(state, { id, value }) {
    state.items[id] = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}