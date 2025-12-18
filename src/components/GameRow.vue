<template>
  <div class="grid grid-cols-5 gap-2">
    <GameCell
      v-for="(cell, index) in row"
      :key="index"
      :letter="cell.letter"
      :status="cell.status"
    />
  </div>
</template>

<script>
import GameCell from "./GameCell.vue";

export default {
  components: { GameCell },
  props: {
    row: {
      type: Array,
      required: true,
    },
  },
};
</script>
