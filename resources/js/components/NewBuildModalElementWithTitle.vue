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
.container {
  display: flex;
  flex-direction: column;
}
.title {
  flex: 0;
  line-height: 1;
  font-weight: bold;
  background-color: #ff00ff;
  color: white;
  padding: 10px;
  z-index: 0;
}
.content {
  z-index: 1;
  flex: 1;
  overflow: auto;
  padding: 5px 20px 5px 5px;
}
</style>