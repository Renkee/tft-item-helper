<template>
  <div class="build-container">
    <div class="build-title-container">
      <h3>{{build.name}}</h3>
    </div>
    <div class="build-content-container">
      <div class="build-champion-container">
        <div
          v-for="champion in build.champions"
          :key="champion.cbid"
          class="build-champion"
          :style="`background-color: #${getChampionById(champion.id).color}`"
        >
          <Champion
            class="build-champion-image"
            :id="champion.id"
          />
          <div
            v-if="champion.items.length > 0"
            class="build-champion-item-container"
          >
            <CompletedItem
              v-for="(item, itemIndex) in champion.items"
              :key="itemIndex"
              class="build-champion-item-image"
              half-size
              :id="item.id"
            />
          </div>
        </div>
      </div>
      <!--<div
        v-if="Object.values(build.components).find(x => x > 0)"
        class="required-component-container"
      >
        <h4 >Required components:</h4>
        <ComponentDisplay :componentList="build.components" :imgSize="35" :gapSize="1"/>
      </div>
      <div v-else class="required-component-container">
        <h4 >No components required</h4>
      </div>-->
      <div class="build-content-buttons">
        <button :class="`components-for-build-id-${build.id}`">Components</button>
        <button @click="editBuild">Edit</button>
        <button class="delete-button" @click="deleteBuild">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentDisplay from './ComponentDisplay'
import Champion from './Champion'
import CompletedItem from './CompletedItem'
export default {
  props: {
    build: {
      required: true,
      type: Object
    }
  },
  components: {
    ComponentDisplay,
    Champion,
    CompletedItem
  },
  computed: {
    champions() {
      return this.$store.state.champions.champions
    },
    completed() {
      return this.$store.state.items.completed
    }
  },
  methods: {
    deleteBuild() {
      this.$store.commit('modals/setDeleteConfirmAction', () => {
        this.$store.dispatch('builds/delete', this.build.id)
      })
      this.$store.commit('modals/setDeleteConfirmEnabled', true)
    },
    editBuild() {
      // Create copies of the build being edited
      this.$store.commit('modals/setEditBuildInitial', _.cloneDeep(this.build))
      this.$store.commit('modals/setEditBuildEdited', _.cloneDeep(this.build))

      this.$store.commit('modals/setEditBuildEnabled', true)
    },
    getChampionById(id) {
      return this.$store.getters['champions/getById'](id)
    },
    getCompletedById(id) {
      return this.$store.getters['items/getCompletedById'](id)
    }
  }
}
</script>

<style lang="scss" scoped>
.build-container {
  margin-bottom: 24px;
  border: 4px solid #ff00ff;
  display: table;
  h4 {
    margin-bottom: 2px;
  }
}
.build-title-container {
  background-color: #ff00ff;
  padding: 10px;
  line-height: 0.75;
  color: white;
  h3 {
    padding: 2.5px 0 2.5px 0;
  }
}
.build-content-container {
  padding: 6px;
}
.build-champion-container {
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
}
.build-champion {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  line-height: 0;
  font-size: 0;
}
.build-champion-image {
  width: 84px;
  height: 84px;
  display: inline-block;
}
.build-champion-item-container {
  font-size: 0;
  line-height: 0;
  white-space: nowrap;
  padding: 0 2px 4px 4px;
}
.build-champion-item-image {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 2px;
}
.required-component-container {
  padding: 8px 0 8px 0;
  h4 {
    font-weight: 600;
  }
}
.build-content-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  button {
    margin-right: 4px;
    &:first-child {
      margin-right: auto;
      cursor: unset;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}

</style>