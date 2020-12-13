const state = () => ({
  currentlyDragging: false
})

const getters = {
}

const actions = {}

const mutations = {
  setCurrentlyDragging(state, value) {
    state.currentlyDragging = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}