<script>
export default {
  name: "keyBoard",
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
      if (key === "DEL") {
        this.typedWord.pop();
      } else if (key === "ENTER") {
        console.log("Mot soumis :", this.typedWord.join(""));
        this.typedWord = [];
      } else if (this.typedWord.length < 5) {
        this.typedWord.push(key);
      }
    },
  },
};
</script>
<template>
  <section class="flex flex-col gap-2 mt-10">
    <!-- test -->
    <div class="flex gap-1 mb-4">
      <div
        v-for="(letter, index) in typedWord"
        :key="index"
        class="w-10 h-10 flex items-center justify-center border-2 border-gray-700 rounded-md text-xl font-bold"
      >
        {{ letter }}
      </div>
    </div>

    <!-- clavier -->
    <div
      class="flex justify-center gap-1"
      v-for="(row, index) in keyboard"
      :key="index"
    >
      <button
        :class="[
          'btn btn-neutral px-5 py-6 rounded-md font-bold text-white text-lg',
          key === 'ENTER' || key === 'DEL'
            ? 'bg-gray-500 hover:bg-gray-400 flex-1'
            : 'bg-gray-700 hover:bg-gray-600',
        ]"
        v-for="key in row"
        :key="key"
        @click="pressKey(key)"
      >
        {{ key }}
      </button>
    </div>
  </section>
</template>
<script scoped></script>
