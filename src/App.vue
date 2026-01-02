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
    saveGame() {
      const gameState = {
        board: this.board,
        currentRow: this.currentRow,
        keyboardStatus: this.keyboardStatus,
        solution: this.solution,
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
      return true;
    },

    normalizeString(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
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

      const row = this.board[this.currentRow];

      // On garde le mot original pour l'affichage
      const originalWord = word.toUpperCase();

      // Normalisation pour comparaison
      const normalizedSolution = this.normalizeString(this.solution);
      const normalizedWord = this.normalizeString(originalWord);

      // Mettre à jour les lettres du tableau avec le mot original
      originalWord.split("").forEach((letter, index) => {
        row[index].letter = letter; // <- conserve les accents pour l'affichage
      });

      // Vérifier la ligne en utilisant les versions normalisées
      this.checkRow(row, normalizedSolution, normalizedWord);

      // Mettre à jour le clavier
      this.updateKeyboardStatus(row);
      this.currentRow++;
      this.saveGame();
    },

    checkRow(row, normalizedSolution, normalizedWord) {
      const solutionLetters = normalizedSolution.split("");

      // 1. Vert : bonne lettre, bonne position
      row.forEach((cell, index) => {
        if (normalizedWord[index] === solutionLetters[index]) {
          cell.status = "correct";
          solutionLetters[index] = null;
        }
      });

      // 2. Jaune / Rouge : lettre présente mais mauvaise position ou absente
      row.forEach((cell, index) => {
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
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handlePhysicalKey);
  },

  mounted: async function () {
    // Charger la partie sauvegardée si elle existe
    const loaded = this.loadGame();

    // Si aucune sauvegarde, charger le mot du jour
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
  </div>
</template>

<style scoped></style>
