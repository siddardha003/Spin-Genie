document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const optionInput = document.getElementById('optionInput');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const optionsList = document.getElementById('optionsList');
    const spinWheelBtn = document.getElementById('spinWheelBtn');
    const clearOptionsBtn = document.getElementById('clearOptionsBtn');
    const resultDisplay = document.getElementById('result').querySelector('p');
    const backBtn = document.getElementById('back-btn');
    const spinSound = document.getElementById('spinSound');
    const winSound = document.getElementById('winSound');

    // Wheel Configuration
    const segmentColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC24A', '#FF5722'
    ];
    
    // App State
    let options = JSON.parse(localStorage.getItem('wheelOptions')) || [];
    let isSpinning = false;
    let currentRotation = 0;
    let spinAnimationId;
    const pointerOffset = Math.PI / 2;
    // Initialize
    function init() {
        renderOptionsList();
        drawWheel();
        setupEventListeners();
    }

    // Draw Wheel Function
    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (options.length === 0) {
            drawEmptyWheel(centerX, centerY, radius);
            return;
        }
        
        drawWheelSegments(centerX, centerY, radius);
    }

    function drawEmptyWheel(centerX, centerY, radius) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f1f2f6';
        ctx.fill();
        ctx.strokeStyle = '#dfe6e9';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fillStyle = '#a4b0be';
        ctx.font = '16px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('Add options to begin', centerX, centerY);
    }

    function drawWheelSegments(centerX, centerY, radius) {
        const segmentAngle = (2 * Math.PI) / options.length;
        
        options.forEach((option, index) => {
            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, 
                   segmentAngle * index + currentRotation - pointerOffset, 
                   segmentAngle * (index + 1) + currentRotation - pointerOffset);
            ctx.closePath();
            ctx.fillStyle = segmentColors[index % segmentColors.length];
            ctx.fill();
            
            // Draw segment border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw text
            drawSegmentText(option, centerX, centerY, radius, segmentAngle, index);
        });
    }

    function drawSegmentText(option, centerX, centerY, radius, segmentAngle, index) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(segmentAngle * index + segmentAngle/2 + currentRotation - pointerOffset);
        
        // Adjust font size based on option length
        const fontSize = Math.min(14, 200 / option.length);
        ctx.font = `${fontSize}px Poppins`;
        
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        
        // Truncate long text
        const displayText = option.length > 15 ? 
            option.substring(0, 12) + '...' : option;
        
        ctx.fillText(displayText, radius - 20, 5);
        ctx.restore();
    }

    // Option Management
    function addOption() {
        const option = optionInput.value.trim();
        if (option && !options.includes(option)) {
            options.push(option);
            optionInput.value = '';
            saveOptions();
            renderOptionsList();
            drawWheel();
            optionInput.focus();
        }
    }

    function removeOption(index) {
        options.splice(index, 1);
        saveOptions();
        renderOptionsList();
        drawWheel();
    }

    function saveOptions() {
        localStorage.setItem('wheelOptions', JSON.stringify(options));
    }

    function renderOptionsList() {
        optionsList.innerHTML = '';
        
        if (options.length === 0) {
            optionsList.innerHTML = '<li class="empty-state">No options added yet</li>';
            spinWheelBtn.disabled = true;
            return;
        }
        
        spinWheelBtn.disabled = false;
        
        options.forEach((option, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${option}</span>
                <button class="remove-btn" data-index="${index}">×</button>
            `;
            optionsList.appendChild(li);
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                removeOption(parseInt(this.dataset.index));
            });
        });
    }

    // Wheel Spinning Logic
    function spinWheel() {
        if (isSpinning || options.length < 2) return;
        
        isSpinning = true;
        resultDisplay.innerHTML = 'Spinning...';
        spinSound.currentTime = 0;
        spinSound.play();
        
        const spinDuration = 3000 + Math.random() * 2000;
        const rotations = 5 + Math.random() * 3; // 5-8 full rotations
        const targetRotation = currentRotation + rotations * 2 * Math.PI;
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            const easeProgress = easeOutCubic(progress);
            
            currentRotation = easeProgress * targetRotation;
            drawWheel();
            
            if (progress < 1) {
                spinAnimationId = requestAnimationFrame(animate);
            } else {
                finishSpin();
            }
        }
        
        animate();
    }

    function finishSpin() {
        isSpinning = false;
        cancelAnimationFrame(spinAnimationId);
        winSound.currentTime = 0;
        winSound.play();
        
        const winner = determineWinner();
        resultDisplay.innerHTML = `Selected Option: <strong>${winner}</strong>`;
        addToHistory(winner);
    }

function determineWinner() {
    const normalizedRotation = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const segmentAngle = (2 * Math.PI) / options.length;

    // Since the pointer is at 0 degrees (top of the wheel), adjust accordingly
    const pointerAngle = (Math.PI * 2 - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);

    const winningIndex = Math.floor(pointerAngle / segmentAngle) % options.length;
    return options[winningIndex];
}


    function addToHistory(winner) {
        const history = JSON.parse(localStorage.getItem('wheelHistory')) || [];
        history.unshift({
            option: winner,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('wheelHistory', JSON.stringify(history));
    }

    function clearOptions() {
        if (options.length > 0 && confirm('Are you sure you want to clear all options?')) {
            options = [];
            saveOptions();
            renderOptionsList();
            drawWheel();
            resultDisplay.innerHTML = 'Add options and spin the wheel!';
        }
    }

    // Helper Functions
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Event Listeners
    function setupEventListeners() {
        addOptionBtn.addEventListener('click', addOption);
        optionInput.addEventListener('keypress', (e) => e.key === 'Enter' && addOption());
        spinWheelBtn.addEventListener('click', spinWheel);
        clearOptionsBtn.addEventListener('click', clearOptions);
        backBtn.addEventListener('click', () => window.location.href = '../index.html');
        
        // Disable spin button if not enough options
        spinWheelBtn.disabled = options.length < 2;
    }

    // Initialize App
    init();
});