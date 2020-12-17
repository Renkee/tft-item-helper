<template>
  <ModalElementWithTitle :title="'Champions'">
    <DraggableWithTrash>
      <draggable
        v-model="champions"
        :clone="cloneChampionIdAndPrepareForItems"
        :group="{name: 'champion', pull: 'clone', put: false}"
        :sort="false"
        @start="$store.commit('draggable/setCurrentlyDragging', true)"
        @end="$store.commit('draggable/setCurrentlyDragging', false)"
      >
        <Champion v-for="champion in champions" :key="champion.id" class="draggable-champion" :id="champion.id" />
      </draggable>
    </DraggableWithTrash>
  </ModalElementWithTitle>
</template>

<script>
import draggable from 'vuedraggable'
import DraggableWithTrash from './DraggableWithTrash'
import ModalElementWithTitle from './NewBuildModalElementWithTitle'
import Champion from './Champion'

export default {
  components: {
    draggable,
    DraggableWithTrash,
    ModalElementWithTitle,
    Champion
  },
  computed: {
    champions: {
      get() {
          return this.$store.getters['champions/sortedByPrice']
      },
      set(value) {
          this.$store.commit('champions/set', {data: value})
      }
    }
  },
  methods: {
    cloneChampionIdAndPrepareForItems(championObj) {
      return {
        items: [],
        id: championObj.id
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.draggable-champion {
  display: inline-block;
}
// DESKTOP
@media only screen and (min-width: 631px) {
.draggable-champion {
  margin: 2px;
  width: 75px;
  height: 75px;
}
}
// MOBILE
@media only screen and (max-width: 630px) {
.draggable-champion {
  margin: 1px;
  width: 64px;
  height: 64px;
}
}
</style>