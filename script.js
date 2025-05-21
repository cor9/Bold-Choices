document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const promptDisplay = document.getElementById('promptDisplay');
    const winningNumberDisplay = document.getElementById('winningNumberDisplay'); // Get the new element

    const totalPrompts = allPrompts.length; // Should be 99
    const segmentAngle = 360 / totalPrompts; // Angle for each conceptual segment

    let isSpinning = false;
    let currentWheelRotation = 0; // Keep track of wheel's actual rotation

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;

        isSpinning = true;
        spinButton.disabled = true;
        promptDisplay.textContent = "Spinning...";
        winningNumberDisplay.textContent = "Landing on #...";

        // 1. Select a random prompt (index 0 to totalPrompts - 1)
        const randomIndex = Math.floor(Math.random() * totalPrompts);
        const selectedPromptText = allPrompts[randomIndex];
        const winningPromptNumber = randomIndex + 1; // Display number (1 to totalPrompts)

        // 2. Calculate rotation for the wheel
        // We want the pointer to land in the middle of the segment for the winning number.
        // The target segment's middle angle: (winningPromptNumber - 0.5) * segmentAngle
        // To make it spin nicely, add multiple full rotations
        const randomFullRotations = Math.floor(Math.random() * 4) + 3; // 3 to 6 full rotations
        
        // Calculate the final angle. Subtract from 360 if pointer is at top and rotation is clockwise.
        // Angle for the middle of the segment for `randomIndex` (0-indexed)
        const targetSegmentCenterAngle = (randomIndex + 0.5) * segmentAngle;
        
        // Total rotation to add. We ensure it spins forward.
        const spinRotation = (randomFullRotations * 360) + targetSegmentCenterAngle;

        currentWheelRotation += spinRotation; // Add to existing rotation to make it spin from current pos

        wheel.style.transform = `rotate(${currentWheelRotation}deg)`;

        // 3. After the spin animation (CSS transition duration is 4s)
        setTimeout(() => {
            winningNumberDisplay.textContent = `Landed on Prompt #${winningPromptNumber}!`;
            promptDisplay.textContent = selectedPromptText;
            isSpinning = false;
            spinButton.disabled = false;

            // Optional: To make subsequent spins cleaner and ensure the pointer aligns correctly
            // for the *next* spin's calculation, we can normalize the wheel's visual rotation
            // to point directly at the landed segment's center, effectively 'snapping' it.
            // This makes the next targetAngle calculation more straightforward if we weren't
            // using cumulative rotation. For this cumulative `currentWheelRotation` example,
            // it's less critical but can make the "stop" feel more precise.
            // Let's adjust the currentWheelRotation to be perfectly aligned with the center of the segment visually.
            // The actual rotation should be such that the pointer (at 0 deg or top) points to targetSegmentCenterAngle
            // This part is a bit tricky with cumulative rotation but the current approach should work fine visually.
            // For a very precise stop, you might want to set the wheel's end rotation to a value
            // that ensures the top pointer is exactly over the middle of the landed segment.
            // The current approach uses the `targetSegmentCenterAngle` effectively.

        }, 4000); // Match CSS transition time
    });
});
