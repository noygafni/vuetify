<template>
    <tr :class="{'lockedRow elevation-1': isLocked}" @mousewheel="$emit('mousewheel', $event)">
        <td>
            <v-chip dark> {{ item.name }} </v-chip>
        </td>
        <td>
            <v-btn v-if="isLocked" @click="$emit('unlock-row', item)">UNLOCK</v-btn>
            <v-btn v-else @click="$emit('lock-row', item)">LOCK ROW</v-btn>
        </td>
        <td>
            <v-btn v-if="isLocked" @click="$emit('unlock-rows')">UNLOCK MULTI</v-btn>
            <v-btn v-else @click="$emit('lock-rows', item)">MULTI LOCK</v-btn>
        </td>
        <td>
            <v-chip dark> {{ item.carbs }} </v-chip>
        </td>
        <td>
            <v-chip dark> {{ item.protein }} </v-chip>
        </td>
        <td>
            <v-chip dark> {{ item.iron }} </v-chip>
        </td>
    </tr>
</template>

<script>
export default {
    props: {
        item: Object,
        isLocked: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
    .lockedRow {
        width: 100%;
        background-color: aqua;
        padding-top: 4px;
    }
     
    td {
        width: 16.4vw !important;
    }
</style>