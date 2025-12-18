<template>
  <div class="grid">
    <GameRow
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        :row="row"
    />
  </div>
</template>

<script>
import { getWordleWord } from "../services/apiGet.js";
import GameRow from "./GameRow.vue";

export default {
  components: { GameRow },

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
    console.log(this.solution);
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 10px;
}
</style>