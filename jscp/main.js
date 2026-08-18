// ==========================================================
// 🚀 MAIN SURPRISE ENGINE (Fixed & Fully Optimized)
// ==========================================================

let isLandscape = false;
let matrixInterval = null;
let hasSurpriseStarted = false; 
const confettiPool = [];
const maxConfetti = 50;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function createConfetti() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    return confetti;
}

function getConfettiFromPool() {
    if (confettiPool.length > 0) return confettiPool.pop();
    return createConfetti();
}

function forceResizeMatrix() {
    const matrixCanvas = document.getElementById('matrix-rain');
    if (matrixCanvas) {
        matrixCanvas.width = window.innerWidth * 1.2;
        matrixCanvas.height = window.innerHeight * 1.2;
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
        initMatrixRain();
    }
}

function returnConfettiToPool(confetti) {
    confetti.remove();
    confettiPool.push(confetti);
}

function requestAutoFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) { 
            elem.webkitRequestFullscreen();
        }
    }
}

// 📱 স্ক্রিন ওরিয়েন্টেশন ও ডিসপ্লে হ্যান্ডলার
function checkOrientation() {
    const orientationLock = document.getElementById('orientation-lock');
    const startScreen = document.getElementById('start-screen');

    function handleState(landscape) {
        isLandscape = landscape;
        if (isLandscape) {
            if (orientationLock) orientationLock.style.display = 'none';
            if (!hasSurpriseStarted && startScreen) {
                startScreen.style.display = 'flex';
            }
            setTimeout(forceResizeMatrix, 150);
        } else {
            if (orientationLock) orientationLock.style.display = 'flex';
            if (startScreen) startScreen.style.display = 'none';
            stopWebsite();
        }
    }

    if (!isMobile) {
        handleState(true);
    } else {
        const isLandscapeNow = () => window.innerWidth > window.innerHeight;
        handleState(isLandscapeNow());

        window.addEventListener('resize', () => handleState(isLandscapeNow()));
        window.addEventListener('orientationchange', () => setTimeout(() => handleState(isLandscapeNow()), 200));
    }
}

function stopWebsite() {
    if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
        const matrixCanvas = document.getElementById('matrix-rain');
        if (matrixCanvas) {
            const matrixCtx = matrixCanvas.getContext('2d');
            matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        }
    }
}

// 🌧️ ম্যাট্রিক্স রেইন অ্যানিমেশন
let matrixChars = "HAPPYBIRTHDAY".split("");
function initMatrixRain() {
    const matrixCanvas = document.getElementById('matrix-rain');
    if (!matrixCanvas) return;
    const matrixCtx = matrixCanvas.getContext('2d');

    matrixCanvas.width = window.innerWidth * 1.2;
    matrixCanvas.height = window.innerHeight * 1.2;

    const fontSize = isMobile ? 13 : 25;
    const intervalTime = isMobile ? 44 : 50; 
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];
    const columnColors = [];
    const delays = [];
    const started = [];
    const maxLength = Math.floor(matrixCanvas.height / fontSize) + 10;

    for (let x = 0; x < columns; x++) {
        drops[x] = 0;
        columnColors[x] = x % 2 === 0 ?
            (window.settings ? window.settings.matrixColor1 : '#ff69b4') :
            (window.settings ? window.settings.matrixColor2 : '#ff1493');
        delays[x] = Math.random() * 2000;
        started[x] = false;
    }

    let startTime = Date.now();

    function drawMatrixRain() {
        matrixCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCtx.font = "bold " + fontSize + "px Menlo, Consolas, monospace";

        const currentTime = Date.now();
        for (let i = 0; i < drops.length; i++) {
            if (!started[i] && currentTime - startTime >= delays[i]) {
                started[i] = true;
            }

            if (started[i] && drops[i] < maxLength) {
                const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                const color = columnColors[i];
                matrixCtx.fillStyle = color;
                matrixCtx.shadowColor = color;
                matrixCtx.shadowBlur = 8;
                matrixCtx.fillText(text, x, y);
                matrixCtx.shadowBlur = 0;
            }

            if (started[i]) drops[i]++;

            if (drops[i] >= maxLength) {
                drops[i] = 0;
                delays[i] = Math.random() * 1000;
                started[i] = false;
            }
        }
    }

    matrixInterval = setInterval(drawMatrixRain, intervalTime);
}

// ==========================================
// 🎯 SMART Effect Sequence Engine
// ==========================================
window.effectQueue = [];

