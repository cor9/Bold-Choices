let currentPromptIndex = null;
let takeCount = 1;
let isAnimating = false;
let promptHistory = [];

// Monetization variables
let dailyPrompts = parseInt(localStorage.getItem('dailyPrompts') || '0');
let lastDate = localStorage.getItem('lastDate') || new Date().toDateString();
let isPremium = localStorage.getItem('isPremium') === 'true';

function checkDailyLimit() {
    const today = new Date().toDateString();
    if (lastDate !== today) {
        dailyPrompts = 0;
        localStorage.setItem('dailyPrompts', '0');
        localStorage.setItem('lastDate', today);
        lastDate = today;
    }
    return isPremium || dailyPrompts < 3;
}

function updateUsageDisplay() {
    const usageEl = document.getElementById('usageDisplay');
    if (!usageEl) return;
    
    if (isPremium) {
        usageEl.innerHTML = '✨ <strong>Premium Member</strong> - Unlimited prompts!';
        usageEl.className = 'usage-display premium';
    } else {
        const remaining = 3 - dailyPrompts;
        usageEl.innerHTML = `Free prompts remaining today: <strong>${remaining}</strong>`;
        usageEl.className = 'usage-display free';
        
        if (remaining === 0) {
            usageEl.innerHTML = '❌ <strong>Daily limit reached!</strong> Upgrade for unlimited prompts.';
            usageEl.className = 'usage-display limit-reached';
        }
    }
}

function showUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'flex';
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'none';
}

function activateDemo() {
    // 7-day premium trial
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    localStorage.setItem('trialEnd', trialEnd.toISOString());
    localStorage.setItem('isPremium', 'true');
    isPremium = true;
    updateUsageDisplay();
    closeUpgradeModal();
    alert('🎉 7-day Premium trial activated! Enjoy unlimited prompts!');
}

function initiatePurchase() {
    // Replace with your actual payment link
    window.open('.usage-container {
    margin: 30px 0;
    text-align: center;
}

.usage-display {
    padding: 15px 25px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 16px;
}

.usage-display.free {
    background: rgba(244, 228, 166, 0.2);
    border: 1px solid #f4e4a6;
    color: #f4e4a6;
}

.usage-display.premium {
    background: rgba(139, 90, 107, 0.2);
    border: 1px solid #8b5a6b;
    color: #f4e4a6;
}

.usage-display.limit-reached {
    background: rgba(220, 53, 69, 0.2);
    border: 1px solid #dc3545;
    color: #ff6b6b;
}

.premium-button {
    background: linear-gradient(135deg, #8b5a6b, #1e3a5f);
    color: #ffffff;
    border: none;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(139, 90, 107, 0.3);
}

.premium-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 90, 107, 0.4);
}

.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #2a2a2a;
    margin: auto;
    padding: 40px;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    color: white;
    text-align: center;
    border: 2px solid #f4e4a6;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    margin-top: -10px;
}

.close:hover {
    color: #f4e4a6;
}

.pricing-card {
    background: rgba(139, 90, 107, 0.1);
    padding: 30px;
    border-radius: 12px;
    margin: 25px 0;
    border: 1px solid rgba(244, 228, 166, 0.2);
}

.pricing-card h3 {
    color: #f4e4a6;
    font-size: 24px;
    margin-bottom: 15px;
}

.price {
    font-size: 3em;
    color: #f4e4a6;
    font-weight: bold;
    margin: 20px 0;
}

.price span {
    font-size: 0.4em;
    color: #ccc;
}

.pricing-card ul {
    text-align: left;
    list-style: none;
    padding: 0;
    margin: 25px 0;
}

.pricing-card li {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.subscribe-button {
    background: linear-gradient(135deg, #8b5a6b, #1e3a5f);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    margin-top: 15px;
    transition: all 0.3s ease;
}

.subscribe-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 90, 107, 0.4);
}

.trial-button {
    background: transparent;
    color: #f4e4a6;
    border: 1px solid #f4e4a6;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.trial-button:hover {
    background: #f4e4a6;
    color: #2a2a2a;
}

.demo-option {
    margin-top: 20px;
    font-size: 14px;
    color: #ccc;
}');
}

// Use your actual clapperboard.mp3 file
function createClapSound() {
    try {
        const audio = new Audio('Clapperboard.mp3');
        audio.volume = 0.7;
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log('Audio playback failed:', e);
        });
    } catch (e) {
        console.log('Audio not supported:', e);
    }
}

function getNewPrompt() {
    if (isAnimating) return;
    
    // Check usage limits
    if (!checkDailyLimit()) {
        showUpgradeModal();
        return;
    }
    
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
    }, 1500);
    
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
        
        // Track usage for free users
        if (!isPremium) {
            dailyPrompts++;
            localStorage.setItem('dailyPrompts', dailyPrompts.toString());
        }
        
        // Show prompt (this will now match the slate)
        showCurrentPrompt();
        
        // Update buttons and usage display
        document.getElementById('newPromptBtn').textContent = 'Get Another Prompt';
        document.getElementById('historyBtn').style.display = 'inline-block';
        updateUsageDisplay();
        
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

// Initialize usage display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateUsageDisplay();
});

// Add click event to clapper
document.getElementById('clapperTop').addEventListener('click', getNewPrompt);
