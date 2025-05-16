document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const promptDisplay = document.getElementById('promptDisplay');

    let isSpinning = false;
    let currentRotation = 0;

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;

        isSpinning = true;
        spinButton.disabled = true;
        promptDisplay.textContent = "Spinning...";

        // Calculate a random spin
        const randomIndex = Math.floor(Math.random() * allPrompts.length);
        const selectedPrompt = allPrompts[randomIndex];

        // Spin animation:
        // Each segment is 360 / number of segments. We want to land on a segment.
        // For simplicity, we'll just spin a random number of full rotations + a target angle.
        const randomRotations = Math.floor(Math.random() * 5) + 5; // 5 to 9 full rotations
        const targetAngle = (randomIndex / allPrompts.length) * 360; // Approximate angle for the segment
        const totalRotation = (randomRotations * 360) + targetAngle;

        // Add to current rotation to make spins cumulative (visually)
        currentRotation += totalRotation;
        
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        // After the spin animation finishes (CSS transition duration is 4s)
        setTimeout(() => {
            promptDisplay.textContent = selectedPrompt;
            isSpinning = false;
            spinButton.disabled = false;
            // Optional: Reset wheel to a base position or keep it at the landed spot
            // To make it look like it 'landed' on a segment, you might adjust the final degrees
            // This simple version just stops the visual spin.
        }, 4000); // Match CSS transition time
    });
});
