<template>
  <Modal :enabled="$store.state.modals.deleteConfirm.enabled" width="280px" height="130px" padding="16px">
    <template v-slot:title>Are you sure?</template>
    <template v-slot:body>
      This build will be deleted.
    </template>
    <template v-slot:buttons>
      <button class="delete-button" @click="remove">Yes</button>
      <button @click="close">No</button>
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal'
export default {
  components: {
    Modal
  },
  methods: {
    remove() {
      this.$store.state.modals.deleteConfirm.action()
      this.$store.commit('modals/setDeleteConfirmEnabled', false)
    },
    close() {
      this.$store.commit('modals/setDeleteConfirmEnabled', false)
    }
  }
}
</script>