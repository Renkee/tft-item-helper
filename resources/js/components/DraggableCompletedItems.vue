<template>
  <ModalElementWithTitle :title="'Items'">
      <DraggableWithTrash>
      <draggable
        v-model="completed"
        :clone="cloneItemId"
        :group="{name: 'item', pull: 'clone', put: false}"
        :sort="false"
        @start="$store.commit('draggable/setCurrentlyDragging', true)"
        @end="$store.commit('draggable/setCurrentlyDragging', false)"
      >
        <CompletedItem v-for="item in completed" :key="item.id" :id="item.id" class="completed-item" />
      </draggable>
    </DraggableWithTrash>
  </ModalElementWithTitle>
</template>

<script>
import draggable from 'vuedraggable'
import CompletedItem from './CompletedItem'
import DraggableWithTrash from './DraggableWithTrash'
import ModalElementWithTitle from './NewBuildModalElementWithTitle'

export default {
  components: {
    draggable,
    CompletedItem,
    DraggableWithTrash,
    ModalElementWithTitle
  },
  computed: {
    completed: {
      get() {
        return this.$store.state.items.completed
      },
      set(value) {
          this.$store.commit('items/setCompleted', {data: value})
      }
    }
  },
  methods: {
    cloneItemId(itemObj) {
      return {id: itemObj.id}
    }
  }
}
</script>

<style lang="scss" scoped>
.completed-item {
  width: 50px;
  height: 50px;
  margin: 1px
}
</style>