<script>
export default {
  name: "keyBoard",
  emits: ["submit-word", "key-press"],
  props: {
    keyboardStatus: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      typedWord: [],
      keyboard: [
        ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["Q", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "W", "X", "C", "V", "B", "N", "M", "DEL"],
      ],
    };
  },
  //test
  methods: {
    pressKey(key) {
      this.$emit("key-press", key);

      if (key === "DEL") {
        this.typedWord.pop();
      } else if (key === "ENTER") {
        if (this.typedWord.length === 5) {
          this.$emit("submit-word", this.typedWord.join(""));
          this.typedWord = [];
        }
      } else if (this.typedWord.length < 5) {
        this.typedWord.push(key);
      }
    },

    keyClass(key) {
      if (key === "ENTER" || key === "DEL") {
        return "bg-gray-500 hover:bg-gray-400 flex-1";
      }

      const status = this.keyboardStatus[key];

      return (
        {
          correct: "bg-green-600",
          present: "bg-yellow-500",
          absent: "bg-red-500",
        }[status] || "bg-gray-600 hover:bg-gray-500"
      );
    },
  },
};
</script>
<template>
  <section class="flex flex-col gap-2 mt-10">
    <!-- clavier -->
    <div
      class="flex justify-center gap-1"
      v-for="(row, index) in keyboard"
      :key="index"
    >
      <button
        v-for="key in row"
        :key="key"
        @click="pressKey(key)"
        :class="[
          'px-4 py-4 rounded-md font-bold text-white text-lg transition-colors',
          keyClass(key),
        ]"
      >
        {{ key }}
      </button>
    </div>
  </section>
</template>
<script scoped></script>
