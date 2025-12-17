<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="cell"
        :class="cell.status"
      >
        {{ cell.letter }}
      </div>
    </div>
  </div>
</template>

<script>
import { getWordleWord } from "../services/apiGet.js";
export default {
  props: {
    board: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      solution: "",
    };
  },
  async mounted() {
    let solution = localStorage.getItem("wordleWord");

    if (!solution) {
      solution = await getWordleWord();
    }

    this.solution = solution.toUpperCase();
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, 50px);
  gap: 10px;
}

.cell {
  width: 50px;
  height: 50px;
  border: 2px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}
</style>
