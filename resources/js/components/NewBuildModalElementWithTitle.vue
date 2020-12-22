<template>
  <div class="container">
    <div class="title">
      <h3>{{ title }}</h3>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'resources/sass/colors';
.container {
  display: flex;
  flex-direction: column;
}
.content {
  z-index: 1;
  flex: 1;
  overflow: auto;
  padding: 5px 20px 5px 5px;
}
.title {
  flex: 0;
  line-height: 1;
  font-weight: bold;
  background-color: $primary;
  color: $text-primary;
  z-index: 0;
}
// DESKTOP
@media only screen and (min-width: 631px) {
  .title {
    padding: 10px;
  }
}
// MOBILE
@media only screen and (max-width: 630px) {
  .title {
    padding: 4px;
    h3 {
      font-size: 1.25rem !important;
    }
  }
}
</style>