function playMatrixAnimation() {
    const currentSettings = window.settings || {};
    const matrixCanvas = document.getElementById('matrix-rain');
    const mainCanvas = document.querySelector('.canvas');
    
    if (matrixCanvas) matrixCanvas.style.display = 'block';
    if (mainCanvas) mainCanvas.style.display = 'block';

    if (!matrixInterval) initMatrixRain();
    
    if (typeof S !== 'undefined' && S.UI) {
        S.UI.reset(true);
    }
    
    const countdownValue = currentSettings.countdown || 3;
    const sequenceText = currentSettings.sequence || 'HAPPY|BIRTHDAY|❤';
    const sequence = `|#countdown ${countdownValue}|${sequenceText}|#next|`;
    
    S.UI.simulate(sequence);
    S.Drawing.init('.canvas');
    document.body.classList.add('body--ready');
    S.Drawing.loop(function () {
        S.Shape.render();
    });
}

// 🎯 Sequence Controller
window.playNextSequence = function() {
    if (!window.effectQueue || window.effectQueue.length === 0) return;
    
    let nextEffect = window.effectQueue.shift();
    while (nextEffect === 'none' && window.effectQueue.length > 0) {
        nextEffect = window.effectQueue.shift();
    }
    if(!nextEffect || nextEffect === 'none') return;
    
    const mcScreen = document.getElementById('memory-card-screen');
    const innerMcScreen = document.getElementById('inner-memory-screen');
    const noteScreen = document.getElementById('love-note-screen');
    const matrixCanvas = document.getElementById('matrix-rain');
    const mainCanvas = document.querySelector('.canvas');
    const bookContainer = document.querySelector('.book-container');
    const contentDisplay = document.getElementById('contentDisplay');

    if (mcScreen) mcScreen.style.display = 'none';
    if (innerMcScreen) innerMcScreen.style.display = 'none';
    if (noteScreen) noteScreen.style.display = 'none';
    if (matrixCanvas) matrixCanvas.style.display = 'none';
    if (mainCanvas) mainCanvas.style.display = 'none';
    if (bookContainer) {
        bookContainer.style.display = 'none';
        bookContainer.classList.remove('show');
    }
    if (contentDisplay) contentDisplay.classList.remove('show');

    if (nextEffect === 'memory') {
        if (mcScreen) {
            mcScreen.style.display = 'flex';
            const mcTitle = document.getElementById('mcDisplayTitle');
            const currentSettings = window.settings || {};
            const textToType = currentSettings.memoryCard?.title || 'Hyy Baby ❤️';
            
            if (mcTitle) {
                mcTitle.innerHTML = ''; 
                mcTitle.style.borderRight = '2px solid #ff1493'; 
                mcTitle.style.display = 'inline-block'; 
                
                let i = 0;
                function typeWriter() {
                    if (i < textToType.length) {
                        mcTitle.innerHTML = textToType.substring(0, i + 1);
                        i++;
                        setTimeout(typeWriter, 140); 
                    } else {
                        setTimeout(() => { mcTitle.style.borderRight = 'none'; }, 1500);
                    }
                }
                setTimeout(typeWriter, 400);
            }
        } else {
            window.playNextSequence(); 
        }
    } 
    else if (nextEffect === 'matrix') {
        playMatrixAnimation();
    }
    else if (nextEffect === 'book') {
        showBook();
    } 
    else if (nextEffect === 'hearts') {
        startHeartEffect();
    } else {
        window.playNextSequence();
    }
}

// 🎯 স্ক্রিন ১ -> স্ক্রিন ২ -> স্ক্রিন ৩ বাটন লজিক
document.addEventListener('DOMContentLoaded', () => {
    const mcBtn = document.getElementById('mcDisplayBtn');
    const inBtn = document.getElementById('inDisplayBtn');
    const noteBtn = document.getElementById('noteDisplayBtn'); 

    const mcScreen = document.getElementById('memory-card-screen');
    const innerMcScreen = document.getElementById('inner-memory-screen');
    const noteScreen = document.getElementById('love-note-screen');

    if (mcBtn) {
        mcBtn.addEventListener('click', () => {
            if (mcScreen) mcScreen.style.display = 'none';
            if (innerMcScreen) innerMcScreen.style.display = 'flex';
        });
    }

    if (inBtn) {
        inBtn.addEventListener('click', () => {
            if (innerMcScreen) innerMcScreen.style.display = 'none';
            if (noteScreen) noteScreen.style.display = 'flex';
        });
    }

    if (noteBtn) {
        noteBtn.addEventListener('click', () => {
            if (noteScreen) noteScreen.style.display = 'none';
            window.playNextSequence(); 
        });
    }
});

