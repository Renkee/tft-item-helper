<template>
  <Modal :enabled="$store.state.modals.createNewBuild.enabled">
    <template v-slot:title>New build creation</template>
    <template v-slot:body>
      <div id="new-build-modal-body">
        <DraggableCompletedItems class="draggable-area" id="item-area" />
        <DraggableChampions class="draggable-area" id="champion-area" />
        <DraggableBuildShowcase
          @change-champ="updateChampionsInNewBuild"
          @change-item="updateChampionsInNewBuild"
          class="draggable-area"
          id="showcase-area"
        />
      </div>
    </template>
    <template v-slot:buttons>
      <div id="build-name-container">
        <label for="title">Build name</label>
        <input v-model="buildName" size="1" type="text" name="title"/>
      </div>
      <button @click="submit">Create</button>
      <button class="delete-button" @click="close">Cancel</button>
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal'
import DraggableCompletedItems from './DraggableCompletedItems'
import DraggableChampions from './DraggableChampions'
import DraggableBuildShowcase from './DraggableBuildShowcase'

export default {
  components: {
    Modal,
    DraggableCompletedItems,
    DraggableChampions,
    DraggableBuildShowcase
  },
  computed: {
    buildName: {
      get() {
        return this.$store.state.modals.createNewBuild.buildName
      },
      set(value) {
        this.$store.commit('modals/setCreateNewBuildBuildName', value)
      }
    },
    build: {
      get() {
        return this.$store.state.modals.createNewBuild.newBuild
      },
      set(value) {
        this.$store.commit('modals/setCreateNewBuildNewBuild', value)
      }
    }
  },
  methods: {
    updateChampionsInNewBuild(champions) {
      this.$store.commit('modals/setCreateNewBuildNewBuild', champions)
    },
    close() {
      this.$store.commit('modals/setCreateNewBuildEnabled', false)
    },
    submit() {
      this.$store.dispatch('modals/submitCreateNewBuild')
    }
  }
}
</script>

<style lang="scss" scoped>
.draggable-area {
  background-color: #fafafa;
  border: 4px solid #ff00ff;
  line-height: 0;
  user-select: none;
}
#build-name-container {
  flex: 1;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  padding: 8px;
  max-width: 225px;
  max-height: 36px;
  color: white;
  background-color: #ff00ff;
  label {
    font-weight: 600;
    margin-right: 10px;
  }
  input {
    flex: 1;
    height: 20px;
  }
}
#new-build-modal-body {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: minmax(0, 1fr) 200px;
  max-height: 100%;
  gap: 15px 15px;
  grid-template-areas:
    "champion-area item-area"
    "showcase-area showcase-area";
}
#champion-area {
  grid-area: champion-area;
}
#item-area {
  grid-area: item-area;
}
#showcase-area {
  grid-area: showcase-area;
}
</style>