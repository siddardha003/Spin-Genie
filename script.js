document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startBtn = document.getElementById('start-btn');
    const historyBtn = document.getElementById('history-btn');
    
    // Event Listeners
    startBtn.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Get position of click
        const x = event.clientX - event.target.getBoundingClientRect().left;
        const y = event.clientY - event.target.getBoundingClientRect().top;
        
        // Position the ripple
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
            // Navigate to wheel page
            window.location.href = 'pages/wheel.html';
        }, 500);
    });
    
    historyBtn.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Get position of click
        const x = event.clientX - event.target.getBoundingClientRect().left;
        const y = event.clientY - event.target.getBoundingClientRect().top;
        
        // Position the ripple
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
            // Navigate to history page
            window.location.href = 'history.html';
        }, 500);
    });
    
    // Add CSS for ripple effect dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});