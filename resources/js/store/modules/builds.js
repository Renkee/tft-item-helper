import Axios from 'axios'
import Vue from 'vue'

const state = () => ({
  builds: []
})

const getters = {
  sortedByItemScore(state) {
    let buildsCopy = [...state.builds]
    buildsCopy.sort((a, b) => {
      return b.itemScore - a.itemScore
    })
    return buildsCopy
  },
  findIndexById: state => id => {
    return state.builds.findIndex(build => build.id == id)
  }
}

const actions = {
  calculateItemScores({ state, dispatch, rootState }) {
    for (const build of state.builds) {
      // Clear previous calculation
      dispatch('setItemScore', { id: build.id, value: 0 })

      // Each matching item is worth 1 point
      for (const component in rootState.user.items) {
        if (build.components[component]) {
          // The smallest of the two component counts is equal to the amount of points given
          const newItemScoreValue = build.itemScore + Math.min(build.components[component], rootState.user.items[component])
          dispatch('setItemScore', { id: build.id, value: newItemScoreValue })
        }
      }

      // Each currently buildable completed item is worth 0.5 point

      // Get all completed items in build
      let completedItems = []
      for (const champion of build.champions) {
        if (champion.items !== null) {
          completedItems.push(...champion.items)
        }
      }

      // For each item, check if it can be built by the user's items
      for (const item of completedItems) {
        let neededComponents = rootState.items.componentToCompleted[item.id]
        // If we have at least one of both components required to build the completed item
        if (rootState.user.items[neededComponents[0]] > 0 && rootState.user.items[neededComponents[1]] > 0) {
          dispatch('setItemScore', { id: build.id, value: build.itemScore + 0.5 })
        }
      }
    }
  },
  getInstructionsForEdit(context, { initial, edited }) {
    // The main goal is to do everything client side except for the DB manipulation (which is handled by the API).
    // I think of the initial build as slots (one for each champion).
    // If more slots are needed (more champions in edited build), then add more as needed.
    // If less slots are needed (less champions in edited build), then remove as many as needed.
    // This same idea applies to a champion's items.

    // Instructions "API":
    // { type: 'remove', subject: 'champion', cbid: 'CBID of champions' }
    // { type: 'remove', subject: 'item', cbcid: 'CBCID of item' }
    // { type: 'add', subject: 'champion', index: 'index of new champion', id: 'the new champion id' }
    // { type: 'add', subject: 'item', champion: 'index of champion' index: 'index of new item', id: 'the new item id' }
    // { type: 'change', subject: 'champion', cbid: 'CBID of champion', id: 'the new champion id' }
    // { type: 'change', subject: 'item', cbcid: 'CBCID of item', id: 'the new item id' }
    // { type: 'change', subject: 'name', name: 'the new name' }

    let instructions = []

    const initialBuildLength = initial.champions.length
    const editedBuildLength = edited.champions.length

    const buildLengthDifference = initialBuildLength - editedBuildLength;

    // Add or remove slots if necessary, otherwise skip
    if (buildLengthDifference > 0) {
      // Initial build is bigger, remove as many slots as required
      for (let i = editedBuildLength; i < initialBuildLength; i++) {
        instructions.push({
          type: 'remove',
          subject: 'champion',
          cbid: initial.champions[i].cbid
        })
      }
    } else if (buildLengthDifference < 0) {
      // Edited build is bigger, add as many slots as required
      for (let i = initialBuildLength; i < editedBuildLength; i++) {
        instructions.push({
          type: 'add',
          subject: 'champion',
          index: i,
          id: edited.champions[i].id
        })
      }
    }

    for (let cInd in edited.champions) {
      // Check if this champion slot is new
      if (initial.champions[cInd] === undefined) {
        // Since this is a new champion slot, just add all the items from the edited build
        for (let iInd = 0; iInd < edited.champions[cInd].items.length; iInd++) {
          instructions.push({
            type: 'add',
            subject: 'item',
            champion: cInd,
            index: iInd,
            id: edited.champions[cInd].items[iInd].id
          })
        }
      } else {
        // Since this champion slot already exists, we need to check if item slots match up
        // First add or remove items if necessary
        const initialItemsLength = initial.champions[cInd].items.length
        const editedItemsLength = edited.champions[cInd].items.length
        const itemsLengthDifference = initialItemsLength - editedItemsLength

        if (itemsLengthDifference > 0) {
          // Initial items length bigger
          // Need to remove item slots
          for (let iInd = editedItemsLength; iInd < initialItemsLength; iInd++) {
            instructions.push({
              type: 'remove',
              subject: 'item',
              cbcid: initial.champions[cInd].items[iInd].cbcid
            })
          }
        } else if (itemsLengthDifference < 0) {
          // Edited items length bigger
          // Need to add item slots
          for (let iInd = initialItemsLength; iInd < editedItemsLength; iInd++) {
            instructions.push({
              type: 'add',
              subject: 'item',
              champion: cInd,
              index: iInd,
              id: edited.champions[cInd].items[iInd].id
            })
          }
        }

        // By this point the number of champion and item slots in DB should be equal to the edited build's
        // This means that only 'change' instructions remain to be done

        // If the champion slot doesn't exist in initial, then we have already added it
        if (initial.champions[cInd] !== undefined) {
          // Change champion id if different compared to the initial
          const initChampionId = initial.champions[cInd].id
          const editChampionId = edited.champions[cInd].id
          if (initChampionId !== editChampionId) {
            instructions.push({
              type: 'change',
              subject: 'champion',
              cbid: initial.champions[cInd].cbid,
              id: editChampionId
            })
          }

          // Go through each item in items array and if the item ids are different then create instruction
          for (let iInd = 0; iInd < edited.champions[cInd].items.length; iInd++) {
            // If the item slot doesn't exist in initial, then we have already added it
            if (initial.champions[cInd].items[iInd] !== undefined) {
              // Change item id if different compared to the initial
              const initItemId = initial.champions[cInd].items[iInd].id
              const editItemId = edited.champions[cInd].items[iInd].id

              if (initItemId !== editItemId) {
                instructions.push({
                  type: 'change',
                  subject: 'item',
                  cbcid: initial.champions[cInd].items[iInd].cbcid,
                  id: editItemId
                })
              }
            }
          }
        }
      }
    }

    // Add name 'change' instruction if different compared to the initial
    if (initial.name !== edited.name) {
      instructions.push({
        type: 'change',
        subject: 'name',
        name: edited.name
      })
    }

    return instructions
  },
  async setup({ commit, dispatch }, { data }) {
    let converted = await dispatch('convertDbRows', data)
    commit('setBuilds', converted)
  },
  convertDbRows(context, data) {
    let converted = []
    for (const row of data) {
      // Pre-creating certain objects to avoid code duplication
      // Create item object (if exists)
      let itemForLater = null
      if (row.CompletedId !== null) {
        itemForLater = {
          id: row.CompletedId,
          cbcid: row.ChampionBuildCompletedId,
          order: row.ItemOrder
        }
      }
      // Create champion object
      const championForLater = {
        id: row.ChampionId,
        cbid: row.ChampionBuildId,
        order: row.ChampionOrder,
        items: itemForLater === null ? [] : [itemForLater]
      }

      // Search if build already exists
      const buildIndex = converted.findIndex(build => build.id == row.BuildId)
      if (buildIndex !== -1) {
        // Search if champion already exists
        const championIndex = converted[buildIndex].champions.findIndex(champion => champion.cbid == row.ChampionBuildId)
        if (championIndex !== -1) {
          // Add item
          if (itemForLater !== null) {
            converted[buildIndex].champions[championIndex].items.push(itemForLater)
          }
        } else {
          // Add champion and item (if exists)
          converted[buildIndex].champions.push(championForLater)
        }
      } else {
        // Add build, champion and item (if exists)
        converted.push({
          id: row.BuildId,
          name: row.BuildName,
          components: {},
          itemScore: 0,
          champions: [championForLater]
        })
        // Remember for component counting
        buildIndex = converted.length - 1
      }
      // Count required components for the whole build
      if (row.ComponentIds !== null) {
        let componentsForItem = row.ComponentIds.split(',');
        for (const comp of componentsForItem) {
          if (converted[buildIndex].components[comp] === undefined) {
            converted[buildIndex].components[comp] = 1;
          } else {
            converted[buildIndex].components[comp]++;
          }
        }
      }
    }

    // Sort champions and items based on their order values
    converted.forEach(build => {
      build.champions.sort((c1, c2) => c1.order - c2.order)
      build.champions.forEach(champion => {
        if (champion.items) {
          champion.items.sort((i1, i2) => i1.order - i2.order)
        }
      })
    })
    return converted
  },
  async delete({ rootState, dispatch }, id) {
    try {
      let response = await Axios.delete(`api/builds/${id}`)
      dispatch('notification/add', {
        message: response.data.message,
        color: rootState.notification.color.info
      }, { root: true })

      dispatch('removeBuild', id)
    }
    catch (e) {
      dispatch('notification/add', {
        message: e.response.data.message.errorInfo[2],
        color: rootState.notification.color.error
      }, { root: true })
    }
  },

  /*
    Add build to DB
    If it succeeds, request data and add it to local state
  */
  async add({ rootState, dispatch, commit }, dto) {
    try {
      // Try creating build in DB
      let response = await Axios.post('api/builds/', dto)

      // Get newly created build from DB
      let newBuild = await Axios.get(`api/builds/${response.data.newBuildId}`)

      // Convert new build and add it to state
      let convertedNewBuild = await dispatch('convertDbRows', newBuild.data)
      commit('addBuild', convertedNewBuild[0])

      dispatch('notification/add', {
        message: response.data.message,
        color: rootState.notification.color.info
      }, { root: true })

      return true
    } catch (e) {
      dispatch('notification/add', {
        message: e.response.data.message,
        color: rootState.notification.color.error
      }, { root: true })
      return false
    }
  },
  async edit({ dispatch, commit, rootState }, { id, instructions }) {
    // Send request
    try {
      let response = await Axios.patch(`api/builds/${id}`, { instructions })

      // Get edited build
      let editedBuild = await Axios.get(`api/builds/${id}`)

      // Convert
      let convertedEditedBuild = await dispatch('convertDbRows', editedBuild.data)
      // Update build in state
      commit('replaceBuild', { id, build: convertedEditedBuild[0] })

      dispatch('notification/add', {
        message: response.data.message,
        color: rootState.notification.color.info
      }, { root: true })

      return true
    } catch (e) {
      dispatch('notification/add', {
        message: e.response.data.message,
        color: rootState.notification.color.error
      }, { root: true })
      return false
    }
  },
  setItemScore({ getters, commit }, { id, value }) {
    let index = getters['findIndexById'](id)
    commit('setItemScore', { index, value })
  },
  removeBuild({ getters, commit }, id) {
    let index = getters['findIndexById'](id)
    commit('removeBuild', index)
  }
}

const mutations = {
  setBuilds(state, builds) {
    state.builds = builds
  },
  setItemScore(state, { index, value }) {
    state.builds[index].itemScore = value
  },
  removeBuild(state, index) {
    state.builds.splice(index, 1)
  },
  addBuild(state, build) {
    state.builds.push(build)
  },
  replaceBuild(state, { id, build }) {
    let currentBuildIndex = state.builds.findIndex(b => b.id == id)
    Vue.set(state.builds, currentBuildIndex, build)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}