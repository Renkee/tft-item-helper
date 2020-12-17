<template>
  <div v-if="enabled" class="modal-container">
    <div class="modal-table-wrapper">
      <div class="modal-content" :style="`width: ${width}; height: ${height}; padding: ${padding}`">
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
      default: '95vw'
    },
    height: {
      required: false,
      type: String,
      default: '95vh'
    },
    padding: {
      required: false,
      type: String,
      default: '1vmax'
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-container {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}
.modal-table-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-content {
  margin: 0 auto;

  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}
.modal-body {
  color: black;
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
  color: black;
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