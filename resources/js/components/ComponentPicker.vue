<template>
  <div id="user-item-select">
    <div v-for="component in components" :key="component.id" class="components">
      <div class="component-picker-component-container">
        <ComponentItem :id="component.id" class="component-item" />
        <div class="component-count-container">
          <div>
            <button
              class="component-count-button"
              @click="$store.dispatch('user/addItem', component.id)"
            >
              <font-awesome-icon icon="chevron-up"></font-awesome-icon>
            </button>
          </div>
          <div class="component-count">{{ userItems[component.id] }}</div>
          <div>
            <button
              :class="`component-count-button ${userItems[component.id] === 0 ? 'button-disabled' : ''}`"
              @click="$store.dispatch('user/removeItem', component.id)"
            >
              <font-awesome-icon icon="chevron-down"></font-awesome-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentItem from './ComponentItem'
export default {
  components: {
    ComponentItem
  },
  computed: {
    components() {
      return this.$store.state.items.components
    },
    userItems() {
      return this.$store.state.user.items
    }
  }
}
</script>

<style lang="scss" scoped>
#user-item-select {
  user-select: none
}
.component-item {
  width: 64px;
  height: 64px;
  margin-right: 4px;
}
.components {
  display: inline-block;
  margin-right: 16px;
}
.component-picker-component-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  line-height: 0;
  font-size: 0;
  padding: 4px;
  background-color: #ff00ff;
  color: white;
  margin-bottom: 2px;
}
.component-count-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-size: 1rem;
  line-height: 1;
}
.component-count {
  font-weight: 600;
}
.button-disabled {
  opacity: 0.7;
  cursor: unset !important;
}
.component-count-button {
  background-color: unset;
  border: unset;
  color: white;
  font-size: 0.75rem;
  padding: 2px 4px 2px 4px;
  margin: 0;
  cursor: pointer;
  &:hover {
    background-color: unset;
  }
}
</style>