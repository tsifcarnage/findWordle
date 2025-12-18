<template>
  <div class="grid gap-2">
    <GameRow v-for="(row, rowIndex) in board" :key="rowIndex" :row="row" />
  </div>
</template>

<script>
import GameRow from "./GameRow.vue";

export default {
  components: { GameRow },
  props: {
    board: Array,
  },
};
</script>
