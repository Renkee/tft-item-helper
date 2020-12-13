<template>
  <ModalElementWithTitle :title="'Build'">
    <draggable
      v-model="innerBuild"
      :group="{name: 'champion'}"
      ghost-class="draggable-build-showcase-ghost"
      :swap-threshold="0.5"
      animation="200"
      class="showcase-container"
      @start="$store.commit('draggable/setCurrentlyDragging', true)"
      @end="$store.commit('draggable/setCurrentlyDragging', false)"
      @change="sortAndUpdateChampionsForParent"
    >
      <div
        v-for="(champ, cIndex) in innerBuild"
        :key="cIndex"
        class="showcase"
      >
        <div>
          <Champion
            :ref="`draggable-bs-${cIndex}`"
            class="showcase-champion"
            :id="champ.id"
          />
          <div
            :style="`background-color: #${getChampionById(champ.id).color}`"
            class="showcase-item-container"
          >
            <draggable
              v-model="champ.items"
              :group="{name: 'item', put: isItemAddable}"
              ghost-class="showcase-item-image-ghost"
              animation="200"
              class="showcase-items"
              @start="$store.commit('draggable/setCurrentlyDragging', true)"
              @end="$store.commit('draggable/setCurrentlyDragging', false)"
              @change="updateItemsForParent"
            >
              <CompletedItem
                v-for="(item, itemIndex) in champ.items"
                :key="itemIndex"
                class="showcase-item-image"
                half-size
                :id="item.id"
              />
            </draggable>
          </div>
        </div>
      </div>
    </draggable>
  </ModalElementWithTitle>
</template>

<script>
import draggable from 'vuedraggable'
import ModalElementWithTitle from './NewBuildModalElementWithTitle'
import Champion from './Champion'
import CompletedItem from './CompletedItem'

export default {
  props: {
    initialBuild: {
      required: false,
      type: Array
    }
  },
  components: {
    draggable,
    ModalElementWithTitle,
    Champion,
    CompletedItem
  },
  data: () => ({
    innerBuild: []
  }),
  methods: {
    sortAndUpdateChampionsForParent(e) {
      // Sort the build based on price
      this.innerBuild = this.innerBuild.sort((c1, c2) => {
        return this.getChampionById(c1.id).price - this.getChampionById(c2.id).price
      })

      // Crude fix for a bug where 'hovered' state doesn't update on Firefox when moving champions in build
      if (e.moved) {
        const oldChampionLocation = this.$refs[`draggable-bs-${e.moved.oldIndex}`]
        if (oldChampionLocation && oldChampionLocation.length > 0) {
          oldChampionLocation[0].hovered = false
        }
      }

      // Emit change event to update state in parent
      this.$emit('change-champ', this.innerBuild)
    },
    updateItemsForParent(el) {
      this.$emit('change-item', this.innerBuild)
    },
    isItemAddable(to, from) {
      return to.el.children.length < 3 && from.options.group.name === 'item'
    },
    getChampionById(id) {
      return this.$store.getters['champions/getById'](id)
    },
    getCompletedById(id) {
      return this.$store.getters['items/getCompletedById'](id)
    }
  },
  created() {
    if(this.initialBuild && this.initialBuild.length > 0) {
      // Copy
      this.innerBuild = [ ...this.initialBuild ]
    }
  }
}
</script>

<style lang="scss">
.showcase-container {
  width: 100%;
  height: 100%;
}
.showcase {
  margin: 0 4px 4px 0 !important;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.draggable-build-showcase-ghost {
  margin: 0 4px 4px 0 !important;
  padding-bottom: 28px !important;
  width: 84px !important;
  height: 84px !important;
}
.showcase-champion {
  width: 84px;
  height: 84px;
  display: inline-block;
}
.showcase-item-container {
  font-size: 0;
  line-height: 0;
  white-space: nowrap;
  padding: 0 2px 4px 4px;
  min-height: 24px;
  display: flex;
}
.showcase-items {
  flex: 1;
}
.showcase-item-image {
  width: 24px;
  height: 24px;
  margin-right: 2px;
}
.showcase-item-image-ghost {
  margin: 0 2px 0 0 !important;
  width: 24px !important;
  height: 24px !important;
}
</style>