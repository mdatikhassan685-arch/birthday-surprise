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
            elem.requestFullscreen().catch(err => console.log(err));
        } else if (elem.webkitRequestFullscreen) { 
            elem.webkitRequestFullscreen();
        }
    }
}

function checkOrientation() {
    const orientationLock = document.getElementById('orientation-lock');
    const matrixCanvas = document.getElementById('matrix-rain');
    const mainCanvas = document.querySelector('.canvas');
    const startScreen = document.getElementById('start-screen');
    const musicControl = document.getElementById('musicControl');

    function handleReadyState() {
        if (orientationLock) {
            orientationLock.style.display = 'none';
        }
        if (!hasSurpriseStarted) {
            if (startScreen) {
                startScreen.style.display = 'flex';
            }
        }
    }

    if (!isMobile) {
        isLandscape = true;
        handleReadyState();
    } else {
        const mediaQuery = window.matchMedia("(orientation: landscape)");
        isLandscape = mediaQuery.matches;

        if (isLandscape) {
            handleReadyState();
            setTimeout(() => forceResizeMatrix(), 100);
        } else {
            if (orientationLock) orientationLock.style.display = 'flex';
            if (startScreen) startScreen.style.display = 'none';
            stopWebsite();
        }

        mediaQuery.addEventListener('change', (e) => {
            isLandscape = e.matches;
            if (isLandscape) {
                handleReadyState();
                setTimeout(() => forceResizeMatrix(), 100);
            } else {
                if (orientationLock) orientationLock.style.display = 'flex';
                if (startScreen) startScreen.style.display = 'none';
                stopWebsite();
            }
        });
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
        matrixCtx.font = "bold " + fontSize + "px Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace";

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

            if (started[i]) {
                drops[i]++;
            }

            if (drops[i] >= maxLength) {
                drops[i] = 0;
                delays[i] = Math.random() * 1000;
                started[i] = false;
            }
        }
    }

    matrixInterval = setInterval(drawMatrixRain, intervalTime);

    window.addEventListener('resize', () => {
        clearTimeout(window.matrixResizeTimeout);
        window.matrixResizeTimeout = setTimeout(() => {
            matrixCanvas.width = window.innerWidth * 1.2;
            matrixCanvas.height = window.innerHeight * 1.2;
            const newColumns = Math.floor(matrixCanvas.width / fontSize);

            drops.length = 0;
            columnColors.length = 0;
            delays.length = 0;
            started.length = 0;

            for (let x = 0; x < newColumns; x++) {
                drops[x] = 0;
                columnColors[x] = x % 2 === 0 ?
                    (window.settings ? window.settings.matrixColor1 : '#ff69b4') :
                    (window.settings ? window.settings.matrixColor2 : '#ff1493');
                delays[x] = Math.random() * 1000;
                started[x] = false;
            }
            startTime = Date.now();
        }, 100);
    });
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

    if (!matrixInterval) {
        initMatrixRain();
    }
    
    if (typeof S !== 'undefined' && S.UI) {
        S.UI.reset(true);
    }
    
    const countdownValue = currentSettings.countdown || 3;
    const sequenceText = currentSettings.sequence || 'HAPPY|BIRTHDAY|ZAHRA|❤';
    
    const sequence = `|#countdown ${countdownValue}|${sequenceText}|#next|`;
    
    S.UI.simulate(sequence);
    S.Drawing.init('.canvas');
    document.body.classList.add('body--ready');
    S.Drawing.loop(function () {
        S.Shape.render();
    });
}

