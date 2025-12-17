export async function getWordleWord() {
  const storedWord = localStorage.getItem("wordleWord");

  // Si déjà en cache
  if (storedWord) {
    return storedWord;
  }

  try {
    const response = await fetch("https://trouve-mot.fr/api/size/5");
    const data = await response.json();

    const word = data[0].name;

    localStorage.setItem("wordleWord", word);

    return word;
  } catch (error) {
    console.error("Erreur de récupération du mot :", error);
    throw error;
  }
}
