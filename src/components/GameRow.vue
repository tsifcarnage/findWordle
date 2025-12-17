<template>
  <div class="row">
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
    row: Array,
  },
};
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: repeat(5, 50px);
  gap: 10px;
}
</style>