// 🎯 Sequence Engine Controller
window.playNextSequence = function() {
    if (!window.effectQueue || window.effectQueue.length === 0) return;
    
    let nextEffect = window.effectQueue.shift();
    while (nextEffect === 'none' && window.effectQueue.length > 0) {
        nextEffect = window.effectQueue.shift();
    }
    
    const mcScreen = document.getElementById('memory-card-screen');
    const matrixCanvas = document.getElementById('matrix-rain');
    const mainCanvas = document.querySelector('.canvas');
    const bookContainer = document.querySelector('.book-container');
    const contentDisplay = document.getElementById('contentDisplay');

    if (mcScreen) mcScreen.style.display = 'none';
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
                        setTimeout(typeWriter, 150); 
                    } else {
                        setTimeout(() => {
                            mcTitle.style.borderRight = 'none';
                        }, 2000);
                    }
                }
                setTimeout(typeWriter, 500);
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
        // 🎯 এখানে কোনো setTimeout থাকবে না। এনিমেশন শেষ হয়ে পরেরটা অটো কল করবে।
    } else {
        window.playNextSequence();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mcBtn = document.getElementById('mcDisplayBtn');
    if (mcBtn) {
        mcBtn.addEventListener('click', () => {
            const mcScreen = document.getElementById('memory-card-screen');
            if (mcScreen) mcScreen.style.display = 'none';
            window.playNextSequence(); 
        });
    }
});


S = {
    initialized: false,
    init: function () {
        const currentSettings = window.settings || {};
        
        window.effectQueue = currentSettings.effectSequence ? [...currentSettings.effectSequence] : ['memory', 'matrix', 'book', 'hearts'];

        if (currentSettings.memoryCard) {
            const mcTitle = document.getElementById('mcDisplayTitle');
            const mcMsg = document.getElementById('mcDisplayMsg');
            const mcBtn = document.getElementById('mcDisplayBtn');
            const mcImg = document.getElementById('mcDisplayImg');
            
            if (mcTitle) mcTitle.innerHTML = '';
            if (mcMsg) mcMsg.textContent = currentSettings.memoryCard.message || '';
            if (mcBtn) mcBtn.textContent = currentSettings.memoryCard.btnText || 'Open Memories ✨';
            
            if (mcImg) {
                if (currentSettings.memoryCard.finalImageToShow && currentSettings.memoryCard.finalImageToShow.trim() !== '') {
                    mcImg.src = currentSettings.memoryCard.finalImageToShow;
                    mcImg.style.display = 'block';
                } else {
                    mcImg.style.display = 'none';
                }
            }
        }
    }
};

