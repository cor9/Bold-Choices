document.addEventListener('DOMContentLoaded', () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const wheelGroup = document.getElementById('wheelGroup');
    const spinButton = document.getElementById('spinButton');
    const promptDisplay = document.getElementById('promptDisplay');
    const winningNumberDisplay = document.getElementById('winningNumberDisplay');

    const totalSegments = allPrompts.length; // Should be 99
    const centerX = 150;
    const centerY = 150;
    const radius = 140; // Slightly less than half of viewBox to fit
    const segmentAngleDegrees = 360 / totalSegments;

    const colors = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A", "#B0E0E6", "#DDA0DD", "#F0E68C"]; // Example colors

    // --- Helper function to describe an arc ---
    function describeArc(x, y, radius, startAngleDeg, endAngleDeg) {
        const startAngleRad = (startAngleDeg - 90) * Math.PI / 180; // Offset by -90 to start at 12 o'clock
        const endAngleRad = (endAngleDeg - 90) * Math.PI / 180;

        const startX = x + radius * Math.cos(startAngleRad);
        const startY = y + radius * Math.sin(startAngleRad);
        const endX = x + radius * Math.cos(endAngleRad);
        const endY = y + radius * Math.sin(endAngleRad);

        const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? "0" : "1";
        const sweepFlag = "1"; // Draw clockwise

        return `M ${x} ${y} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} Z`;
    }

    // --- Helper function to get text position ---
    function getTextPosition(x, y, radius, angleDeg) {
        const angleRad = (angleDeg - 90) * Math.PI / 180; // Offset by -90
        // Position text slightly inwards from the main radius
        const textRadius = radius * 0.75;
        return {
            x: x + textRadius * Math.cos(angleRad),
            y: y + textRadius * Math.sin(angleRad),
            rotation: angleDeg // For rotating text with the segment
        };
    }


    // --- Generate Wheel Segments and Labels ---
    for (let i = 0; i < totalSegments; i++) {
        const startAngle = i * segmentAngleDegrees;
        const endAngle = (i + 1) * segmentAngleDegrees;

        // Create Path
        const path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "d", describeArc(centerX, centerY, radius, startAngle, endAngle));
        path.setAttributeNS(null, "fill", colors[i % colors.length]);
        wheelGroup.appendChild(path);

        // Create Text Label
        const midAngle = startAngle + (segmentAngleDegrees / 2);
        const textPos = getTextPosition(centerX, centerY, radius, midAngle);
        const text = document.createElementNS(svgNS, "text");
        text.setAttributeNS(null, "x", textPos.x);
        text.setAttributeNS(null, "y", textPos.y);
        // Optional: Rotate text to align with segment (can make it hard to read if many segments)
        // text.setAttributeNS(null, "transform", `rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`);
        text.textContent = i + 1;
        wheelGroup.appendChild(text);
    }

    let isSpinning = false;
    let currentRotationDeg = 0; // Keep track of the wheel's logical rotation

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;

        isSpinning = true;
        spinButton.disabled = true;
        promptDisplay.textContent = "Spinning...";
        winningNumberDisplay.textContent = "Landing on #...";

        const randomIndex = Math.floor(Math.random() * totalSegments);
        const winningPromptNumber = randomIndex + 1;
        const selectedPromptText = allPrompts[randomIndex];

        // Calculate rotation to bring the middle of the (randomIndex)th segment to the top (under the pointer)
        // The top is effectively 0 degrees in this visual setup once offset.
        // Each segment's middle is at (index + 0.5) * segmentAngleDegrees.
        // We want this angle to be at the "0" position (top).
        // So, we rotate by -( (randomIndex + 0.5) * segmentAngleDegrees )
        const targetAngleForSegmentCenter = (randomIndex + 0.5) * segmentAngleDegrees;
        
        // How many extra full spins
        const numFullSpins = 5;
        
        // The final rotation value for the CSS transform.
        // We want the segment to land under the pointer (usually at 0 deg or top).
        // If the pointer is at the 12 o'clock position, we want the middle of the target segment to rotate to that position.
        // The SVG group rotates clockwise for positive degrees.
        // To bring segment `randomIndex`'s center to the top (0 deg reference), we need to rotate it by:
        // `-( (randomIndex * segmentAngleDegrees) + (segmentAngleDegrees / 2) )`
        // This aligns the center of segment `randomIndex` with the top pointer.
        const rotationToLand = - ( (randomIndex * segmentAngleDegrees) + (segmentAngleDegrees / 2) );


        // Add full spins and ensure it's a new rotation from a "zeroed" perspective conceptually
        // To avoid issues with cumulative CSS rotations, we calculate the absolute target.
        // However, to make it *spin* more, we add to `currentRotationDeg`.
        const spinAmount = (numFullSpins * 360) + rotationToLand - (currentRotationDeg % 360); // Spin relative to current visual state
        currentRotationDeg += spinAmount;


        wheelGroup.style.transform = `rotate(${currentRotationDeg}deg)`;

        setTimeout(() => {
            winningNumberDisplay.textContent = `You got #${winningPromptNumber}!`;
            promptDisplay.textContent = selectedPromptText;
            
            isSpinning = false;
            spinButton.disabled = false;

            // Optional: Normalize currentRotationDeg to keep it within 0-360 for the next calculation's base if needed
            // currentRotationDeg = currentRotationDeg % 360; // This might be needed if not calculating absolute target for spinAmount

        }, 5000); // Match CSS transition duration (5s)
    });
});
