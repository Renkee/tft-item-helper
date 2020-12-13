<template>
  <div
    :class="`completed-container completed-id-${completed.id}`"
  >
    <img
      :src="'data:image/png;base64, ' + (halfSize ? completed.image_small : completed.image)"
      class="completed-image"
      :alt="completed.name"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: Number
    },
    halfSize: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    completed() {
      return this.$store.getters['items/getCompletedById'](this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.completed-image {
  width: 100%;
  height: 100%;
  // This is a "hack" for image-rendering consistency
  transform: translateZ(0px);
}
.completed-container {
  display: inline-block;
  transition: filter 0.3s cubic-bezier(0, 0.55, 0.45, 1);
}
.completed-container:hover {
  filter: brightness(1.3);
}
</style>