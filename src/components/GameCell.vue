<template>
  <div class="cell" :class="status">
    {{ letter }}
  </div>
</template>

<script>
export default {
  props: {
    letter: String,
    status: String, // correct | present | absent
  },
};
</script>

<style scoped>
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

.correct {
  background: green;
}

.present {
  background: goldenrod;
}

.absent {
  background: crimson;
}
</style>