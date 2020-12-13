<template>
  <div class="trash-parent">
    <draggable
      v-show="$store.state.draggable.currentlyDragging"
      v-model="list"
      :style="`max-height: ${trashZoneMaxHeight}px; top: ${trashZoneOffset}px`"
      class="trash-area"
      drag-class="ghost"
      ghost-class="ghost"
      :sort="false"
      :group="{put: ['item', 'champion']}"
      @change="removeAll"
    >
      <div v-for="elem in list" :key="elem.id">{{elem.name}}</div>
    </draggable>
    <div class="content-area">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data: () => ({
    list: [],
    trashZoneMaxHeight: 0,
    trashZoneOffset: 0,
  }),
  methods: {
    removeAll() {
      this.list = []
    },
    calculateTrashZoneStyling() {
      this.trashZoneMaxHeight = this.$el.parentElement.clientHeight
      this.trashZoneOffset = this.$el.parentElement.scrollTop
    }
  },
  mounted() {
    // We need to dynamically calculate the size of the trash area to prevent it from overflowing
    this.calculateTrashZoneStyling()
    window.addEventListener('resize', (e) => {
      this.calculateTrashZoneStyling()
    })
    this.$el.parentElement.addEventListener('scroll', (e) => {
      this.calculateTrashZoneStyling()
    })
  }
}
</script>

<style lang="scss">
.ghost {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
}
.trash-parent {
  position: relative;
}
.trash-area {
  position: absolute;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 1;
}
.content-area {
  z-index: 0;
}
</style>