<template>
  <div v-if="enabled" class="modal-container">
    <div
      class="modal-table-wrapper"
      :style="`grid-template-columns: minmax(0, ${width}); grid-template-rows: minmax(0, ${height});`"
    >
      <div class="modal-content" :style="`padding: ${padding};`">
        <div class="modal-title">
          <slot name="title"></slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enabled: {
      required: true,
      type: Boolean
    },
    width: {
      required: false,
      type: String,
      default: '95%'
    },
    height: {
      required: false,
      type: String,
      default: '95%'
    },
    padding: {
      required: false,
      type: String,
      default: '8px'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'resources/sass/colors';
.modal-container {
  position: fixed;
  z-index: 9998;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-table-wrapper {
  display: grid;
  place-content: center;
  grid-template-columns: minmax(0, 95vw);
  grid-template-rows: minmax(0, 95vh);
  width: 100%;
  height: 100%;
}
.modal-content {
  margin: 0 auto;

  background-color: $background;
  display: flex;
  flex-direction: column;
}
.modal-body {
  color: $dark-text-primary;
  flex: 1;
  overflow-y: auto;
}
.modal-buttons {
  flex: 0;
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  & > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0px;
    }
  }
}
.modal-title {
  color: $dark-text-primary;
  flex: 0;
  font-weight: bold;
}
// DESKTOP
@media only screen and (min-width: 631px) {
  .modal-title {
    margin-bottom: 12px;
    font-size: 2rem;
  }
}
// MOBILE
@media only screen and (max-width: 630px) {
  .modal-title {
    margin-bottom: 6px;
    font-size: 1.5rem;
  }
}
</style>