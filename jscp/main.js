let isLandscape = false;
let matrixInterval = null;
const confettiPool = [];
const maxConfetti = 50;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let isSurpriseStarted = false; 

// =====================================
// 🎯 1. Orientation & Start Logic
// =====================================

function checkOrientation() {
    const orientationLock = document.getElementById('orientation-lock');
    const rotateMessage = document.getElementById('rotateMessage');
    const startBtn = document.getElementById('startSurpriseBtn');
    
    if (!isMobile) {
        // Desktop: সরাসরি Start Button দেখাবে
        isLandscape = true;
        if(rotateMessage) rotateMessage.style.display = 'none';
        if(startBtn) startBtn.style.display = 'block';
    } else {
        // Mobile: ল্যান্ডস্কেপ চেক করবে
        const checkLandscape = () => {
            isLandscape = window.innerWidth > window.innerHeight;
            
            if (isLandscape) {
                if (!isSurpriseStarted) {
                    if(rotateMessage) rotateMessage.style.display = 'none';
                    if(startBtn) startBtn.style.display = 'block';
                } else {
                    orientationLock.style.display = 'none';
                }
            } else {
                orientationLock.style.display = 'flex';
                if(rotateMessage) rotateMessage.style.display = 'block';
                if(startBtn) startBtn.style.display = 'none';
            }
        };

        checkLandscape(); // Initial Check
        window.addEventListener('resize', checkLandscape); // On Rotate Check
    }
}

// Start Button Click Event
document.addEventListener('DOMContentLoaded', () => {
    checkOrientation();

    const startBtn = document.getElementById('startSurpriseBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            isSurpriseStarted = true;
            
            // 1. Hide UI
            document.getElementById('orientation-lock').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            document.getElementById('matrix-rain').style.display = 'block';
            document.querySelector('.canvas').style.display = 'block';
            
            // 2. Play Audio (User interaction allows autoplay)
            const birthdayAudio = document.getElementById('birthdayAudio');
            const musicControl = document.getElementById('musicControl');
            if (birthdayAudio) {
                birthdayAudio.play().then(() => {
                    isPlaying = true;
                    if(musicControl) {
                        musicControl.innerHTML = '⏸';
                        musicControl.classList.add('playing');
                    }
                }).catch(e => console.log("Audio play failed:", e));
            }

            // 3. Fullscreen (Optional)
            const elem = document.documentElement;
            if (elem.requestFullscreen) elem.requestFullscreen().catch(e => {});

            // 4. Start Animation
            startWebsite();
            setTimeout(forceResizeMatrix, 100);
        });
    }
});


// =====================================
// ⚙️ 2. Core Website Functions
// =====================================

function forceResizeMatrix() {
    const matrixCanvas = document.getElementById('matrix-rain');
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
        initMatrixRain();
    }
}

function startWebsite() {
    if (!matrixInterval) initMatrixRain();
    if (typeof S !== 'undefined' && S.UI) S.UI.reset(true);
    S.init(); 
    S.initialized = true;
}


// =====================================
// 🌧️ 3. Matrix Rain
// =====================================

let matrixChars = "HAPPYBIRTHDAY".split("");
function initMatrixRain() {
    const matrixCanvas = document.getElementById('matrix-rain');
    if(!matrixCanvas) return;
    const matrixCtx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const fontSize = isMobile ? 13 : 25;
    const intervalTime = isMobile ? 44 : 50; 
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];
    const columnColors = [];
    const delays = [];
    const started = [];
    const maxLength = Math.floor(matrixCanvas.height / fontSize) + 2;

    for (let x = 0; x < columns; x++) {
        drops[x] = 0;
        columnColors[x] = x % 2 === 0 ? (window.settings ? window.settings.matrixColor1 : '#ff69b4') : (window.settings ? window.settings.matrixColor2 : '#ff1493');
        delays[x] = Math.random() * 2000;
        started[x] = false;
    }

    let startTime = Date.now();

    matrixInterval = setInterval(() => {
        matrixCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCtx.font = "bold " + fontSize + "px monospace";
        const currentTime = Date.now();

        for (let i = 0; i < drops.length; i++) {
            if (!started[i] && currentTime - startTime >= delays[i]) started[i] = true;
            if (started[i] && drops[i] < maxLength) {
                const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                matrixCtx.fillStyle = columnColors[i];
                matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            }
            if (started[i]) drops[i]++;
            if (drops[i] >= maxLength) {
                drops[i] = 0; delays[i] = Math.random() * 1000; started[i] = false;
            }
        }
    }, intervalTime);

    window.addEventListener('resize', forceResizeMatrix);
}


// =====================================
// ✨ 4. Animation Logic (S Object)
// =====================================

S = {
    initialized: false,
    init: function () {
        const currentSettings = window.settings || {};
        const countdownValue = currentSettings.countdown || 3;
        const sequenceText = currentSettings.sequence || 'HAPPY|BIRTHDAY|ZAHRA|❤';
        const sequence = `|#countdown ${countdownValue}|${sequenceText}|#gift|`;
        
        S.UI.simulate(sequence);
        S.Drawing.init('.canvas');
        document.body.classList.add('body--ready');
        S.Drawing.loop(function () { S.Shape.render(); });
    }
};

S.Drawing = (function () {
    var canvas, context, renderFn;
    return {
        init: function (el) {
            canvas = document.querySelector(el);
            if(!canvas) return;
            context = canvas.getContext('2d');
            this.adjustCanvas();
            window.addEventListener('resize', () => this.adjustCanvas());
        },
        loop: function (fn) {
            renderFn = fn;
            context.clearRect(0, 0, canvas.width, canvas.height);
            renderFn();
            requestAnimationFrame(this.loop.bind(this, fn));
        },
        adjustCanvas: function () {
            if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        },
        getArea: function () {
            return { w: canvas.width, h: canvas.height };
        },
        drawCircle: function (p, c) {
            context.fillStyle = c.render();
            context.beginPath();
            context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
            context.fill();
        }
    };
}());

S.UI = (function () {
    var interval, sequence = [];
    return {
        simulate: function (action) {
            sequence = action.split('|');
            function nextAction() {
                if(sequence.length === 0) return;
                const current = sequence.shift();
                
                if(current.startsWith('#countdown')) {
                    let count = parseInt(current.split(' ')[1]);
                    interval = setInterval(() => {
                        if(count > 0) { S.Shape.switchShape(S.ShapeBuilder.letter(count.toString()), true); count--; }
                        else { clearInterval(interval); nextAction(); }
                    }, 1200);
                } else if(current === '#gift') {
                    showStars(); showFloatingHearts(); showBook();
                } else {
                    S.Shape.switchShape(S.ShapeBuilder.letter(current));
                    setTimeout(nextAction, 2000);
                }
            }
            nextAction();
        },
        reset: function () { clearInterval(interval); sequence = []; }
    };
}());

// ... [বাকি Shape, Dot, এবং Book এর কোডগুলো আগের মতোই থাকবে] ...
// (আগের main.js এর নিচের অংশের কোডগুলো (S.ShapeBuilder, Book logic, Music Toggle) এখানে যোগ করে দিবেন)