S.Drawing = (function () {
    var canvas,
        context,
        renderFn,
        requestFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

    return {
        init: function (el) {
            canvas = document.querySelector(el);
            if (!canvas) return;
            context = canvas.getContext('2d');
            this.adjustCanvas();
            window.addEventListener('resize', function () {
                S.Drawing.adjustCanvas();
            });
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
            if (!canvas) {
                return { w: window.innerWidth || 800, h: window.innerHeight || 600 };
            }
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
    var interval,
        currentAction,
        time,
        maxShapeSize = 30,
        sequence = [],
        cmd = '#';

    function formatTime(date) {
        var h = date.getHours(),
            m = date.getMinutes(),
            m = m < 10 ? '0' + m : m;
        return h + ':' + m;
    }

    function getValue(value) {
        return value && value.split(' ')[1];
    }

    function getAction(value) {
        value = value && value.split(' ')[0];
        return value && value[0] === cmd && value.substring(1);
    }

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
        destroy && S.Shape.switchShape(S.ShapeBuilder.letter(''));
    }

    function performAction(value) {
        var action,
            current;

        sequence = typeof (value) === 'object' ? value : sequence.concat(value.split('|'));

        function getDynamicDelay(str) {
            const base = isMobile ? 1700 : 1900;
            if (!str || typeof str !== 'string') return base;
            if (str.trim().startsWith('#')) return base;
            const extra = Math.max(0, (str.length - 5) * 100);
            return base + extra;
        }

        timedAction(function (index) {
            current = sequence.shift();
            action = getAction(current);
            value = getValue(current);

            switch (action) {
                case 'countdown':
                    value = parseInt(value) || 10;
                    value = value > 0 ? value : 10;
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

                case 'time':
                    var t = formatTime(new Date());
                    if (sequence.length > 0) {
                        S.Shape.switchShape(S.ShapeBuilder.letter(t));
                    } else {
                        timedAction(function () {
                            t = formatTime(new Date());
                            if (t !== time) {
                                time = t;
                                S.Shape.switchShape(S.ShapeBuilder.letter(time));
                            }
                        }, 1000);
                    }
                    break;

                case 'next':
                    const currentSettings = window.settings || {};
                    const giftImage = document.getElementById('gift-image');

                    if (giftImage && currentSettings.gift && currentSettings.gift !== '') {
                        giftImage.src = currentSettings.gift;
                        giftImage.style.display = 'block';
                        giftImage.style.animation = 'giftCelebration 2s ease-in-out';
                        
                        setTimeout(() => { 
                            giftImage.style.display = 'none'; 
                            finishMatrixAndPlayNext();
                        }, 3000);
                    } else {
                        finishMatrixAndPlayNext(); 
                    }
                    break;

                default:
                    S.Shape.switchShape(S.ShapeBuilder.letter(current[0] === cmd ? 'What?' : current));
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
        simulate: function (action) {
            if (isLandscape || !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                performAction(action);
            }
        },
        reset: function (destroy) {
            reset(destroy);
        }
    };
}());

S.Point = function (args) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.a = args.a;
    this.h = args.h;
};

S.Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

S.Color.prototype = {
    render: function () {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    }
};

S.Dot = function (x, y) {
    this.p = new S.Point({
        x: x,
        y: y,
        z: this.getDotSize(),
        a: 1,
        h: 0
    });
    this.e = 0.07;
    this.s = true;
    const currentSettings = window.settings || {sequenceColor: '#ff69b4'};
    const rgb = hexToRgb(currentSettings.sequenceColor);
    this.c = new S.Color(rgb.r, rgb.g, rgb.b, this.p.a);
    this.t = this.clone();
    this.q = [];
};

S.Dot.prototype = {
    getDotSize: function () {
        return isMobile ? 2 : 4;
    },

    clone: function () {
        return new S.Point({
            x: this.x,
            y: this.y,
            z: this.z,
            a: this.a,
            h: this.h
        });
    },

    _draw: function () {
        const currentSettings = window.settings || {sequenceColor: '#ff69b4'};
        const rgb = hexToRgb(currentSettings.sequenceColor);
        this.c.r = rgb.r;
        this.c.g = rgb.g;
        this.c.b = rgb.b;
        this.c.a = this.p.a;
        S.Drawing.drawCircle(this.p, this.c);
    },

    _moveTowards: function (n) {
        var details = this.distanceTo(n, true),
            dx = details[0],
            dy = details[1],
            d = details[2],
            e = this.e * d;

        if (this.p.h === -1) {
            this.p.x = n.x;
            this.p.y = n.y;
            return true;
        }

        if (d > 1) {
            this.p.x -= ((dx / d) * e);
            this.p.y -= ((dy / d) * e);
        } else {
            if (this.p.h > 0) {
                this.p.h--;
            } else {
                return true;
            }
        }
        return false;
    },

    _update: function () {
        if (this._moveTowards(this.t)) {
            var p = this.q.shift();
            if (p) {
                this.t.x = p.x || this.p.x;
                this.t.y = p.y || this.p.y;
                this.t.z = p.z || this.p.z;
                this.t.a = p.a || this.p.a;
                this.p.h = p.h || 0;
            } else {
                if (this.s) {
                    const amplitude = isMobile ? 0.1 : 3.142;
                    this.p.x -= Math.sin(Math.random() * amplitude);
                    this.p.y -= Math.sin(Math.random() * amplitude);
                } else {
                    this.move(new S.Point({
                        x: this.p.x + (Math.random() * 50) - 25,
                        y: this.p.y + (Math.random() * 50) - 25,
                    }));
                }
            }
        }
        let d = this.p.a - this.t.a;
        this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
        d = this.p.z - this.t.z;
        this.p.z = Math.max(1, this.p.z - (d * 0.05));
    },

    distanceTo: function (n, details) {
        var dx = this.p.x - n.x,
            dy = this.p.y - n.y,
            d = Math.sqrt(dx * dx + dy * dy);
        return details ? [dx, dy, d] : d;
    },

    move: function (p, avoidStatic) {
        if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
            this.q.push(p);
        }
    },

    render: function () {
        this._update();
        this._draw();
    }
};

S.ShapeBuilder = (function () {
    var shapeCanvas = document.createElement('canvas'),
        shapeContext = shapeCanvas.getContext('2d'),
        fontFamily = 'Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';

    function getGap() {
        return isMobile ? 4 : 8;
    }

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
        var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data,
            dots = [],
            x = 0,
            y = 0,
            fx = shapeCanvas.width,
            fy = shapeCanvas.height,
            w = 0,
            h = 0;

        for (var p = 0; p < pixels.length; p += (4 * gap)) {
            if (pixels[p + 3] > 0) {
                dots.push(new S.Point({ x: x, y: y }));
                w = x > w ? x : w;
                h = y > h ? y : h;
                fx = x < fx ? x : fx;
                fy = y < fy ? y : fy;
            }
            x += gap;
            if (x >= shapeCanvas.width) {
                x = 0;
                y += gap;
                p += gap * 4 * shapeCanvas.width;
            }
        }
        return { dots: dots, w: w + fx, h: h + fy };
    }

    function setFontSize(s) {
        shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function init() {
        fit();
        window.addEventListener('resize', fit);
    }

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
            var s = 0;
            const isSmallScreen = window.innerWidth < 768;
            const baseFontSize = (isMobile || isSmallScreen) ? 250 : 500;

            setFontSize(baseFontSize);
            s = Math.min(baseFontSize,
                (shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * baseFontSize,
                (shapeCanvas.height / baseFontSize) * (isNumber(l) ? 0.8 : 0.35) * baseFontSize);

            setFontSize(s);
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

    function getDotCreationParams() {
        const isSmallScreen = window.innerWidth < 768;
        if (isMobile || isSmallScreen) {
            return { minSize: 1, maxSize: 4, minZ: 2, maxZ: 3 };
        } else {
            return { minSize: 3, maxSize: 12, minZ: 4, maxZ: 8 };
        }
    }

    return {
        switchShape: function (n, fast) {
            var size, a = S.Drawing.getArea();
            width = n.w; height = n.h;
            compensate();
            const params = getDotCreationParams();

            if (n.dots.length > dots.length) {
                size = n.dots.length - dots.length;
                for (var d = 1; d <= size; d++) dots.push(new S.Dot(a.w / 2, a.h / 2));
            }

            var d = 0, i = 0;
            while (n.dots.length > 0) {
                i = Math.floor(Math.random() * n.dots.length);
                dots[d].e = isMobile ? 0.35 : 0.11;

                if (dots[d].s) {
                    dots[d].move(new S.Point({ z: Math.random() * (params.maxSize - params.minSize) + params.minSize, a: Math.random(), h: 18 }));
                } else {
                    dots[d].move(new S.Point({ z: Math.random() * (params.minZ) + params.minZ, h: fast ? 18 : 30 }));
                }

                dots[d].s = true;
                dots[d].move(new S.Point({ x: n.dots[i].x + cx, y: n.dots[i].y + cy, a: 1, z: params.minZ, h: 0 }));
                n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
                d++;
            }

            for (var i = d; i < dots.length; i++) {
                if (dots[i].s) {
                    dots[i].move(new S.Point({ z: Math.random() * (params.maxSize - params.minSize) + params.minSize, a: Math.random(), h: 20 }));
                    dots[i].s = false;
                    dots[i].e = 0.04;
                    dots[i].move(new S.Point({ x: Math.random() * a.w, y: Math.random() * a.h, a: 0.3, z: Math.random() * params.minZ, h: 0 }));
                }
            }
        },
        render: function () {
            for (var d = 0; d < dots.length; d++) {
                dots[d].render();
            }
        }
    };
}());

const heartPool = [];
const maxFloatingHearts = 25; 
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    return heart;
}

function getHeartFromPool() {
    if (heartPool.length > 0) return heartPool.pop();
    return createFloatingHeart();
}

function returnHeartToPool(heart) {
    heart.remove();
    heartPool.push(heart);
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
        setTimeout(() => returnHeartToPool(heart), 10000);
        if (heartCount < maxFloatingHearts) setTimeout(spawnHeart, 1600); 
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
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 211, g: 155, b: 155 };
}

const book = document.getElementById('book');
const contentDisplay = document.getElementById('contentDisplay');
const contentText = document.getElementById('contentText');
let currentPage = 0;
let isFlipping = false;
let typewriterTimeout;
let isBookFinished = false;
let photoUrls = [];

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

let fireworkContainer = null;
function showFirework() {
    if (!fireworkContainer) fireworkContainer = document.getElementById('fireworkContainer');
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
    requestAnimationFrame(() => {
        setTimeout(() => { fireworkContainer.style.opacity = 0; }, 1000);
    });
}

const photoCache = new Map();
let heartPhotosCreated = 0;
const maxHeartPhotos = 30;

function preloadPhoto(url) {
    if (photoCache.has(url)) return photoCache.get(url);
    const img = new Image();
    img.src = url;
    photoCache.set(url, img);
    return img;
}

// ===============================================
// 🎯 Floating Hearts Image Sequence (Fixed Fade Out)
// ===============================================

function spawnHeartPhotosCentered() {
    heartPhotosCreated = 0;
    const validPhotoUrls = photoUrls.filter(url => !url.includes('cover.jpg') && !url.includes('theend.jpg'));
    
    // ছবি না থাকলে সরাসরি পরের এনিমেশন শুরু করে দিবে
    if (validPhotoUrls.length === 0) {
        window.playNextSequence();
        return; 
    }
    
    validPhotoUrls.forEach(url => preloadPhoto(url));
    let currentIndex = 0;
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
            const scale = (window.innerHeight <= 500 && window.innerWidth > window.innerHeight) ? 8 : 16;
            const sin_t = Math.sin(t);
            const cos_t = Math.cos(t);
            const targetX = scale * 16 * Math.pow(sin_t, 3);
            const targetY = -scale * (13 * cos_t - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            photo.style.left = centerX + 'px';
            photo.style.top = centerY + 'px';
            photo.style.opacity = '0';
            photo.style.transform = 'translate(-50%, -50%) scale(0)';
            photo.style.transition = 'all 1.5s ease-out'; 
            document.body.appendChild(photo);
            
            allPhotoElements.push(photo); 
            
            requestAnimationFrame(() => {
                photo.style.opacity = '1';
                photo.style.transform = 'translate(-50%, -50%) scale(1)';
                photo.style.left = (centerX + targetX) + 'px';
                photo.style.top = (centerY + targetY) + 'px';
            });
            
            currentIndex++;
            setTimeout(() => { requestAnimationFrame(spawnNext); }, 80); 
        } else {
            // 🎯 সব ছবি আসার পর ৪ সেকেন্ড অপেক্ষা করবে, তারপর গায়েব হওয়া শুরু হবে
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
            photo.style.transition = 'all 1s ease-in';
            photo.style.opacity = '0'; 
            photo.style.transform = 'translate(-50%, -50%) scale(0)'; 
            
            setTimeout(() => {
                photo.remove(); 
            }, 1000);
            
            removeIndex++;
            setTimeout(() => requestAnimationFrame(removeNext), 80); 
        } else {
            // 🎯 ফিক্সড: একদম শেষ ছবিটি স্ক্রিন থেকে মুছে যাওয়ার পর পরের এনিমেশন কল হবে!
            setTimeout(() => {
                window.playNextSequence();
            }, 1000);
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

    requestAnimationFrame(() => {
        setTimeout(() => showConfetti(), 100);
        setTimeout(() => showFirework(), 200);
        setTimeout(() => {
            showFloatingHearts();
            spawnHeartPhotosCentered(); 
        }, 300);
    });
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
                        window.playNextSequence(); // 🎯 বই শেষ হলে পরের ইফেক্ট কল হবে
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

function typewriterEffect(element, text, speed = 50) {
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
                if (speed < 16) requestAnimationFrame(type);
                else typewriterTimeout = setTimeout(type, speed);
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
        if (currentPhysicalPage && currentPhysicalPage.classList.contains('flipped')) {
            logicalPageIndex = currentPage * 2 + 1;
        } else {
            logicalPageIndex = currentPage * 2;
        }
    }
    const contentToShow = window.settings.pages[logicalPageIndex]?.content;
    if (contentToShow && contentDisplay && contentText) {
        contentDisplay.classList.add('show');
        contentText.innerHTML = '';
        await typewriterEffect(contentText, contentToShow, 30);
    } else if(contentDisplay) {
        contentDisplay.classList.remove('show');
    }
}

let startX = 0, startY = 0, startTime = 0, isDragging = false, currentTransform = 0;

const bookElem = document.getElementById('book');
if(bookElem) {
    bookElem.addEventListener('touchstart', handleTouchStart, { passive: false });
    bookElem.addEventListener('touchmove', handleTouchMove, { passive: false });
    bookElem.addEventListener('touchend', handleTouchEnd, { passive: false });
    bookElem.addEventListener('mousedown', handleMouseStart);
    bookElem.addEventListener('mousemove', handleMouseMove);
    bookElem.addEventListener('mouseup', handleMouseEnd);
    bookElem.addEventListener('mouseleave', handleMouseEnd);
}

function handleTouchStart(e) {
    if (isFlipping) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    isDragging = true;
    currentTransform = 0;
}

function handleMouseStart(e) {
    if (isFlipping) return;
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
    isDragging = true;
    currentTransform = 0;
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!isDragging || isFlipping) return;
    e.preventDefault();
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        handleSwipeMove(deltaX);
    }
}

