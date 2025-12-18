<template>
  <div
    class="w-[50px] h-[50px] border-2 border-gray-600 flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-300"
    :class="statusClasses"
  >
    {{ letter }}
  </div>
</template>

<script>
export default {
  props: {
    letter: String,
    status: String, // correct | present | absent
  },
  computed: {
    statusClasses() {
      return {
        correct: "bg-green-600 text-white",
        present: "bg-yellow-500 text-white",
        absent: "bg-red-600 text-white",
      }[this.status];
    },
  },
};
</script>
