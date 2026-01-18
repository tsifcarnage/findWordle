<script>
import Nav from "./components/Nav.vue";
import GameBoard from "./components/GameBoard.vue";
import Keyboard from "./components/Keyboard.vue";
import Popup from "./components/Popup.vue";
import { getWordleWord } from "./services/apiGet.js";

export default {
  components: {
    Nav,
    GameBoard,
    Keyboard,
    Popup,
  },

  data() {
    return {
      solution: "",

      board: Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => ({
          letter: "",
          status: "",
        })),
      ),

      currentRow: 0,
      keyboardStatus: {},

      showPopup: false,
      win: false,
      gameOver: false,
    };
  },

  methods: {
    saveGame() {
      const gameState = {
        board: this.board,
        currentRow: this.currentRow,
        keyboardStatus: this.keyboardStatus,
        solution: this.solution,
        win: this.win,
        gameOver: this.gameOver,
      };
      localStorage.setItem("wordleGameState", JSON.stringify(gameState));
    },

    loadGame() {
      const saved = localStorage.getItem("wordleGameState");
      if (!saved) return false;

      const state = JSON.parse(saved);
      this.board = state.board;
      this.currentRow = state.currentRow;
      this.keyboardStatus = state.keyboardStatus;
      this.solution = state.solution;
      this.win = state.win ?? false;
      this.gameOver = state.gameOver ?? false;

      if (this.gameOver) {
        this.showPopup = true;
      }

      return true;
    },

    normalizeString(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    handlePhysicalKey(event) {
      if (this.currentRow >= 6 || this.gameOver) return;

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
      if (this.currentRow >= 6 || this.gameOver) return;

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
      if (this.currentRow >= 6 || this.gameOver) return;

      const row = this.board[this.currentRow];
      const originalWord = word.toUpperCase();

      const normalizedSolution = this.normalizeString(this.solution);
      const normalizedWord = this.normalizeString(originalWord);

      originalWord.split("").forEach((letter, index) => {
        row[index].letter = letter;
      });

      this.checkRow(row, normalizedSolution, normalizedWord);
      this.updateKeyboardStatus(row);

      const isWin = row.every((cell) => cell.status === "correct");

      if (isWin) {
        this.win = true;
        this.gameOver = true;
        this.showPopup = true;
      } else if (this.currentRow === 5) {
        this.win = false;
        this.gameOver = true;
        this.showPopup = true;
      } else {
        this.currentRow++;
      }

      this.saveGame();
    },

    checkRow(row, normalizedSolution, normalizedWord) {
      const solutionLetters = normalizedSolution.split("");

      row.forEach((cell, index) => {
        if (normalizedWord[index] === solutionLetters[index]) {
          cell.status = "correct";
          solutionLetters[index] = null;
        }
      });

      row.forEach((cell) => {
        if (cell.status) return;

        const normalizedLetter = this.normalizeString(cell.letter);
        const foundIndex = solutionLetters.indexOf(normalizedLetter);

        if (foundIndex !== -1) {
          cell.status = "present";
          solutionLetters[foundIndex] = null;
        } else {
          cell.status = "absent";
        }
      });
    },

    closePopup() {
      this.showPopup = false;
    },

    restartGame() {
      localStorage.removeItem("wordleGameState");
      localStorage.removeItem("wordleWord");
      location.reload();
    },
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handlePhysicalKey);
  },

  mounted: async function () {
    const loaded = this.loadGame();

    if (!loaded) {
      let solution = localStorage.getItem("wordleWord");

      if (!solution) {
        solution = await getWordleWord();
        localStorage.setItem("wordleWord", solution);
      }

      this.solution = solution.toUpperCase();
    }

    console.log("Solution :", this.solution);
    window.addEventListener("keydown", this.handlePhysicalKey);
  },
};
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <Nav />

    <GameBoard :board="board" />

    <Keyboard
      @submit-word="testWord"
      @key-press="handleKeyPress"
      :keyboardStatus="keyboardStatus"
    />

    <Popup v-if="showPopup" @close="closePopup">
      <template #title>
        <h2 class="text-xl font-bold">
          <span v-if="win">🎉 Bravo !</span>
          <span v-else>☠️ Perdu !</span>
        </h2>
      </template>

      <p class="text-base">
        <span v-if="win">Tu as trouvé le mot :</span>
        <span v-else>Le mot était :</span>
        <strong style="margin-left: 6px; letter-spacing: 2px">
          {{ solution }}
        </strong>
      </p>

      <template #actions>
        <button class="btn primary" type="button" @click="restartGame">
          Rejouer
        </button>
        <button class="btn ghost" type="button" @click="closePopup">
          Fermer
        </button>
      </template>
    </Popup>
  </div>
</template>

<style scoped></style>
