<template>
  <div
    v-if="enabled"
    :style="`top: ${cursorPosY}px; left: ${cursorPosX}px`"
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
    cursorOffsetX: 15,
    cursorOffsetY: 20,
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
    },
    generatePath(el) {
      var path = [];
      while (el) {
          path.push(el);
          if (el.tagName === 'HTML') {
              path.push(document);
              path.push(window);

              return path;
        }
        el = el.parentElement;
      }
    }
  },
  created() {
    window.addEventListener('mousemove', e => {
      // Firefox bug fix, generate path if feature is not implemented in browser
      if (!e.path) {
        e.path = this.generatePath(e.target)
      }
      // Set up mouse hover detection
      if(e.path.length > 0) {
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
      // Adjust location to left if tooltip doesn't fit on viewport
      // Wait for DOM to update the tooltip's width
      this.$nextTick(() => {
        if (this.$el && this.$el.scrollWidth) {
          this.cursorPosX = e.pageX - window.scrollX + this.cursorOffsetX
          this.cursorPosY = e.pageY - window.scrollY + this.cursorOffsetY

          let adjustmentAmount = (this.cursorPosX + this.$el.scrollWidth) - window.innerWidth
          this.cursorPosX -= (adjustmentAmount > 0 ? adjustmentAmount : 0)
        }
      })
    })
    window.addEventListener('scroll', e => {
      this.enabled = false;
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'resources/sass/colors';
#tooltip {
  color: $text-primary;
  background-color: $primary;
  padding: 5px;
  position: fixed;
  z-index: 999999;
  pointer-events: none;
  box-shadow: 0px 0px 15px -6px #2D302D;
  white-space: nowrap;
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