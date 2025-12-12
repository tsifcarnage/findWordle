<script>
import Nav from "./components/Nav.vue";
import APIGet from "./components/APIGet.vue";
export default {
  components: {
    Nav,
    APIGet,
  },
  data() {
    return {
      wordFromStorage: null,
    };
  },
  methods: {
    onWordReady(word) {
      this.wordFromStorage = word;
    },
  },
};
</script>

<template>
  <div>
    <Nav />
    <APIGet @word-ready="onWordReady" />
    <h1 class="text-info text-6xl">Find Wordle</h1>
    <!-- Affichage du mot récupéré depuis localStorage -->
    <div v-if="wordFromStorage">
      <p>Mot récupéré depuis localStorage : {{ wordFromStorage }}</p>
    </div>
    <div v-else>
      <p>
        Pas de mot dans localStorage. Il faut d'abord le récupérer via l'API.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