// ==========================================
// 🎨 Shape Drawing & Particle Engine (S)
// ==========================================
S = {
    initialized: false,
    init: function () {
        const currentSettings = window.settings || {};

        if (currentSettings.memoryCard) {
            const mcTitle = document.getElementById('mcDisplayTitle');
            const mcMsg = document.getElementById('mcDisplayMsg');
            const mcBtn = document.getElementById('mcDisplayBtn');
            const mcImg = document.getElementById('mcDisplayImg');
            
            if (mcTitle) mcTitle.textContent = currentSettings.memoryCard.title || 'Hyy Baby ❤️';
            if (mcMsg) mcMsg.textContent = currentSettings.memoryCard.message || '';
            if (mcBtn) mcBtn.textContent = currentSettings.memoryCard.btnText || 'Open Memories ✨';
            
            if (mcImg) {
                const imgUrl = currentSettings.memoryCard.finalImageToShow || currentSettings.memoryCard.image || './gif/anime1.gif';
                mcImg.src = imgUrl;
                mcImg.style.display = 'block';
            }
        }

        if (currentSettings.innerMemory) {
            const inTitle = document.getElementById('inDisplayTitle');
            const inMsg = document.getElementById('inDisplayMsg');
            const inBtn = document.getElementById('inDisplayBtn');
            const inPhotoGrid = document.getElementById('innerPhotoGrid');

            if (inTitle) inTitle.textContent = currentSettings.innerMemory.title || '';
            if (inMsg) inMsg.textContent = currentSettings.innerMemory.message || '';
            if (inBtn) inBtn.textContent = currentSettings.innerMemory.btnText || '';

            if (inPhotoGrid && currentSettings.innerMemory.photos) {
                inPhotoGrid.innerHTML = '';
                currentSettings.innerMemory.photos.forEach((url, index) => {
                    if (url && url.trim() !== '') {
                        const polaroid = document.createElement('div');
                        polaroid.className = 'polaroid';
                        const rotation = index % 2 === 0 ? '3deg' : '-3deg';
                        polaroid.style.transform = `rotate(${rotation})`;
                        polaroid.innerHTML = `<img src="${url}" alt="Memory">`;
                        inPhotoGrid.appendChild(polaroid);
                    }
                });
            }
        }

        if (currentSettings.loveNote) {
            const lLetter = document.getElementById('noteDisplayLetter');
            const lTitle = document.getElementById('noteDisplayTitle');
            const lSub = document.getElementById('noteDisplaySub');
            const lBtn = document.getElementById('noteDisplayBtn');

            if(lLetter) lLetter.textContent = currentSettings.loveNote.letter || '';
            if(lTitle) lTitle.textContent = currentSettings.loveNote.title || '';
            if(lSub) lSub.textContent = currentSettings.loveNote.subText || '';
            if(lBtn) lBtn.textContent = currentSettings.loveNote.btnText || '';
        }
    }
};

S.Drawing = (function () {
    var canvas, context, renderFn,
        requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };

    return {
        init: function (el) {
            canvas = document.querySelector(el);
            if (!canvas) return;
            context = canvas.getContext('2d');
            this.adjustCanvas();
            window.addEventListener('resize', () => this.adjustCanvas());
        },
        loop: function (fn) {
            renderFn = !renderFn ? fn : renderFn;
            this.clearFrame();
            renderFn();
            requestFrame.call(window, this.loop.bind(this));
        },
        adjustCanvas: function () {
            if (!canvas) return;
            canvas.width = window.innerWidth * 1.2;
            canvas.height = window.innerHeight * 1.2;
        },
        clearFrame: function () {
            if (!context) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
        },
        getArea: function () {
            if (!canvas) return { w: window.innerWidth || 800, h: window.innerHeight || 600 };
            return { w: canvas.width, h: canvas.height };
        },
        drawCircle: function (p, c) {
            if (!context) return;
            context.fillStyle = c.render();
            context.beginPath();
            context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
        }
    };
}());