function handleMouseMove(e) {
    if (!isDragging || isFlipping) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        handleSwipeMove(deltaX);
    }
}

function handleSwipeMove(deltaX) {
    const swipeThreshold = 50;
    const maxRotation = 45;
    let rotation = Math.max(-maxRotation, Math.min(maxRotation, deltaX / 3));
    currentTransform = rotation;
    const currentPageElement = document.querySelector(`.page[data-page="${currentPage}"]`);
    if (currentPageElement && !currentPageElement.classList.contains('flipped')) {
        if (deltaX < -swipeThreshold) {
            currentPageElement.style.transform = `rotateY(${rotation}deg)`;
            currentPageElement.style.boxShadow = `${rotation / 10}px 10px 20px rgba(0,0,0,${0.3 + Math.abs(rotation / 100)})`;
        }
    } else if (currentPage > 0) {
        const prevPageElement = document.querySelector(`.page[data-page="${currentPage - 1}"]`);
        if (prevPageElement && prevPageElement.classList.contains('flipped') && deltaX > swipeThreshold) {
            prevPageElement.style.transform = `rotateY(${-180 + Math.abs(rotation)}deg)`;
            prevPageElement.style.boxShadow = `${-rotation / 10}px 10px 20px rgba(0,0,0,${0.3 + Math.abs(rotation / 100)})`;
        }
    }
}

