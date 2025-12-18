<script>
import Nav from "./components/Nav.vue";
import GameBoard from "./components/GameBoard.vue";
import Keyboard from "./components/Keyboard.vue";
import { getWordleWord } from "./services/apiGet.js";
export default {
  components: {
    Nav,
    GameBoard,
    Keyboard,
  },

  data() {
    return {
      solution: "APPLE",

      board: Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => ({
          letter: "",
          status: "",
        }))
      ),

      currentRow: 0,
      keyboardStatus: {},
    };
  },

  methods: {
    handlePhysicalKey(event) {
      if (this.currentRow >= 6) return;

      const key = event.key.toUpperCase();

      if (key === "BACKSPACE") {
        this.handleKeyPress("DEL");
      } else if (key === "ENTER") {
        const row = this.board[this.currentRow];
        const word = row.map((c) => c.letter).join("");

        if (word.length === 5) {
          this.testWord(word);
        }
      } else if (/^[A-Z]$/.test(key)) {
        this.handleKeyPress(key);
      }
    },

    handleKeyPress(key) {
      if (this.currentRow >= 6) return;

      const row = this.board[this.currentRow];

      if (key === "DEL") {
        for (let i = 4; i >= 0; i--) {
          if (row[i].letter) {
            row[i].letter = "";
            break;
          }
        }
      } else if (key === "ENTER") {
        return;
      } else {
        for (let i = 0; i < 5; i++) {
          if (!row[i].letter) {
            row[i].letter = key;
            break;
          }
        }
      }
    },
    updateKeyboardStatus(row) {
      row.forEach(({ letter, status }) => {
        const current = this.keyboardStatus[letter];

        // priorité : correct > present > absent
        if (
          current === "correct" ||
          (current === "present" && status === "absent")
        ) {
          return;
        }

        this.keyboardStatus[letter] = status;
      });
    },

    testWord(word) {
      if (this.currentRow >= 6) return;

      word = word.toUpperCase();

      word.split("").forEach((letter, index) => {
        this.board[this.currentRow][index].letter = letter;
      });

      this.checkRow(this.currentRow);

      this.updateKeyboardStatus(this.board[this.currentRow]);

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
  beforeUnmount() {
    window.removeEventListener("keydown", this.handlePhysicalKey);
  },

  mounted: async function () {
    let solution = localStorage.getItem("wordleWord");

    if (!solution) {
      solution = await getWordleWord();
      localStorage.setItem("wordleWord", solution);
    }

    this.solution = solution.toUpperCase();
    console.log("Solution :", this.solution);
    window.addEventListener("keydown", this.handlePhysicalKey);
  },
};
</script>

<template>
  <div class="app">
    <Nav />
    <GameBoard :board="board" />
    <Keyboard
      @submit-word="testWord"
      @key-press="handleKeyPress"
      :keyboardStatus="keyboardStatus"
    />
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
