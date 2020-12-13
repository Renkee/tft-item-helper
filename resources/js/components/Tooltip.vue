<template>
  <div
    v-if="enabled"
    :style="`top: ${cursorPosY + cursorOffset}px; left: ${cursorPosX + cursorOffset}px`"
    id="tooltip"
  >
    <div
      v-if="currentTarget.type === 'champion'"
      id="champion-variation"
    >
      {{champion(currentTarget.id).name}}
    </div>
    <div
      v-if="currentTarget.type === 'completed'"
      id="completed-variation"
    >
      {{ completed(currentTarget.id).name }}
      <div>
        <ComponentItem
          :id="component(compToCompl[currentTarget.id][0]).id"
        />
        <span>+</span>
        <ComponentItem
          :id="component(compToCompl[currentTarget.id][1]).id"
        />
      </div>
    </div>
    <div
      v-if="currentTarget.type === 'component'"
      id="component-variation"
    >
      {{ component(currentTarget.id).name }}
    </div>
    <div
      v-if="currentTarget.type === 'components-for-build'"
      id="components-for-build-variation"
    >
      <ComponentDisplay :componentList="build(currentTarget.id).components" :imgSize="35" :gapSize="1"/>
    </div>
  </div>
</template>

<script>
import ComponentItem from './ComponentItem'
import ComponentDisplay from './ComponentDisplay'
export default {
  components: {
    ComponentItem,
    ComponentDisplay
  },
  data: () => ({
    enabled: false,
    currentTarget: {},
    cursorOffset: 15,
    cursorPosX: 0,
    cursorPosY: 0,
    acceptedTypes: ['champion', 'completed', 'component', 'components-for-build']
  }),
  watch: {
    '$store.state.draggable.currentlyDragging': function() {
      // Tooltip doesn't follow cursor while dragging, so I personally think it's better to just turn it off
      this.enabled = false
    }
  },
  computed: {
    compToCompl() {
      return this.$store.state.items.componentToCompleted
    }
  },
  methods: {
    champion(id) {
      return this.$store.getters['champions/getById'](id)
    },
    completed(id) {
      return this.$store.getters['items/getCompletedById'](id)
    },
    component(id) {
      return this.$store.getters['items/getComponentById'](id)
    },
    build(id) {
      let index = this.$store.getters['builds/findIndexById'](id)
      return this.$store.state.builds.builds[index]
    }
  },
  created() {
    window.addEventListener('mousemove', e => {
      // Set up mouse hover detection
      if(e.path && e.path.length > 0) {
        // Search for classes in path that match predefined types
        for (let pathEl of e.path) {
          if (pathEl.classList && pathEl.classList.length > 0) {
            const classes = [...pathEl.classList]

            // Check all accepted types and get index if one matches
            const foundIndex = classes.findIndex(el => {
              return this.acceptedTypes.map(type => {
                return el.startsWith(`${type}-id-`)
              }).find(result => result === true)
            })

            if(foundIndex !== -1) {
              // TYPE-id-IDNUMBER
              // This is the layout of our string, we are splitting it into [TYPE, id, IDNUMBER]
              const foundParts = classes[foundIndex].split('-')

              this.currentTarget = {
                type: foundParts.slice(0, foundParts.length-2).join('-'),
                id: foundParts[foundParts.length-1]
              }
              this.enabled = true

              // Since we found an accepted type, stop looping
              break
            } else {
              this.enabled = false
            }
          }
        }
      }

      // Remember cursor location for tooltip position
      this.cursorPosX = e.pageX - window.scrollX
      this.cursorPosY = e.pageY - window.scrollY
    })

  }
}
</script>

<style lang="scss" scoped>
#tooltip {
  color: white;
  background-color: #ff00ff;
  padding: 5px;
  position: fixed;
  z-index: 999999;
  pointer-events: none;
  box-shadow: 0px 0px 15px -6px #2D302D;
}
#completed-variation {
  & > div {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-top: 6px;
    line-height: 0;
    & > span {
      font-size: 24px;
      margin: 0 6px;
    }
    & > div {
      width: 45px;
      height: 45px;
      display: inline-block
    }
  }
}
#components-for-build-variation {
  line-height: 0;
}
</style>