function handleTouchEnd(e) {
    if (!isDragging || isFlipping) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = Date.now() - startTime;
    handleSwipeEnd(deltaX, deltaY, deltaTime);
}

function handleMouseEnd(e) {
    if (!isDragging || isFlipping) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const deltaTime = Date.now() - startTime;
    handleSwipeEnd(deltaX, deltaY, deltaTime);
}

function handleSwipeEnd(deltaX, deltaY, deltaTime) {
    isDragging = false;
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.style.transform = '';
        page.style.boxShadow = '';
    });
    
    const swipeThreshold = 50;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) {
            nextPage();
        } else {
            prevPage();
        }
    } else if (velocity > 0.5 && Math.abs(deltaX) > 30) {
        if (deltaX < 0) {
            nextPage();
        } else {
            prevPage();
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
    }
});

if(bookElem) {
    bookElem.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

const musicControl = document.getElementById('musicControl');
const birthdayAudio = document.getElementById('birthdayAudio');
let isPlaying = false;

if(birthdayAudio) {
    birthdayAudio.volume = 0.6;
}

function toggleMusic() {
    if(!birthdayAudio) return;
    
    if (isPlaying) {
        birthdayAudio.pause();
        if(musicControl){
            musicControl.innerHTML = '▶'; 
            musicControl.classList.remove('playing'); 
            musicControl.title = 'Play Music'; 
        }
        isPlaying = false;
    } else {
        birthdayAudio.play().then(() => {
            if(musicControl){
                musicControl.innerHTML = '⏸'; 
                musicControl.classList.add('playing'); 
                musicControl.title = 'Pause Music'; 
            }
            isPlaying = true;
        }).catch(error => {
            console.log(error);
        });
    }
}

if(musicControl) {
    musicControl.addEventListener('click', toggleMusic);
}

if(birthdayAudio) {
    birthdayAudio.addEventListener('error', (e) => {
        if(musicControl) musicControl.style.display = 'none';
    });
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying && birthdayAudio) {
        birthdayAudio.pause();
    }
});