S.UI = (function () {
    var interval, currentAction, time, maxShapeSize = 30, sequence = [], cmd = '#';

    function timedAction(fn, delay, max, reverse) {
        clearInterval(interval);
        currentAction = reverse ? max : 1;
        fn(currentAction);

        if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
            interval = setInterval(function () {
                currentAction = reverse ? currentAction - 1 : currentAction + 1;
                fn(currentAction);
                if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
                    clearInterval(interval);
                }
            }, delay);
        }
    }

    function reset(destroy) {
        clearInterval(interval);
        sequence = [];
        time = null;
        destroy && S.Shape && S.Shape.switchShape(S.ShapeBuilder.letter(''));
    }

    function performAction(value) {
        var action, current;
        sequence = typeof (value) === 'object' ? value : sequence.concat(value.split('|'));

        function getDynamicDelay(str) {
            const base = isMobile ? 1700 : 1900;
            if (!str || typeof str !== 'string') return base;
            if (str.trim().startsWith('#')) return base;
            return base + Math.max(0, (str.length - 5) * 100);
        }

        timedAction(function () {
            current = sequence.shift();
            action = current && current[0] === cmd ? current.substring(1).split(' ')[0] : null;
            value = current && current.split(' ')[1];

            switch (action) {
                case 'countdown':
                    value = parseInt(value) || 3;
                    timedAction(function (index) {
                        if (index === 0) {
                            if (sequence.length === 0) {
                                S.Shape.switchShape(S.ShapeBuilder.letter(''));
                            } else {
                                performAction(sequence);
                            }
                        } else {
                            S.Shape.switchShape(S.ShapeBuilder.letter(index), true);
                        }
                    }, isMobile ? 1300 : 1400, value, true);
                    break;

                case 'circle':
                    value = parseInt(value) || maxShapeSize;
                    value = Math.min(value, maxShapeSize);
                    S.Shape.switchShape(S.ShapeBuilder.circle(value));
                    break;

                case 'next':
                    finishMatrixAndPlayNext();
                    break;

                default:
                    S.Shape.switchShape(S.ShapeBuilder.letter(current[0] === cmd ? '' : current));
            }
        }, getDynamicDelay(sequence[0]), sequence.length);
    }

    function finishMatrixAndPlayNext() {
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
        const matrixCanvas = document.getElementById('matrix-rain');
        const mainCanvas = document.querySelector('.canvas');
        if (matrixCanvas) matrixCanvas.style.display = 'none';
        if (mainCanvas) mainCanvas.style.display = 'none';
        
        window.playNextSequence();
    }

    return {
        simulate: function (action) { performAction(action); },
        reset: function (destroy) { reset(destroy); }
    };
}());

S.Point = function (args) { this.x = args.x; this.y = args.y; this.z = args.z; this.a = args.a; this.h = args.h; };
S.Color = function (r, g, b, a) { this.r = r; this.g = g; this.b = b; this.a = a; };
S.Color.prototype.render = function () { return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'; };

S.Dot = function (x, y) {
    this.p = new S.Point({ x: x, y: y, z: isMobile ? 2 : 4, a: 1, h: 0 });
    this.e = 0.07;
    this.s = true;
    const currentSettings = window.settings || { sequenceColor: '#ff69b4' };
    const rgb = hexToRgb(currentSettings.sequenceColor || '#ff69b4');
    this.c = new S.Color(rgb.r, rgb.g, rgb.b, this.p.a);
    this.t = this.clone();
    this.q = [];
};

S.Dot.prototype = {
    clone: function () { return new S.Point({ x: this.x, y: this.y, z: this.z, a: this.a, h: this.h }); },
    _draw: function () {
        const currentSettings = window.settings || { sequenceColor: '#ff69b4' };
        const rgb = hexToRgb(currentSettings.sequenceColor || '#ff69b4');
        this.c.r = rgb.r; this.c.g = rgb.g; this.c.b = rgb.b; this.c.a = this.p.a;
        S.Drawing.drawCircle(this.p, this.c);
    },
    _moveTowards: function (n) {
        var details = this.distanceTo(n, true), dx = details[0], dy = details[1], d = details[2], e = this.e * d;
        if (this.p.h === -1) { this.p.x = n.x; this.p.y = n.y; return true; }
        if (d > 1) { this.p.x -= ((dx / d) * e); this.p.y -= ((dy / d) * e); }
        else { if (this.p.h > 0) this.p.h--; else return true; }
        return false;
    },
    _update: function () {
        if (this._moveTowards(this.t)) {
            var p = this.q.shift();
            if (p) {
                this.t.x = p.x || this.p.x; this.t.y = p.y || this.p.y; this.t.z = p.z || this.p.z; this.t.a = p.a || this.p.a; this.p.h = p.h || 0;
            } else {
                if (this.s) {
                    const amplitude = isMobile ? 0.1 : 3.142;
                    this.p.x -= Math.sin(Math.random() * amplitude);
                    this.p.y -= Math.sin(Math.random() * amplitude);
                } else {
                    this.move(new S.Point({ x: this.p.x + (Math.random() * 50) - 25, y: this.p.y + (Math.random() * 50) - 25 }));
                }
            }
        }
        let d = this.p.a - this.t.a;
        this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
        d = this.p.z - this.t.z;
        this.p.z = Math.max(1, this.p.z - (d * 0.05));
    },
    distanceTo: function (n, details) {
        var dx = this.p.x - n.x, dy = this.p.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
        return details ? [dx, dy, d] : d;
    },
    move: function (p, avoidStatic) {
        if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) this.q.push(p);
    },
    render: function () { this._update(); this._draw(); }
};

