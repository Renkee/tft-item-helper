const state = () => ({
  champions: []
})

const getters = {
  getById: state => id => {
    return state.champions.find(c => c.id == id)
  },
  sortedByPrice(state) {
    return state.champions.sort((c1, c2) => c1.price - c2.price)
  }
}

const actions = {
}

const mutations = {
  set(state, { data }) {
    state.champions = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}