let starsCreated = false;
function createStars() {
    if (starsCreated) return; 
    
    const starsContainer = document.getElementById('starsContainer');
    if(!starsContainer) return;
    
    starsContainer.innerHTML = '';
    const starCount = 100;
    const starSizes = ['small', 'medium', 'large'];
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = `star ${starSizes[Math.floor(Math.random() * starSizes.length)]}`;
        star.style.cssText = `left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-duration: ${Math.random() * 3 + 1}s; animation-delay: ${Math.random() * 2}s;`;
        fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment);
    starsCreated = true;
}

function showStars() {
    const starsContainer = document.getElementById('starsContainer');
    if(!starsContainer) return;
    createStars();
    starsContainer.style.display = 'block';
}

function hideStars() {
    const starsContainer = document.getElementById('starsContainer');
    if(starsContainer) {
        starsContainer.style.display = 'none';
    }
}

function cleanup() {
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
    if (typeof zIndexUpdateTimeout !== 'undefined' && zIndexUpdateTimeout) {
        clearTimeout(zIndexUpdateTimeout);
    }
    
    confettiPool.length = 0;
    heartPool.length = 0;
    photoCache.clear();
    
    heartPhotosCreated = 0;
    starsCreated = false;
    
    const book = document.getElementById('book');
    if (book) {
        const pages = book.querySelectorAll('.page');
        pages.forEach(page => {
            page.style.removeProperty('--page-z-index');
            page.style.removeProperty('--page-flipped-z-index');
        });
    }
}

