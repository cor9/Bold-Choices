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

    function playSnapAnimation() {
        clapper.classList.add('snapped');
        setTimeout(() => clapper.classList.remove('snapped'), 600);
    }

    function showPrompt() {
        const prompt = getRandomPrompt();
        promptDisplay.textContent = prompt;
    }

    clapper.addEventListener('click', () => {
        playSnapAnimation();
        showPrompt();
        playSound();
    });

    snapButton.addEventListener('click', () => {
        playSnapAnimation();
        showPrompt();
        playSound();
    });

    function playSound() {
        const audio = new Audio('clap.mp3'); // Add a real clapper sound file
        audio.play();
    }
});
