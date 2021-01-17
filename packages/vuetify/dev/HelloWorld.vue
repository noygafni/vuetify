<template>
  <div>
    <v-data-table
        :items="items"
        :items-per-page="-1"
        virtual-rows
        :chunk-size="5"
        :visible-items="16"
        single-expand
        item-key="name"
        hide-default-header
        hide-default-footer
        height="600px"
        dark
        ref="mainDataTable"
    >
      <template #item="{ item }">
          <TableRow
            :ref="`tableRow${item.name}`"
            :item="item"
            @lock-row="lockSingleRow"
            @lock-rows="lockMultiRows"
          />
      </template>
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about {{ item.name }}
        </td>
      </template>
    </v-data-table>
    <v-data-table
      v-if="lockedRows.length"
      class="static-rows-container"
      :items="lockedRows"
      :style="`top: ${lockedRowPosition.top}px; width:${lockedRowPosition.width}px`"
      hide-default-footer
      hide-default-header
      ref="floatDataTable"
    >
    <template #item="{ item }">
        <TableRow
          :ref="`tableRow${item.name}`"
          :is-locked="true"
          :item="item"
          :style="`width:${lockedRowPosition.width}px; margin-botton: 5px`"
          @unlock-row="unlockSingleRow"
          @unlock-rows="unlockMultiRows"
          @mousewheel="handleScroll"
        />
    </template>
    </v-data-table>
  </div>
</template>

<script>
import TableRow from './TableRow.vue';

export default {
  name: 'HelloWorld',
  components: {
    TableRow
  },
  data() {
    return {
      headers:
       [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name',
            width: "16.4vw"
          },
          {
            text: 'Calories',
            value: 'calories',
            width: "16.4vw"
          },
          {
            text: 'Fat (g)',
            value: 'fat',
            width: "16.4vw"
          },
          {
            text: 'Carbs (g)',
            value: 'carbs',
            width: "16.4vw"
          },
          {
            text: 'Protein (g)',
            value: 'protein',
            width: "16.4vw"
          },
          {
            text: 'Iron (%)',
            value: 'iron',
            width: "16.4vw"
          }
      ],
      items: [],
      lockedRowPosition: {top: 0, width: 0},
      lockedRow: null,
      lockedRows: [],
      expanded: []
    };
  },
  mounted() {
    let count = 0;
    this.addMoreItems(count)
  },
  methods: {
    addMoreItems(count) {
      for (let i=0; i < 100; i++) {
        this.items.push({
          name: i + count,
          calories: i + count,
          fat: i + count,
          carbs: i + count,
          protein: i + count,
          iron: i + count,
        });
      }
    },
    getItemIndex(list, item) {
      return list.indexOf(this.findItemByName(list, item.name));
    },
    findItemByName(list, name) {
      return list.find(currItem => name === currItem.name)
    },
    lockSingleRow(item) {
      this.lockRows([item])
    },
    lockMultiRows(firstItem) {
      // Just as example of multi row lock
      const rowsToLock = [
        firstItem,
        this.findItemByName(this.items, firstItem.name + 1),
        this.findItemByName(this.items, firstItem.name + 2),
        this.findItemByName(this.items, firstItem.name + 3),
        this.findItemByName(this.items, firstItem.name + 4)
      ]
      this.lockRows(rowsToLock);
    },
    lockRows(itemsToLock) {
      itemsToLock.forEach(currItem => {
        this.$delete(this.items, this.getItemIndex(this.items, currItem));
      })
      const rowRect = this.$refs[`tableRow${itemsToLock[0].name}`].$el.getBoundingClientRect();
      this.lockedRowPosition.top = rowRect.top;
      this.lockedRowPosition.width = rowRect.width;
      this.lockedRows = itemsToLock;
    },
    unlockSingleRow(item) {
      this.$delete(this.lockedRows, this.getItemIndex(this.lockedRows, item));
      this.items.push(item);
    },
    unlockMultiRows() {
      this.lockedRows.forEach(item => this.items.push(item));
      this.lockedRows = [];
    },
    handleScroll(evt) {
      const floatDataTableElement = this.$refs.floatDataTable.$el;
      // if the floating table scroller is at the top or bottom
      if (evt.wheelDelta > 0 && floatDataTableElement.scrollTop === 0 || evt.wheelDelta < 0 &&
         floatDataTableElement.scrollHeight - floatDataTableElement.scrollTop <= floatDataTableElement.clientHeight ) {
        this.$refs.mainDataTable.$el.firstChild.scrollTop = this.$refs.mainDataTable.$el.firstChild.scrollTop - evt.wheelDelta
      }
    },
  }
}
</script>

<style scoped>
  .static-row {
    position: absolute;
    height: 48px;
  }

  .static-rows-container {
    position: absolute;
    max-height: 96px;
    overflow: auto;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }

  .static-rows-container::-webkit-scrollbar {
    display: none;
  }

  .static-rows-container::v-deep tbody
  tr:hover:not(.v-data-table__expanded__content) {
  background: aqua !important;
}
</style>
