<template></template>
<script>
export default {
  mounted() {
    this.fetchWord();
  },
  methods: {
    async fetchWord() {
      const storedWord = localStorage.getItem("wordleWord");

      if (!storedWord) {
        try {
          const response = await fetch("https://trouve-mot.fr/api/size/5");
          const data = await response.json();

          console.log("Données récupérées de l'API:", data);

          const word = data[0].name;
          console.log("Mot récupéré:", word);

          localStorage.setItem("wordleWord", word);

          this.$emit("word-ready", word); // a mettre dans input.vue @word-redy="taFonction"
        } catch (error) {
          console.error("Erreur de recuperation:", error);
        }
      } else {
        // Si le mot existe déjà
        this.$emit("word-ready", storedWord);
      }
    },
  },
};
</script>
