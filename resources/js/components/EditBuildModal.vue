<template>
  <Modal :enabled="$store.state.modals.editBuild.enabled">
    <template v-slot:title>Editing build "{{ $store.state.modals.editBuild.initial.name }}"</template>
    <template v-slot:body>
      <div id="edit-build-modal-body">
        <DraggableCompletedItems class="draggable-area" id="item-area" />
        <DraggableChampions class="draggable-area" id="champion-area" />
        <DraggableBuildShowcase
          :initial-build="$store.state.modals.editBuild.edited.champions"
          class="draggable-area"
          id="showcase-area"
          @change-champ="updateChampionsInEditedBuild"
          @change-item="updateChampionsInEditedBuild"
        />
      </div>
    </template>
    <template v-slot:buttons>
      <div id="build-name-container">
        <label for="title">Build name</label>
        <input v-model="buildName" type="text" name="title"/>
      </div>
      <button @click="submit">Confirm</button>
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
        return this.$store.state.modals.editBuild.edited.name
      },
      set(value) {
        this.$store.commit('modals/setEditBuildEditedProperty', { prop: 'name', value })
      }
    }
  },
  methods: {
    updateChampionsInEditedBuild(champions) {
      this.$store.commit('modals/setEditBuildEditedProperty', { prop: 'champions', value: champions })
    },
    close() {
      this.$store.commit('modals/setEditBuildEnabled', false)
    },
    submit() {
      this.$store.dispatch('modals/submitEditBuild')
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
  display: inline-block;
  padding: 8px;
  max-height: 36px;
  color: white;
  background-color: #ff00ff;
  label {
    font-weight: 600;
    margin-right: 10px;
  }
  input {
    height: 20px;
  }
}
#edit-build-modal-body {
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