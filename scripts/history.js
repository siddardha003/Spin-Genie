document.addEventListener('DOMContentLoaded', function() {    // DOM Elements
    const historyList = document.getElementById('historyList');
    const backBtn = document.getElementById('back-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Initialize
    function init() {
        loadHistory();
        setupEventListeners();
    }

    // Load and display history
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('wheelHistory')) || [];
        
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history">No spin history yet</div>';
            return;
        }
        
        historyList.innerHTML = '';
        
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            historyItem.innerHTML = `
                <div class="history-option">${item.option}</div>
                <div class="history-date">${formattedDate}</div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }

    // Clear all history
    function clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            localStorage.removeItem('wheelHistory');
            loadHistory();
        }
    }

    // Event Listeners
    function setupEventListeners() {
        backBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
        
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

    // Initialize the page
    init();
});