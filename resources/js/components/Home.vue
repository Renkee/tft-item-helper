<template>
  <div id="container">
    <div id="title-container">
      <h1>TFT Item Helper</h1>
    </div>
    <div id="user-item">
      <div id="user-item-title" class="h2-title">
        <h2>Pick your items</h2>
        <button @click="$store.dispatch('user/clearAllItems')">Clear</button>
      </div>
      <ComponentPicker />
      <ComponentDisplay id="user-item-component-display" :componentList="userItems" backgroundColor="#f3ebf3" />
    </div>
    <div id="build-display">
      <div id="build-display-title" class="h2-title">
        <h2>Recommended builds</h2>
        <button @click="$store.commit('modals/setCreateNewBuildEnabled', true)">Add new</button>
      </div>
      <div id="build-container">
        <div v-if="buildsSortedByItemScore.length > 0">
          <BuildDisplay v-for="build in buildsSortedByItemScore" :key="build.name" :build="build"/>
        </div>
        <div v-else>
          <h3>No builds found. Maybe you could add some?</h3>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <NewBuildModal />
    <EditBuildModal />
    <DeleteConfirmModal />
    <Notification />
    <Tooltip />
  </div>
</template>

<script>
import axios from 'axios'
import ComponentPicker from './ComponentPicker'
import ComponentDisplay from './ComponentDisplay'
import BuildDisplay from './BuildDisplay'
import NewBuildModal from './NewBuildModal'
import EditBuildModal from './EditBuildModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import Notification from './Notification'
import Tooltip from './Tooltip'


export default {
  components: {
    ComponentPicker,
    ComponentDisplay,
    BuildDisplay,
    NewBuildModal,
    EditBuildModal,
    DeleteConfirmModal,
    Notification,
    Tooltip
  },
  data: () => ({
    createBuildModalEnabled: false
  }),
  computed: {
    userItems() {
      return this.$store.state.user.items
    },
    buildsSortedByItemScore() {
      return this.$store.getters['builds/sortedByItemScore']
    },
  },
  methods: {
    testNotification() {
      this.$store.dispatch('notification/add', {
        message: "Testing...",
        color: this.$store.state.notification.color.info
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 15px;
  max-width: 1200px;
  margin: 0 auto;
}
#title-container {
  display: inline-block;
  color: white;
  padding: 10px;
  background-color: #ff00ff;
}
#user-item {
  margin-bottom: 32px;
  margin-top: 32px;
}
#user-item-component-display {
  margin-top: 12px
}

.h2-title {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
}
</style>