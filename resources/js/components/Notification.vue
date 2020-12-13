<template>
  <div v-if="notifications.length > 0" id="notification-holder">
    <div>
      <div
        v-for="(notif, index) in notifications"
        :key="index"
        :style="`background-color: #${notification.color}; position: absolute; top: ${index * 120}px; right: 0;`"
        @mouseenter="stopAndResetTimer"
        @mouseleave="$store.dispatch('notification/resetTimer')"
      >
        <div class="notification">
          <h3>{{ notif.color === $store.state.notification.color.info ? 'Information' : 'Error' }}</h3>
          <div>{{ notif.message }}</div>
          <div v-if="index === 0">
            <button class="close-button" @click="$store.dispatch('notification/remove')">
              <font-awesome-icon icon="times"></font-awesome-icon>
            </button>
            <div class="closing-text">closing in {{ $store.state.notification.time }} seconds</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    notification() {
      return this.$store.getters['notification/current']
    },
    notifications() {
      return this.$store.getters['notification/queue']
    }
  },
  methods: {
    stopAndResetTimer() {
      this.$store.dispatch('notification/resetTimer')
      this.$store.commit('notification/clear')
    }
  }
}
</script>

<style lang="scss" scoped>
#notification-holder {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999999;

  & > div {
    position: relative
  }
}
.notification {
  color: white;
  width: 300px;
  min-height: 100px;
  padding: 0.5rem;
  position: relative
  h3 {
    margin-bottom: 8px;
  }
}
.closing-text {
  text-align: right;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
}
.close-button {
  background-color: unset;
  border: unset;
  position: absolute;
  color: white;
  top: 0.25rem;
  right: 0.5rem;
  padding: 2px;
  &:hover {
    background-color: unset;
  }
}
</style>