<template>
  <div
    :class="`component-container component-id-${component.id}`"
  >
    <img
      :src="'data:image/png;base64, ' + component.image"
      class="component-image"
      :alt="component.name"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: Number
    }
  },
  computed: {
    component() {
      return this.$store.getters['items/getComponentById'](this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-image {
  width: 100%;
  height: 100%;
}
.component-container {
  display: inline-block;
  transition: filter 0.3s cubic-bezier(0, 0.55, 0.45, 1);
}
.component-container:hover {
  filter: brightness(1.3);
}
</style>