S.ShapeBuilder = (function () {
    var shapeCanvas = document.createElement('canvas'), shapeContext = shapeCanvas.getContext('2d'), fontFamily = 'Avenir, Helvetica Neue, sans-serif';
    function getGap() { return isMobile ? 4 : 8; }
    function fit() {
        const gap = getGap();
        shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
        shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
        shapeContext.fillStyle = 'red';
        shapeContext.textBaseline = 'middle';
        shapeContext.textAlign = 'center';
    }
    function processCanvas() {
        const gap = getGap();
        var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data, dots = [], x = 0, y = 0, fx = shapeCanvas.width, fy = shapeCanvas.height, w = 0, h = 0;
        for (var p = 0; p < pixels.length; p += (4 * gap)) {
            if (pixels[p + 3] > 0) {
                dots.push(new S.Point({ x: x, y: y }));
                w = x > w ? x : w; h = y > h ? y : h; fx = x < fx ? x : fx; fy = y < fy ? y : fy;
            }
            x += gap;
            if (x >= shapeCanvas.width) { x = 0; y += gap; p += gap * 4 * shapeCanvas.width; }
        }
        return { dots: dots, w: w + fx, h: h + fy };
    }
    function init() { fit(); window.addEventListener('resize', fit); }
    init();

    return {
        circle: function (d) {
            var r = Math.max(0, d) / 2;
            const gap = getGap();
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.beginPath();
            shapeContext.arc(r * gap, r * gap, r * gap, 0, 2 * Math.PI, false);
            shapeContext.fill();
            shapeContext.closePath();
            return processCanvas();
        },
        letter: function (l) {
            const baseFontSize = isMobile ? 220 : 450;
            shapeContext.font = 'bold ' + baseFontSize + 'px ' + fontFamily;
            const s = Math.min(baseFontSize, (shapeCanvas.width / (shapeContext.measureText(l).width || 1)) * 0.8 * baseFontSize);
            shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);
            return processCanvas();
        }
    };
}());

S.Shape = (function () {
    var dots = [], width = 0, height = 0, cx = 0, cy = 0;
    function compensate() {
        var a = S.Drawing.getArea();
        cx = a.w / 2 - width / 2;
        cy = a.h / 2 - height / 2;
    }
    return {
        switchShape: function (n, fast) {
            var size, a = S.Drawing.getArea();
            width = n.w; height = n.h;
            compensate();

            if (n.dots.length > dots.length) {
                size = n.dots.length - dots.length;
                for (var d = 1; d <= size; d++) dots.push(new S.Dot(a.w / 2, a.h / 2));
            }

            var d = 0, i = 0;
            while (n.dots.length > 0) {
                i = Math.floor(Math.random() * n.dots.length);
                dots[d].e = isMobile ? 0.35 : 0.11;
                dots[d].s = true;
                dots[d].move(new S.Point({ x: n.dots[i].x + cx, y: n.dots[i].y + cy, a: 1, z: isMobile ? 2 : 4, h: fast ? 15 : 25 }));
                n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
                d++;
            }

            for (var k = d; k < dots.length; k++) {
                dots[k].s = false;
                dots[k].move(new S.Point({ x: Math.random() * a.w, y: Math.random() * a.h, a: 0.2, z: 2, h: 0 }));
            }
        },
        render: function () {
            for (var d = 0; d < dots.length; d++) dots[d].render();
        }
    };
}());

// ==========================================
// 💖 Hearts, Book & Celebration Effects
// ==========================================
const heartPool = [];
const maxFloatingHearts = 25; 
function getHeartFromPool() {
    if (heartPool.length > 0) return heartPool.pop();
    const heart = document.createElement('div');
    heart.className = 'heart';
    return heart;
}

