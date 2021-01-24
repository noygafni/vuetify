import './VVirtualTable.sass'

// Components
import VSimpleTable from './VSimpleTable'

// Types
import { VNode, VNodeChildren } from 'vue'
import { PropValidator } from 'vue/types/options'
import mixins from '../../util/mixins'

// Utiltiies
import { convertToUnit, debounce } from '../../util/helpers'

// Types
const baseMixins = mixins(VSimpleTable)

interface options extends InstanceType<typeof baseMixins> {
  $refs: {
    wrapper: HTMLElement
  }
  cachedItems: VNodeChildren
}

export default baseMixins.extend<options>().extend({
  name: 'v-virtual-table',

  props: {
    chunkSize: {
      type: Number,
      default: 25,
    },
    headerHeight: {
      type: Number,
      default: 48,
    },
    items: {
      type: Array,
      default: () => ([]),
    } as PropValidator<any[]>,
    rowHeight: {
      type: Number,
      default: 48,
    },
    expansion: {
      type: Object,
      default: () => ({}),
    },
    expansionHeight: {
      type: Number,
      default: 0,
    },
    visibleItems: {
      type: Number,
      default: 15,
    },
  },

  data: () => ({
    scrollTop: 0,
    oldChunk: 0,
    scrollDebounce: null as any,
    invalidateCache: false,
  }),

  computed: {
    itemsLength (): number {
      return this.items.length
    },
    totalHeight (): number {
      // This assumes each expanded row will be the same height as normal rows
      const totalExpansionHeight = Object.keys(this.expansion).length * this.expansionHeight
      return this.itemsLength * this.rowHeight + this.headerHeight + totalExpansionHeight
    },
    topIndex (): number {
      return Math.floor(this.scrollTop / this.rowHeight)
    },
    chunkIndex (): number {
      return Math.floor(this.topIndex / this.chunkSize)
    },
    startIndex (): number {
      // return Math.max(0, (this.chunkIndex * this.chunkSize) - this.chunkSize)
      return Math.max(0, this.topIndex - this.chunkSize)
    },
    offsetTop (): number {
      return Math.max(0, this.startIndex * this.rowHeight)
    },
    stopIndex (): number {
      // return Math.min(this.startIndex + (this.chunkSize * 3), this.itemsLength)
      return this.startIndex === 0 ? Math.min(this.startIndex + this.visibleItems + this.chunkSize, this.itemsLength)
        : Math.min(this.startIndex + this.visibleItems + this.chunkSize * 2, this.itemsLength)
    },
    offsetBottom (): number {
      return Math.max(0, (this.itemsLength - this.stopIndex - this.startIndex) * this.rowHeight)
    },
  },

  watch: {
    chunkIndex (newValue, oldValue) {
      this.oldChunk = oldValue
    },
    items () {
      this.cachedItems = null
    },
  },

  created () {
    this.cachedItems = null
  },

  mounted () {
    this.scrollDebounce = debounce(this.onScroll, 50)

    this.$refs.wrapper.addEventListener('scroll', this.scrollDebounce, { passive: true })
  },

  beforeDestroy () {
    this.$refs.wrapper.removeEventListener('scroll', this.scrollDebounce)
  },

  methods: {
    createStyleHeight (height: number) {
      return {
        height: `${height}px`,
      }
    },
    genBody () {
      this.cachedItems = this.genItems()
      this.oldChunk = this.chunkIndex

      return this.$createElement('tbody', [
        this.cachedItems,
      ])
    },
    genItems () {
      return this.$scopedSlots.items!({ items: this.items.slice(this.startIndex, this.stopIndex) })
    },
    onScroll (e: Event) {
      const target = e.target as Element
      this.scrollTop = target.scrollTop
    },
    genTable () {
      return this.$createElement('div', {
        staticClass: 'v-virtual-table__table',
        style: this.createStyleHeight(this.totalHeight),
      }, [
        this.$createElement('table', { style: { marginTop: `${this.offsetTop}px` } }, [
          this.$slots['body.before'],
          this.genBody(),
          this.$slots['body.after'],
        ]),
      ])
    },
    genWrapper () {
      return this.$createElement('div', {
        ref: 'wrapper',
        staticClass: 'v-virtual-table__wrapper',
        style: {
          height: convertToUnit(this.height),
        },
      }, [
        this.genTable(),
      ])
    },
  },

  render (h): VNode {
    return h('div', {
      staticClass: 'v-data-table v-virtual-table',
      class: this.classes,
    }, [
      this.$slots.top,
      this.genWrapper(),
      this.$slots.bottom,
    ])
  },
})
