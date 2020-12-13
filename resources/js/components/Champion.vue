<template>
  <div
    :class="`champion-container champion-id-${champion.id}`"
    :style="`background-color: #${champion.color}`"
  >
    <img
      :src="'data:image/png;base64, ' + champion.image"
      class="champion-image"
      :alt="champion.name"
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
    champion() {
      return this.$store.getters['champions/getById'](this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.champion-image {
  clip-path: inset(4px 4px 4px 4px);
  width: 100%;
  height: 100%;
}
.champion-container {
  transition: filter 0.3s cubic-bezier(0, 0.55, 0.45, 1);
}
.champion-container:hover {
  filter: brightness(1.3);
}
</style>