function showFloatingHearts() {
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💓', '💞'];
    let heartCount = 0;
    function spawnHeart() {
        if (heartCount >= maxFloatingHearts) return;
        const heart = getHeartFromPool();
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        document.body.appendChild(heart);
        heartCount++;
        setTimeout(() => { heart.remove(); heartPool.push(heart); }, 10000);
        if (heartCount < maxFloatingHearts) setTimeout(spawnHeart, 1500); 
    }
    spawnHeart();
}

function showBook() {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    showStars();
    if (book && bookContainer) {
        bookContainer.style.display = 'block';
        bookContainer.classList.add('show');
        book.style.display = 'block';
        
        if (typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
        if (typeof setupPageObserver === 'function') setupPageObserver();

        requestAnimationFrame(() => {
            book.style.opacity = '0';
            book.style.transform = 'scale(0.8) translateY(50px)';
            book.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            requestAnimationFrame(() => {
                book.style.opacity = '1';
                book.style.transform = 'scale(1) translateY(0)';
            });
        });
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 105, b: 180 };
}

let currentPage = 0, isFlipping = false, typewriterTimeout, isBookFinished = false, photoUrls = [];

function showConfetti() {
    const confettiColors = ['#ff6f91', '#ff9671', '#ffc75f', '#f9f871', '#ff3c78'];
    let confettiCount = 0;
    function spawnConfetti() {
        if (confettiCount >= maxConfetti) return;
        const confetti = getConfettiFromPool();
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.setProperty('--x', (Math.random() * 400 - 200) + 'px');
        confetti.style.setProperty('--y', (Math.random() * -400) + 'px');
        confetti.style.left = (window.innerWidth / 2) + 'px';
        confetti.style.top = (window.innerHeight / 2) + 'px';
        document.body.appendChild(confetti);
        setTimeout(() => returnConfettiToPool(confetti), 1000);
        confettiCount++;
        if (confettiCount < maxConfetti) setTimeout(spawnConfetti, 20); 
    }
    spawnConfetti();
}

function showFirework() {
    const fireworkContainer = document.getElementById('fireworkContainer');
    if(!fireworkContainer) return;
    fireworkContainer.innerHTML = '';
    fireworkContainer.style.opacity = 1;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 20; i++) { 
        const fw = document.createElement('div');
        fw.className = 'firework';
        fw.style.transform = `rotate(${i * 18}deg) translateY(-40px)`;
        fragment.appendChild(fw);
    }
    fireworkContainer.appendChild(fragment);
    setTimeout(() => { fireworkContainer.style.opacity = 0; }, 1000);
}

