<template>
  <div id="main-container">
    <div id="sidebar">
      <div id="user-component-picker-container">
        <ComponentPicker />
      </div>
      <div id="side-buttons">
        <button @click="$store.dispatch('user/clearAllItems')">Clear items</button>
        <button @click="$store.commit('modals/setCreateNewBuildEnabled', true)">New build</button>
      </div>
    </div>
    <div id="top-bar">
      <h1>TFT Item Helper</h1>
      <div id="user-component-display-container">
        <ComponentDisplay
          v-if="Object.values(userItems).reduce((acc, curr) => acc + curr) > 0"
          id="user-component-display"
          :componentList="userItems"
          backgroundColor="#cf253e"
        />
        <div v-else id="user-component-display-text-container">
          <h4>Your selected items will appear here.</h4>
        </div>
      </div>

    </div>
    <div id="builds">
      <div v-if="buildsSortedByItemScore.length > 0">
        <transition-group tag="div" name="build">
          <BuildDisplay v-for="build in buildsSortedByItemScore" :key="build.name" :build="build"/>
        </transition-group>
      </div>
      <div v-else>
        <h3>No builds found. Maybe you could add some?</h3>
      </div>
    </div>

    <!-- Modals -->
    <NewBuildModal />
    <EditBuildModal />
    <DeleteConfirmModal />

    <!-- Other globally needed stuff -->
    <Notification />
    <Tooltip />
  </div>
</template>

<script>
import axios from 'axios'
import ComponentPicker from './ComponentPicker'
import ComponentDisplay from './ComponentDisplay'
import BuildDisplay from './BuildDisplay'
import NewBuildModal from './NewBuildModal'
import EditBuildModal from './EditBuildModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import Notification from './Notification'
import Tooltip from './Tooltip'

export default {
  components: {
    ComponentPicker,
    ComponentDisplay,
    BuildDisplay,
    NewBuildModal,
    EditBuildModal,
    DeleteConfirmModal,
    Notification,
    Tooltip
  },
  computed: {
    userItems() {
      return this.$store.state.user.items
    },
    buildsSortedByItemScore() {
      return this.$store.getters['builds/sortedByItemScore']
    },
    anyModalsEnabled() {
      return this.$store.getters['modals/anyEnabled']
    }
  },
  watch: {
    'anyModalsEnabled': function(newVal) {
      this.disableScrollingOnHtmlTag(newVal)
    }
  },
  methods: {
    disableScrollingOnHtmlTag(anyModalsEnabled) {
      let html = document.documentElement
      if (anyModalsEnabled) {
        let offset = window.innerWidth - document.body.offsetWidth
        html.style.paddingRight = `${offset}px`
        html.style.overflow = 'hidden'
      } else {
        html.style.paddingRight = '0'
        html.style.overflow = 'auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'resources/sass/colors';
// GENERAL
#sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background-color: $secondary;

  #user-item-select {
    min-height: 0;
  }
}
#top-bar {
  grid-area: top-bar;
  background-color: $primary;
}
#user-component-display-text-container {
  display: grid;
  min-height: inherit;
  justify-content: center;
}
#builds {
  grid-area: builds;
  background-color: $background;
  & > div:last-child {
    margin-bottom: 96px;
  }
}
#side-buttons > button {
  display: block !important;
  width: 100%;
  color: $text-primary;
  border: none;

  &:hover {
    background-color: #622574;
  }
}
.build-move {
  transition: transform 0.5s ease;
}

// DESKTOP
@media only screen and (min-width: 641px) {
  @media only screen and (min-height: 800px){
    #user-item-select {
      grid-template-columns: repeat(1, min-content) !important;
    }
  }
  @media only screen and (min-height: 500px) and (max-height: 799px) {
    #user-item-select {
      grid-template-columns: repeat(2, min-content) !important;
    }
  }
  @media only screen and (max-height: 499px) {
    #user-item-select {
      grid-template-columns: repeat(3, min-content) !important;
    }
  }
  #main-container {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content 1fr;
    grid-template-areas:
    "top-bar top-bar"
    "sidebar builds";
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    #sidebar {
      justify-content: space-between;
      padding: 2px;
      overflow: hidden;
    }

    #top-bar {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-end;
      padding: 8px;
      overflow: hidden;

      #user-component-display-container {
        min-height: 49px;
        #user-component-display-text-container {
          align-items: flex-end;
          opacity: 0.9;
        }
      }
    }


    #builds {
      height: 100%;
      overflow: auto;
      & > div {
        padding: 10px;
      }
    }
  }
}

// MOBILE
@media only screen and (max-width: 640px) {
  #main-container {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;

    #sidebar {
      align-items: center;
      margin-bottom: 24px;
      padding-top: 18px;

      #user-component-picker-container {
        width: 100%;
      }

      #side-buttons {
        margin-top: 24px;
        text-align: center;
        width: 100%;
        button {
          box-sizing: border-box;
          padding: 16px;
        }
      }
    }


    #top-bar {
      order: -1;

      #user-component-display-container {
        //margin: 0 8px 24px 8px;
        background-color: #c662e2;
        min-height: 98px !important;

        #user-component-display-text-container {
          align-items: center;
        }

        #user-component-display {
          text-align: center;
          background-color: #c662e2 !important;
        }
      }

      h1 {
        margin: 24px auto 24px auto;
        text-align: center;
      }
    }
  }
}
</style>