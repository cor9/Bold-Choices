document.addEventListener('DOMContentLoaded', () => {
  const clapper = document.getElementById('clapper');
  const snapButton = document.getElementById('snapButton');
  const promptDisplay = document.getElementById('promptDisplay');

  function getRandomPrompt() {
    const randomIndex = Math.floor(Math.random() * allPrompts.length);
    const prompt = typeof allPrompts[randomIndex] === 'string'
      ? allPrompts[randomIndex]
      : allPrompts[randomIndex].text;
    return prompt;
  }

  function animateClapper() {
    clapper.classList.add('snap');
    setTimeout(() => clapper.classList.remove('snap'), 300);
  }

  function showPrompt() {
    const prompt = getRandomPrompt();
    promptDisplay.textContent = prompt;
  }

  function playSnap() {
    animateClapper();
    showPrompt();
    playSound();
  }

  clapper.addEventListener('click', playSnap);
  snapButton.addEventListener('click', playSnap);

  function playSound() {
    const audio = new Audio('clap.mp3'); // Optional: drop in a clapper sound
    audio.play();
  }
});