function spawnHeartPhotosCentered() {
    let validPhotoUrls = photoUrls.filter(url => url && !url.includes('cover.jpg'));
    
    if (validPhotoUrls.length === 0 && window.settings?.innerMemory?.photos) {
        validPhotoUrls = window.settings.innerMemory.photos.filter(url => url && url.trim() !== '');
    }

    if (validPhotoUrls.length === 0) {
        setTimeout(() => window.playNextSequence(), 3000);
        return; 
    }
    
    let currentIndex = 0;
    const maxHeartPhotos = 20;
    const allPhotoElements = []; 
    
    function spawnNext() {
        if (currentIndex < maxHeartPhotos) {
            const photoUrl = validPhotoUrls[currentIndex % validPhotoUrls.length];
            const photo = document.createElement('img');
            photo.src = photoUrl;
            photo.className = 'photo';
            photo.style.zIndex = '300';
            
            const centerX = window.innerWidth * 0.5;
            const centerY = window.innerHeight * 0.5;
            const t = (currentIndex / maxHeartPhotos) * 2 * Math.PI;
            const scale = (window.innerHeight <= 500 && window.innerWidth > window.innerHeight) ? 7 : 14;
            const sin_t = Math.sin(t);
            const cos_t = Math.cos(t);
            const targetX = scale * 16 * Math.pow(sin_t, 3);
            const targetY = -scale * (13 * cos_t - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            photo.style.left = centerX + 'px';
            photo.style.top = centerY + 'px';
            photo.style.opacity = '0';
            photo.style.transform = 'translate(-50%, -50%) scale(0)';
            photo.style.transition = 'all 1.2s ease-out'; 
            document.body.appendChild(photo);
            allPhotoElements.push(photo); 
            
            requestAnimationFrame(() => {
                photo.style.opacity = '1';
                photo.style.transform = 'translate(-50%, -50%) scale(1)';
                photo.style.left = (centerX + targetX) + 'px';
                photo.style.top = (centerY + targetY) + 'px';
            });
            
            currentIndex++;
            setTimeout(spawnNext, 80); 
        } else {
            setTimeout(() => removeHeartPhotos(allPhotoElements), 4000); 
        }
    }
    spawnNext();
}

function removeHeartPhotos(photoElements) {
    let removeIndex = 0;
    function removeNext() {
        if (removeIndex < photoElements.length) {
            const photo = photoElements[removeIndex];
            photo.style.transition = 'all 0.8s ease-in';
            photo.style.opacity = '0'; 
            photo.style.transform = 'translate(-50%, -50%) scale(0)'; 
            setTimeout(() => photo.remove(), 800);
            removeIndex++;
            setTimeout(removeNext, 80); 
        } else {
            setTimeout(() => window.playNextSequence(), 1000);
        }
    }
    removeNext();
}

function startHeartEffect() {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    const contentDisplay = document.getElementById('contentDisplay');
    
    if (book) { book.style.display = 'none'; book.classList.remove('show'); }
    if (bookContainer) { bookContainer.style.display = 'none'; bookContainer.classList.remove('show'); }
    if (contentDisplay) { contentDisplay.classList.remove('show'); }

    setTimeout(showConfetti, 100);
    setTimeout(showFirework, 200);
    setTimeout(() => {
        showFloatingHearts();
        spawnHeartPhotosCentered(); 
    }, 300);
}

function checkBookFinished() {
    if(!window.settings || !window.settings.pages) return;
    const totalPhysicalPages = Math.ceil(window.settings.pages.length / 2);
    const lastPageIndex = totalPhysicalPages - 1;
    const lastPage = document.querySelector(`.page[data-page="${lastPageIndex}"]`);
    
    if (currentPage === lastPageIndex && lastPage && lastPage.classList.contains('flipped')) {
        if (!isBookFinished) {
            isBookFinished = true;
            const contentDisplay = document.getElementById('contentDisplay');
            if (contentDisplay) contentDisplay.classList.remove('show');
            setTimeout(() => {
                const bookContainer = document.querySelector('.book-container');
                if (bookContainer) {
                    bookContainer.classList.remove('show');
                    setTimeout(() => {
                        bookContainer.style.display = 'none';
                        window.playNextSequence(); 
                    }, 800);
                }
            }, 1000);
        }
    }
}

function nextPage() {
    if(!window.settings || !window.settings.pages) return;
    const totalPhysicalPages = Math.ceil(window.settings.pages.length / 2);
    if (currentPage < totalPhysicalPages - 1 && !isFlipping) {
        isFlipping = true;
        const pageToFlip = document.querySelector(`.page[data-page="${currentPage}"]`);
        if(pageToFlip) pageToFlip.classList.add('flipping');
        setTimeout(() => {
            if(pageToFlip) {
                pageToFlip.classList.remove('flipping');
                pageToFlip.classList.add('flipped');
            }
            currentPage++;
            isFlipping = false;
            showPageContent();
            checkBookFinished();
        }, 400);
    } else if (currentPage === totalPhysicalPages - 1 && !isFlipping) {
        const lastPage = document.querySelector(`.page[data-page="${currentPage}"]`);
        if (lastPage && !lastPage.classList.contains('flipped')) {
            isFlipping = true;
            lastPage.classList.add('flipping');
            setTimeout(() => {
                lastPage.classList.remove('flipping');
                lastPage.classList.add('flipped');
                isFlipping = false;
                showPageContent();
                checkBookFinished();
            }, 400);
        }
    }
}

function prevPage() {
    if (currentPage > 0 && !isFlipping) {
        isFlipping = true;
        currentPage--;
        const pageToFlip = document.querySelector(`.page[data-page="${currentPage}"]`);
        if(pageToFlip) pageToFlip.classList.add('flipping');
        setTimeout(() => {
            if(pageToFlip) {
                pageToFlip.classList.remove('flipping');
                pageToFlip.classList.remove('flipped');
            }
            isFlipping = false;
            showPageContent();
            isBookFinished = false;
        }, 400);
    }
}

function typewriterEffect(element, text, speed = 40) {
    return new Promise((resolve) => {
        element.innerHTML = '';
        let i = 0;
        let lastScrollTime = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                const now = Date.now();
                if (now - lastScrollTime > 100) { 
                    const container = element.closest('.content-display');
                    if (container && container.scrollHeight > container.clientHeight) {
                        container.scrollTop = container.scrollHeight - container.clientHeight;
                    }
                    lastScrollTime = now;
                }
                typewriterTimeout = setTimeout(type, speed);
            } else resolve();
        }
        type();
    });
}

