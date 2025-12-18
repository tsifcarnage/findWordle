<script>
import Nav from "./components/Nav.vue";
import GameBoard from "./components/GameBoard.vue";
import Keyboard from "./components/Keyboard.vue";

export default {
  components: {
    Nav,
    GameBoard,
    Keyboard,
  },


  data() {
    return {
      // 🔴 TEMPORAIRE pour tests (sera relié à l’API plus tard)
      solution: "APPLE",

      board: Array.from({ length: 6 }, () =>
          Array.from({ length: 5 }, () => ({
            letter: "",
            status: "", // correct | present | absent
          }))
      ),

      currentRow: 0,
    };
  },

  methods: {
    testWord(word) {
      if (this.currentRow >= 6) return;

      word = word.toUpperCase();

      word.split("").forEach((letter, index) => {
        this.board[this.currentRow][index].letter = letter;
      });

      // 👉 vérification Wordle
      this.checkRow(this.currentRow);

      this.currentRow++;
    },

    checkRow(rowIndex) {
      const row = this.board[rowIndex];
      const solutionLetters = this.solution.split("");

      // 1️⃣ VERT : bonne lettre, bonne position
      row.forEach((cell, index) => {
        if (cell.letter === solutionLetters[index]) {
          cell.status = "correct";
          solutionLetters[index] = null;
        }
      });

      // 2️⃣ JAUNE / ROUGE
      row.forEach((cell) => {
        if (cell.status) return;

        const foundIndex = solutionLetters.indexOf(cell.letter);

        if (foundIndex !== -1) {
          cell.status = "present";
          solutionLetters[foundIndex] = null;
        } else {
          cell.status = "absent";
        }
      });
    },
  },

  mounted() {
    window.testWord = this.testWord;
    console.log("👉 testWord('APPLE') disponible");
  },
};
</script>

<template>
  <div class="app">
    <Nav />
    <GameBoard :board="board" />
    <Keyboard />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>