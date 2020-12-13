import Vue from 'vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronUp, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faChevronUp, faChevronDown, faTimes)

Vue.component('font-awesome-icon', FontAwesomeIcon)

require('./bootstrap')
window.Vue = require('vue')
Vue.config.devtools = process.env.NODE_ENV !== 'production';


const files = require.context('../', true, /\.vue$/i)
files.keys().map((key) => Vue.component(key.split('/').pop().split('.')[0], files(key).default));



(async () => {
  // Get important data before first load
  const componentsData = await axios.get('api/readonly/components')
  const completedData = await axios.get('api/readonly/completed')
  const componentToCompletedData = await axios.get('api/readonly/components_to_completed')
  const championsData = await axios.get('api/readonly/champions')

  const buildsData = await axios.get('api/builds')

  new Vue({
    el: '#app',
    router,
    beforeCreate() {
      // Load in and transform data
      store.commit('items/setComponents', componentsData)
      store.commit('items/setCompleted', completedData)
      store.commit('items/setComponentToCompleted', componentToCompletedData)
      store.commit('champions/set', championsData)
      store.dispatch('user/setupItems')
      store.dispatch('builds/setup', buildsData)
    },
    store
  })
})();
