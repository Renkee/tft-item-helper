const state = () => ({
  components: [],
  completed: [],
  componentToCompleted: []
})

const getters = {
  getCompletedById: state => id => {
    return state.completed.find(item => item.id == id)
  },
  getComponentById: state => id => {
    return state.components.find(item => item.id == id)
  }
}

const actions = {
}

const mutations = {
  setComponents(state, { data }) {
    state.components = data
  },
  setCompleted(state, { data }) {
    state.completed = data
  },
  setComponentToCompleted(state, { data }) {
    // convert rows to more usable structure
    let final = {}
    for (let row of data) {
      if (final[row.CompletedId] === undefined) {
        final[row.CompletedId] = [row.ComponentId]
      } else {
        final[row.CompletedId].push(row.ComponentId)
      }
    }
    state.componentToCompleted = final
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}