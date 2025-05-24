function updateUsageDisplay() {
    const usageEl = document.getElementById('usageDisplay');
    if (!usageEl) return;
    
    checkTrialStatus(); // Always check trial status
    
    if (isPremium) {
        if (trialEnd) {
            const daysLeft = Math.ceil((new Date(trialEnd) - new Date()) / (1000 * 60 * 60 * 24));
            usageEl.innerHTML = `🎉 <strong>Premium Trial</strong> - ${daysLeft} days left!`;
        } else {
            usageEl.innerHTML = '✨ <strong>Premium Member</strong> - Unlimited prompts!';
        }let currentPromptIndex = null;
let takeCount = 1;
let isAnimating = false;
let promptHistory = [];

// Monetization variables
let dailyPrompts = parseInt(localStorage.getItem('dailyPrompts') || '0');
let lastDate = localStorage.getItem('lastDate') || new Date().toDateString();
let isPremium = localStorage.getItem('isPremium') === 'true';
let trialEnd = localStorage.getItem('trialEnd');

// Check if trial has expired
function checkTrialStatus() {
    if (trialEnd) {
        const now = new Date();
        const trial = new Date(trialEnd);
        if (now > trial) {
            // Trial expired
            localStorage.setItem('isPremium', 'false');
            localStorage.removeItem('trialEnd');
            isPremium = false;
        }
    }
}

function checkDailyLimit() {
    checkTrialStatus(); // Check trial status first
    
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


function initiatePurchase() {
    window.open('https://buy.stripe.com/9B614ndWv8HJaUJa4q2wU3l', '_blank');
}

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
    
    if (!checkDailyLimit()) {
        showUpgradeModal();
        return;
    }
    
    isAnimating = true;
    const clapperTop = document.getElementById('clapperTop');
    const promptDisplay = document.getElementById('promptDisplay');
    
    promptDisplay.classList.remove('show');
    
    try {
        createClapSound();
    } catch (e) {
        console.log('Audio not supported');
    }
    
    clapperTop.classList.add('clapping');
    
    setTimeout(() => {
        clapperTop.classList.remove('clapping');
    }, 1500);
    
    currentPromptIndex = Math.floor(Math.random() * prompts.length);
    
    setTimeout(() => {
        document.getElementById('promptNumber').textContent = currentPromptIndex + 1;
        document.getElementById('takeNumber').textContent = takeCount;
        
        promptHistory.push({
            take: takeCount,
            promptNum: currentPromptIndex + 1,
            text: prompts[currentPromptIndex]
        });
        
        if (!isPremium) {
            dailyPrompts++;
            localStorage.setItem('dailyPrompts', dailyPrompts.toString());
        }
        
        showCurrentPrompt();
        
        document.getElementById('newPromptBtn').textContent = 'Get Another Prompt';
        document.getElementById('historyBtn').style.display = 'inline-block';
        updateUsageDisplay();
        
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
    
    promptHistory.slice().reverse().forEach((item) => {
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
    
    document.getElementById('historyDisplay').classList.remove('show');
    document.getElementById('historyBtn').textContent = 'Show History';
    
    promptDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearHistory() {
    promptHistory = [];
    updateHistoryDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    updateUsageDisplay();
});

document.getElementById('clapperTop').addEventListener('click', getNewPrompt);
