const state = () => ({
  createNewBuild: {
    enabled: false,
    newBuild: [],
    buildName: ""
  },
  editBuild: {
    enabled: false,
    initial: {},
    edited: {}
  },
  deleteConfirm: {
    enabled: false,
    action: () => { }
  }
})

const getters = {
  anyEnabled(state) {
    return Object.values(state)
      .map(modal => modal.enabled)
      .findIndex(b => b === true) !== -1
  }
}

const actions = {
  async submitCreateNewBuild({ commit, state, dispatch, rootState }) {
    // Validate input
    let exitAfterValidation = false
    if (state.createNewBuild.newBuild.length === 0) {
      dispatch('notification/add', {
        message: "You need at least one champion in your build",
        color: rootState.notification.color.error
      }, { root: true })
      exitAfterValidation = true
    }
    if (state.createNewBuild.buildName.trim() === "") {
      dispatch('notification/add', {
        message: "You need to name your build",
        color: rootState.notification.color.error
      }, { root: true })
      exitAfterValidation = true
    }
    if (exitAfterValidation) return


    // For this process we only need the champion and item IDs so get rid everything else
    let dto = {
      name: state.createNewBuild.buildName,
      build: []
    };
    for (let champion of state.createNewBuild.newBuild) {
      dto.build.push({ id: champion.id, items: [] })
      for (let item of champion.items) {
        dto.build[dto.build.length - 1].items.push(item.id)
      }
    }
    const success = await dispatch('builds/add', dto, { root: true })
    if (success) {
      commit('setCreateNewBuildEnabled', false)
      commit('setCreateNewBuildBuildName', '')
    }
  },
  async submitEditBuild({ dispatch, state, rootState, commit }) {
    const instructions = await dispatch('builds/getInstructionsForEdit', { initial: state.editBuild.initial, edited: state.editBuild.edited }, { root: true })

    // Check if there are edits
    if (instructions.length === 0) {
      dispatch('notification/add', {
        message: "No changes found",
        color: rootState.notification.color.error
      }, { root: true })
    } else {
      let dto = {
        id: state.editBuild.edited.id,
        instructions
      }

      const success = await dispatch('builds/edit', dto, { root: true })

      if (success) {
        commit('setEditBuildEnabled', false)
      }
    }
  }
}

const mutations = {
  setCreateNewBuildEnabled(state, value) {
    state.createNewBuild.enabled = value
  },
  setCreateNewBuildNewBuild(state, value) {
    state.createNewBuild.newBuild = value
  },
  setCreateNewBuildBuildName(state, value) {
    state.createNewBuild.buildName = value
  },
  setEditBuildEnabled(state, value) {
    state.editBuild.enabled = value
  },
  setEditBuildInitial(state, value) {
    state.editBuild.initial = value
  },
  setEditBuildEdited(state, value) {
    state.editBuild.edited = value
  },
  setEditBuildEditedProperty(state, { prop, value }) {
    state.editBuild.edited[prop] = value
  },
  setDeleteConfirmEnabled(state, value) {
    state.deleteConfirm.enabled = value
  },
  setDeleteConfirmAction(state, value) {
    state.deleteConfirm.action = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}