let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const matrixCanvas = document.getElementById('matrix-rain');
        if (matrixCanvas) {
            matrixCanvas.width = window.innerWidth * 1.2;
            matrixCanvas.height = window.innerHeight * 1.2;
        }
    }, 100);
}

window.addEventListener('resize', handleResize);
window.addEventListener('beforeunload', cleanup);

let zIndexUpdateTimeout;
function calculatePageZIndexes() {
    const book = document.getElementById('book');
    if (!book) return;
    
    const pages = book.querySelectorAll('.page');
    const totalPages = pages.length;
    
    if (totalPages === 0) return;
    
    pages.forEach((page, physicalIndex) => {
        const normalZIndex = totalPages - physicalIndex;
        const flippedZIndex = physicalIndex + 1;
        
        page.style.setProperty('--page-z-index', normalZIndex.toString());
        page.style.setProperty('--page-flipped-z-index', flippedZIndex.toString());
    });
}

function updatePageZIndexes() {
    clearTimeout(zIndexUpdateTimeout);
    zIndexUpdateTimeout = setTimeout(() => {
        calculatePageZIndexes();
    }, 100);
}

function setupPageObserver() {
    const book = document.getElementById('book');
    if (!book) return;
    
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                shouldUpdate = true;
            }
        });
        if (shouldUpdate) {
            updatePageZIndexes();
        }
    });
    
    observer.observe(book, {
        childList: true,
        subtree: true
    });
}

function updateFullscreenBtnVisibility() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn && isMobile && !document.fullscreenElement) {
        fullscreenBtn.style.display = 'block';
        if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
        fullscreenBtn.hideTimeout = setTimeout(() => {
            fullscreenBtn.style.display = 'none';
        }, 2500);
    } else if (fullscreenBtn) {
        fullscreenBtn.style.display = 'none';
        if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
    }
}

const fullscreenBtn = document.getElementById('fullscreenBtn');
if (fullscreenBtn) {
    fullscreenBtn.onclick = function () {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                elem.requestFullscreen();
            }
        }
        fullscreenBtn.style.display = 'none';
        if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
    };
}
document.addEventListener('fullscreenchange', updateFullscreenBtnVisibility);

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
                    if(musicControl) {
                        musicControl.innerHTML = '⏸';
                        musicControl.classList.add('playing');
                    }
                }).catch(e => console.log("Audio auto-play prevented.", e));
            }

            if(isMobile) requestAutoFullscreen();

            S.init();
            window.playNextSequence();
        });
    }
    
    checkOrientation();
});