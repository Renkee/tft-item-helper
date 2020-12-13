const state = () => ({
  queue: [],
  timer: {},
  length: 5,
  step: 1,
  time: 0,
  color: {
    info: 'ff00ff',
    error: 'ff0000'
  }
})

const getters = {
  current(state) {
    return state.queue.length > 0 ? state.queue[0] : null
  },
  queue(state) {
    return state.queue
  }
}

const actions = {
  add({ state, commit, dispatch }, notification) {
    if (state.queue.length === 0) {
      dispatch('resetTimer')
    }
    commit('add', notification)
  },
  resetTimer({ state, commit, dispatch }) {
    commit('clear')
    commit('reset')
    state.timer = setInterval(() => {
      if (state.queue.length === 0) {
        clearInterval(state.timer)
      } else if (state.time === 1) {
        dispatch('remove')
      } else {
        commit('tick')
      }
    }, state.step * 1000)
  },
  remove({ commit }) {
    commit('remove')
    commit('reset')
  }
}

const mutations = {
  add(state, notification) {
    state.queue.push(notification)
  },
  remove(state) {
    state.queue.shift()
  },
  reset(state) {
    state.time = state.length
  },
  clear(state) {
    clearInterval(state.timer)
  },
  tick(state) {
    state.time -= state.step
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}