async function showPageContent() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if(!window.settings || !window.settings.pages) return;
    
    let logicalPageIndex = 0;
    if (currentPage === 0) {
        logicalPageIndex = 0;
    } else {
        const currentPhysicalPage = document.querySelector(`.page[data-page="${currentPage}"]`);
        logicalPageIndex = (currentPhysicalPage && currentPhysicalPage.classList.contains('flipped')) ? (currentPage * 2 + 1) : (currentPage * 2);
    }
    const contentToShow = window.settings.pages[logicalPageIndex]?.content;
    const contentDisplay = document.getElementById('contentDisplay');
    const contentText = document.getElementById('contentText');
    if (contentToShow && contentDisplay && contentText) {
        contentDisplay.classList.add('show');
        contentText.innerHTML = '';
        await typewriterEffect(contentText, contentToShow, 30);
    } else if(contentDisplay) {
        contentDisplay.classList.remove('show');
    }
}

// 📖 ৩D বইয়ের টাচ ও সোয়াইপ ড্র্যাগ ফিজিক্স
let startX = 0, startY = 0, isDragging = false;
const bookElem = document.getElementById('book');
if(bookElem) {
    bookElem.addEventListener('touchstart', e => {
        if(isFlipping) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    bookElem.addEventListener('touchmove', e => {
        if(!isDragging || isFlipping) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        const currentPageElement = document.querySelector(`.page[data-page="${currentPage}"]`);
        if (currentPageElement && !currentPageElement.classList.contains('flipped') && deltaX < -30) {
            const rotation = Math.max(-45, deltaX / 3);
            currentPageElement.style.transform = `rotateY(${rotation}deg)`;
        }
    }, { passive: true });

    bookElem.addEventListener('touchend', e => {
        if(!isDragging) return;
        isDragging = false;
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(p => p.style.transform = '');
        
        const diffX = e.changedTouches[0].clientX - startX;
        const diffY = e.changedTouches[0].clientY - startY;
        if(Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if(diffX < 0) nextPage(); else prevPage();
        }
    }, { passive: true });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
    else if (e.key === 'ArrowLeft') prevPage();
});

const musicControl = document.getElementById('musicControl');
const birthdayAudio = document.getElementById('birthdayAudio');
let isPlaying = false;

if(birthdayAudio) birthdayAudio.volume = 0.6;

function toggleMusic() {
    if(!birthdayAudio) return;
    if (isPlaying) {
        birthdayAudio.pause();
        if(musicControl) musicControl.innerHTML = '▶';
        isPlaying = false;
    } else {
        birthdayAudio.play().then(() => {
            if(musicControl) musicControl.innerHTML = '⏸';
            isPlaying = true;
        }).catch(() => {});
    }
}

if(musicControl) musicControl.addEventListener('click', toggleMusic);

function showStars() {
    const starsContainer = document.getElementById('starsContainer');
    if(!starsContainer) return;
    starsContainer.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star medium';
        star.style.cssText = `left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-duration: ${Math.random() * 3 + 1}s;`;
        starsContainer.appendChild(star);
    }
    starsContainer.style.display = 'block';
}

function calculatePageZIndexes() {
    const book = document.getElementById('book');
    if (!book) return;
    const pages = book.querySelectorAll('.page');
    pages.forEach((page, physicalIndex) => {
        page.style.setProperty('--page-z-index', (pages.length - physicalIndex).toString());
        page.style.setProperty('--page-flipped-z-index', (physicalIndex + 1).toString());
    });
}

function setupPageObserver() {
    const book = document.getElementById('book');
    if (!book) return;
    const observer = new MutationObserver(() => calculatePageZIndexes());
    observer.observe(book, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startSurpriseBtn');
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            hasSurpriseStarted = true;
            const startScreen = document.getElementById('start-screen');
            if(startScreen) startScreen.style.display = 'none';
            
            const musicControl = document.getElementById('musicControl');
            if(musicControl) musicControl.style.display = 'flex';
            
            const birthdayAudio = document.getElementById('birthdayAudio');
            if (birthdayAudio) {
                birthdayAudio.play().then(() => {
                    isPlaying = true;
                    if(musicControl) musicControl.innerHTML = '⏸';
                }).catch(() => {});
            }

            if(isMobile) requestAutoFullscreen();

            const currentSettings = window.settings || {};
            window.effectQueue = currentSettings.effectSequence ? [...currentSettings.effectSequence] : ['memory', 'matrix', 'book', 'hearts'];
            S.init();
            window.playNextSequence();
        });
    }
    
    checkOrientation();
});
