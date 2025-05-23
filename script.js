let currentPromptIndex = null;
let takeCount = 1;
let isAnimating = false;
let promptHistory = [];

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
    const promptDisplay = document.getElementById('promptDisplay');
    
    // Hide prompt display
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
        // Update slate with current take number
        document.getElementById('promptNumber').textContent = currentPromptIndex + 1;
        document.getElementById('takeNumber').textContent = takeCount;
        
        // Add to history
        promptHistory.push({
            take: takeCount,
            promptNum: currentPromptIndex + 1,
            text: prompts[currentPromptIndex]
        });
        
        // Show prompt
        showCurrentPrompt();
        
        // Update buttons
        document.getElementById('newPromptBtn').textContent = 'Get Another Prompt';
        document.getElementById('historyBtn').style.display = 'inline-block';
        
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
    
    promptHeader.textContent = `Take ${takeCount - 1} - Prompt #${currentPromptIndex + 1}`;
    promptText.textContent = prompts[currentPromptIndex];
    
    promptDisplay.classList.add('show');
    promptDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleHistory() {
    const historyDisplay = document.getElementById('historyDisplay');
    const historyBtn = document.getElementById('historyBtn');
    
    if (historyDisplay.classList.contains('show')) {
        historyDisplay.classList.remove('show');
        historyBtn.textContent = 'Show History';
    } else {
        updateHistoryDisplay();
        historyDisplay.classList.add('show');
        historyBtn.textContent = 'Hide History';
        historyDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (promptHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">No prompts yet! Get your first prompt above.</p>';
        return;
    }
    
    // Show most recent first
    promptHistory.slice().reverse().forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.onclick = () => selectHistoryItem(item);
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-take">Take ${item.take}</span>
                <span class="history-prompt-num">Prompt #${item.promptNum}</span>
            </div>
            <div class="history-text">${item.text}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function selectHistoryItem(item) {
    const promptDisplay = document.getElementById('promptDisplay');
    const promptHeader = document.getElementById('promptHeader');
    const promptText = document.getElementById('promptText');
    
    promptHeader.textContent = `Take ${item.take} - Prompt #${item.promptNum}`;
    promptText.textContent = item.text;
    
    promptDisplay.classList.add('show');
    
    // Hide history
    document.getElementById('historyDisplay').classList.remove('show');
    document.getElementById('historyBtn').textContent = 'Show History';
    
    promptDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearHistory() {
    promptHistory = [];
    updateHistoryDisplay();
}

// Add click event to clapper
document.getElementById('clapperTop').addEventListener('click', getNewPrompt);
