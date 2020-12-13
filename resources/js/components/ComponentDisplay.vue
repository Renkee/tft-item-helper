<template>
<div :style="`min-height: ${imgSize + (gapSize * 2)}px; background-color: ${backgroundColor};`">
  <span
    v-for="(numberOfComponents, componentId) in componentList"
    :key="'A' + componentId"
    :style="`margin-right: ${numberOfComponents > 0 ? gapSize : 0}px`"
  >
    <ComponentItem
      v-for="(_, i) in numberOfComponents"
      :key="'B' + i"
      :style="`width: ${imgSize}px; height: ${imgSize}px; margin: ${gapSize}px ${2 * gapSize}px ${gapSize}px 0px`"
      :id="components[componentId-1].id"
    />
  </span>
</div>
</template>

<script>
import ComponentItem from './ComponentItem'
export default {
  props: {
    componentList: {
      required: true,
      type: Object
    },
    imgSize: {
      required: false,
      type: Number,
      default: 45
    },
    gapSize: {
      required: false,
      type: Number,
      default: 2
    },
    backgroundColor: {
      required: false,
      type: String,
      default: 'transparent'
    }
  },
  components: {
    ComponentItem
  },
  computed: {
    components() {
      return this.$store.state.items.components
    },
  }
}
</script>