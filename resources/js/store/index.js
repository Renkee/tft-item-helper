import Vue from 'vue'
import Vuex from 'vuex'
import builds from './modules/builds'
import items from './modules/items'
import champions from './modules/champions'
import user from './modules/user'
import modals from './modules/modals'
import draggable from './modules/draggable'
import notification from './modules/notification'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    builds,
    items,
    champions,
    user,
    modals,
    draggable,
    notification
  }
})