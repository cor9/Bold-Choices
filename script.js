let currentPromptIndex = null;
let takeCount = 1;
let isAnimating = false;

// Create clap sound effect
function createClapSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a sharp, snappy sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const noiseSource = audioContext.createBufferSource();
    
    // Generate white noise for the clap
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    noiseSource.buffer = noiseBuffer;
    
    // Create sharp attack and quick decay
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // Connect the nodes
    noiseSource.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play the sound
    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 0.1);
}

function getNewPrompt() {
    if (isAnimating) return;
    
    isAnimating = true;
    const clapperTop = document.getElementById('clapperTop');
    const clickInstruction = document.getElementById('clickInstruction');
    const promptDisplay = document.getElementById('promptDisplay');
    
    // Hide instruction and prompt display
    clickInstruction.style.display = 'none';
    promptDisplay.classList.remove('show');
    
    // Play clap sound
    try {
        createClapSound();
    } catch (e) {
        console.log('Audio not supported');
    }
    
    // Trigger clapper animation
    clapperTop.classList.add('clapped');
    
    // Generate random prompt
    currentPromptIndex = Math.floor(Math.random() * prompts.length);
    
    setTimeout(() => {
        // Update slate
        document.getElementById('promptNumber').textContent = currentPromptIndex + 1;
        document.getElementById('takeNumber').textContent = takeCount;
        
        // Show prompt
        showCurrentPrompt();
        
        // Update buttons
        document.getElementById('newPromptBtn').textContent = 'Get Another Prompt';
        document.getElementById('showPromptBtn').style.display = 'inline-block';
        
        takeCount++;
        isAnimating = false;
        
        // Reset clapper after animation
        setTimeout(() => {
            clapperTop.classList.remove('clapped');
        }, 200);
    }, 800);
}

function showCurrentPrompt() {
    if (currentPromptIndex === null) {
        getNewPrompt();
        return;
    }
    
    const promptDisplay = document.getElementById('promptDisplay');
    const promptHeader = document.getElementById('promptHeader');
    const promptText = document.getElementById('promptText');
    
    promptHeader.textContent = `Prompt #${currentPromptIndex + 1}`;
    promptText.textContent = prompts[currentPromptIndex];
    
    promptDisplay.classList.add('show');
    promptDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add click event to clapper
document.getElementById('clapperTop').addEventListener('click', getNewPrompt);
