let currentPromptIndex = null;
let takeCount = 1;
let isAnimating = false;
let promptHistory = [];

// Create realistic clapper sound effect
function createClapSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Main sharp clap sound
        const createClap = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            // Sharp noise burst
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
            
            // High-pass filter for that crisp sound
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1500, audioContext.currentTime);
            filter.Q.setValueAtTime(0.5, audioContext.currentTime);
            
            // Very sharp attack and quick decay
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.001);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.08);
        };
        
        // Wood knock/thud sound
        const createWoodSound = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.005);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        };
        
        // Play the main clap
        createClap();
        
        // Add the wood thud slightly after
        setTimeout(() => createWoodSound(), 10);
        
        // Add a subtle echo/reverb effect
        setTimeout(() => {
            const echoGain = audioContext.createGain();
            echoGain.gain.setValueAtTime(0.2, audioContext.currentTime);
            createClap();
        }, 25);
        
    } catch (e) {
        console.log('Audio not supported');
    }
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
    clapperTop.classList.add('clapping');
    
    setTimeout(() => {
        clapperTop.classList.remove('clapping');
    }, 1200);
    
    // Generate random prompt
    currentPromptIndex = Math.floor(Math.random() * prompts.length);
    
    setTimeout(() => {
        // Update slate with current take number
        document.getElementById('promptNumber').textContent = currentPromptIndex + 1;
        document.getElementById('takeNumber').textContent = takeCount;
        
        // Add to history using the same take number shown on slate
        promptHistory.push({
            take: takeCount,
            promptNum: currentPromptIndex + 1,
            text: prompts[currentPromptIndex]
        });
        
        // Show prompt (this will now match the slate)
        showCurrentPrompt();
        
        // Update buttons
        document.getElementById('newPromptBtn').textContent = 'Get Another Prompt';
        document.getElementById('historyBtn').style.display = 'inline-block';
        
        // Increment take count AFTER everything is displayed
        takeCount++;
        isAnimating = false;
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
    
    // Use the current take number that matches the slate
    const currentTakeOnSlate = document.getElementById('takeNumber').textContent;
    promptHeader.textContent = `Take ${currentTakeOnSlate} - Prompt #${currentPromptIndex + 1}`;
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
