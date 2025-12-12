let confessions = [];
let displayedCount = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadConfessions();
    setupInfiniteScroll();
    setupFormHandler();
});

// Load confessions from API
async function loadConfessions() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const response = await fetch(CONFIG.API_ENDPOINT);

        if (response.ok) {
            const data = await response.json();
            confessions = data.confessions || [];
            
            // Sort by timestamp (newest first)
            confessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else {
            throw new Error(`API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading confessions:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('confessions');
        if (stored) {
            confessions = JSON.parse(stored);
        } else {
            confessions = [];
        }
        showMessage('Could not load confessions. Using local cache.', 'error');
    }

    loading.style.display = 'none';
    displayConfessions();
}

// Display confessions
function displayConfessions() {
    const container = document.getElementById('confessionsList');
    const endIndex = Math.min(displayedCount + CONFIG.CONFESSIONS_PER_PAGE, confessions.length);
    
    if (confessions.length === 0 && displayedCount === 0) {
        container.innerHTML = '<div class="no-confessions">No confessions yet. Be the first to share!</div>';
        return;
    }

    for (let i = displayedCount; i < endIndex; i++) {
        const confession = confessions[i];
        const card = createConfessionCard(confession);
        container.appendChild(card);
    }

    displayedCount = endIndex;

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMore');
    if (displayedCount < confessions.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Create confession card element
function createConfessionCard(confession) {
    const card = document.createElement('div');
    card.className = 'confession-card';
    
    const header = document.createElement('div');
    header.className = 'confession-header';
    
    const author = document.createElement('div');
    author.className = 'confession-author';
    author.textContent = confession.name || 'Anonymous';
    
    const time = document.createElement('div');
    time.className = 'confession-time';
    time.textContent = formatTime(confession.timestamp);
    
    header.appendChild(author);
    header.appendChild(time);
    
    const text = document.createElement('div');
    text.className = 'confession-text';
    text.textContent = confession.text;
    
    card.appendChild(header);
    card.appendChild(text);
    
    return card;
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

// Save confession via API
async function saveConfession(newConfession) {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newConfession.name,
                text: newConfession.text
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Add to local confessions array
            confessions.unshift(data.confession);
            
            // Save to localStorage as backup
            localStorage.setItem('confessions', JSON.stringify(confessions));
            
            return true;
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save confession');
        }
    } catch (error) {
        console.error('Error saving confession:', error);
        
        // Fallback: save to localStorage only
        confessions.unshift(newConfession);
        localStorage.setItem('confessions', JSON.stringify(confessions));
        showMessage('Confession saved locally. Server sync failed.', 'error');
        
        return false;
    }
}

// Setup form handler
function setupFormHandler() {
    const form = document.getElementById('confessionForm');
    const nameInput = document.getElementById('nameInput');
    const confessionInput = document.getElementById('confessionInput');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim() || 'Anonymous';
        const text = confessionInput.value.trim();
        
        if (!text) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        const newConfession = {
            id: Date.now(),
            name: name,
            text: text,
            timestamp: new Date().toISOString()
        };

        // Save via API
        const success = await saveConfession(newConfession);

        // Clear form
        nameInput.value = '';
        confessionInput.value = '';
        
        // Refresh display
        displayedCount = 0;
        document.getElementById('confessionsList').innerHTML = '';
        displayConfessions();

        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Confession';
        
        if (success) {
            showMessage('Your confession has been posted! 🎉', 'success');
        }
    });
}

// Load more button
document.getElementById('loadMore').addEventListener('click', () => {
    displayConfessions();
});

// Infinite scroll
function setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            if (displayedCount < confessions.length) {
                displayConfessions();
            }
        }
    });
}

// Show message to user
function showMessage(message, type = 'success') {
    const container = document.querySelector('.container');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}