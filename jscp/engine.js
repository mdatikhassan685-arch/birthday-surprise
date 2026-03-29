// ==========================================
// ⚙️ ANIMATION ENGINE (Matrix, Shapes, Dots)
// ==========================================

window.matrixChars = "HAPPYBIRTHDAY".split("");

window.initMatrixRain = function() {
    const matrixCanvas = document.getElementById('matrix-rain');
    if(!matrixCanvas) return;
    const matrixCtx = matrixCanvas.getContext('2d');

    matrixCanvas.width = window.innerWidth * 1.2;
    matrixCanvas.height = window.innerHeight * 1.2;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
            if (!started[i] && currentTime - startTime >= delays[i]) started[i] = true;

            if (started[i] && drops[i] < maxLength) {
                const text = window.matrixChars[Math.floor(Math.random() * window.matrixChars.length)];
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

    window.matrixInterval = setInterval(drawMatrixRain, intervalTime);

    window.addEventListener('resize', () => {
        clearTimeout(window.matrixResizeTimeout);
        window.matrixResizeTimeout = setTimeout(() => {
            if(matrixCanvas) {
                matrixCanvas.width = window.innerWidth * 1.2;
                matrixCanvas.height = window.innerHeight * 1.2;
            }
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
};

window.S = {
    initialized: false,
    init: function () {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (!isLandscape && isMobile) {
            return;
        }
        
        const currentSettings = window.settings || {};
        const countdownValue = currentSettings.countdown || 3;
        const sequenceText = currentSettings.sequence || 'HAPPY|BIRTHDAY|ZAHRA|❤';
        
        const sequence = `|#countdown ${countdownValue}|${sequenceText}|#gift|`;
        window.S.UI.simulate(sequence);

        window.S.Drawing.init('.canvas');
        document.body.classList.add('body--ready');

        window.S.Drawing.loop(function () {
            window.S.Shape.render();
        });
    }
};

window.S.Drawing = (function () {
    var canvas, context, renderFn,
        requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };

    return {
        init: function (el) {
            canvas = document.querySelector(el);
            if(!canvas) return;
            context = canvas.getContext('2d');
            this.adjustCanvas();
            window.addEventListener('resize', () => window.S.Drawing.adjustCanvas());
        },
        loop: function (fn) {
            renderFn = !renderFn ? fn : renderFn;
            this.clearFrame();
            renderFn();
            requestFrame.call(window, this.loop.bind(this));
        },
        adjustCanvas: function () {
            if(!canvas) return;
            canvas.width = window.innerWidth * 1.2;
            canvas.height = window.innerHeight * 1.2;
        },
        clearFrame: function () {
            if(!context) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
        },
        getArea: function () {
            if (!canvas) return { w: window.innerWidth || 800, h: window.innerHeight || 600 };
            return { w: canvas.width, h: canvas.height };
        },
        drawCircle: function (p, c) {
            if(!context) return;
            context.fillStyle = c.render();
            context.beginPath();
            context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
        }
    };
}());

window.S.UI = (function () {
    var interval, currentAction, time, maxShapeSize = 30, sequence = [], cmd = '#';

    function formatTime(date) {
        var h = date.getHours(), m = date.getMinutes();
        m = m < 10 ? '0' + m : m;
        return h + ':' + m;
    }

    function getValue(value) { return value && value.split(' ')[1]; }
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
        destroy && window.S.Shape.switchShape(window.S.ShapeBuilder.letter(''));
    }

    function performAction(value) {
        var action, current;
        sequence = typeof (value) === 'object' ? value : sequence.concat(value.split('|'));

        function getDynamicDelay(str) {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    timedAction(function (index) {
                        if (index === 0) {
                            if (sequence.length === 0) window.S.Shape.switchShape(window.S.ShapeBuilder.letter(''));
                            else performAction(sequence);
                        } else {
                            window.S.Shape.switchShape(window.S.ShapeBuilder.letter(index), true);
                        }
                    }, isMobile ? 1300 : 1400, value, true);
                    break;
                case 'circle':
                    value = parseInt(value) || maxShapeSize;
                    value = Math.min(value, maxShapeSize);
                    window.S.Shape.switchShape(window.S.ShapeBuilder.circle(value));
                    break;
                case 'time':
                    var t = formatTime(new Date());
                    if (sequence.length > 0) window.S.Shape.switchShape(window.S.ShapeBuilder.letter(t));
                    else {
                        timedAction(function () {
                            t = formatTime(new Date());
                            if (t !== time) { time = t; window.S.Shape.switchShape(window.S.ShapeBuilder.letter(time)); }
                        }, 1000);
                    }
                    break;
                case 'gift':
                    const canvas = document.querySelector('.canvas');
                    const giftImage = document.getElementById('gift-image');
                    const matrixCanvas = document.getElementById('matrix-rain');

                    if (typeof showStars === 'function') showStars();
                    if (typeof showFloatingHearts === 'function') showFloatingHearts();

                    const currentSettings = window.settings || {};

                    // 🎯 Timeline Logic - Function to trigger the next phase
                    function triggerNextPhase() {
                        const phaseSequence = currentSettings.sequenceOrder || ['memory', 'book', 'hearts'];
                        let currentPhaseIndex = 0;

                        function executePhase(phaseName) {
                            if (phaseName === 'none') {
                                proceedSequence();
                                return;
                            }

                            if (phaseName === 'memory') {
                                if (currentSettings.enableMemory) {
                                    const memCard = document.getElementById('memoryCardUI');
                                    if (memCard) {
                                        if (canvas) canvas.style.display = 'none'; 
                                        if (matrixCanvas) matrixCanvas.style.display = 'none';
                                        
                                        document.getElementById('memUiHeading').innerText = currentSettings.memoryHeading || 'Hyy Baby ❤️';
                                        document.getElementById('memUiText').innerText = currentSettings.memoryText || 'Today is your special day...';
                                        document.getElementById('memUiBtn').innerText = currentSettings.memoryBtnText || 'Open Memories ✨';
                                        if(currentSettings.memoryImage) document.getElementById('memUiImg').src = currentSettings.memoryImage;
                                        
                                        memCard.style.display = 'flex';
                                        
                                        document.getElementById('memUiBtn').onclick = () => {
                                            memCard.style.display = 'none';
                                            proceedSequence();
                                        };
                                    } else proceedSequence();
                                } else proceedSequence();
                            } 
                            
                            else if (phaseName === 'book') {
                                if (currentSettings.enableBook) {
                                    if (canvas) canvas.style.display = 'none'; 
                                    if (matrixCanvas) matrixCanvas.style.display = 'none';
                                    if (typeof showBook === 'function') showBook();
                                    window.onBookFinished = proceedSequence;
                                } else proceedSequence();
                            } 
                            
                            else if (phaseName === 'hearts') {
                                if (currentSettings.enableHeart) {
                                    if (canvas) canvas.style.display = 'none'; 
                                    if (matrixCanvas) matrixCanvas.style.display = 'none';
                                    if (typeof startHeartEffect === 'function') startHeartEffect();
                                    setTimeout(proceedSequence, 5000);
                                } else proceedSequence();
                            }
                        }

                        function proceedSequence() {
                            currentPhaseIndex++;
                            if (currentPhaseIndex < phaseSequence.length) {
                                executePhase(phaseSequence[currentPhaseIndex]);
                            }
                        }

                        executePhase(phaseSequence[0]);
                    }

                    if (giftImage && giftImage.src && giftImage.src !== window.location.href && giftImage.src !== '') {
                        giftImage.style.display = 'block';
                        giftImage.style.animation = 'giftCelebration 2s ease-in-out';
                        setTimeout(() => { 
                            giftImage.style.display = 'none'; 
                            triggerNextPhase(); 
                        }, 3000);
                    } else {
                        triggerNextPhase(); 
                    }
                    break;
                default:
                    window.S.Shape.switchShape(window.S.ShapeBuilder.letter(current[0] === cmd ? 'What?' : current));
            }
        }, getDynamicDelay(sequence[0]), sequence.length);
    }

    return {
        simulate: function (action) {
            const isLandscape = window.innerWidth > window.innerHeight;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isLandscape || !isMobile) {
                performAction(action);
            }
        },
        reset: function (destroy) { reset(destroy); }
    };
}());

window.S.Point = function (args) {
    this.x = args.x; this.y = args.y; this.z = args.z; this.a = args.a; this.h = args.h;
};
window.S.Color = function (r, g, b, a) {
    this.r = r; this.g = g; this.b = b; this.a = a;
};
window.S.Color.prototype = { render: function () { return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'; } };

window.S.Dot = function (x, y) {
    this.p = new window.S.Point({ x: x, y: y, z: this.getDotSize(), a: 1, h: 0 });
    this.e = 0.07;
    this.s = true;
    const currentSettings = window.settings || {sequenceColor: '#ff69b4'};
    const rgb = hexToRgb(currentSettings.sequenceColor);
    this.c = new window.S.Color(rgb.r, rgb.g, rgb.b, this.p.a);
    this.t = this.clone();
    this.q = [];
};
window.S.Dot.prototype = {
    getDotSize: function () { 
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobile ? 2 : 4; 
    },
    clone: function () { return new window.S.Point({ x: this.x, y: this.y, z: this.z, a: this.a, h: this.h }); },
    _draw: function () {
        const currentSettings = window.settings || {sequenceColor: '#ff69b4'};
        const rgb = hexToRgb(currentSettings.sequenceColor);
        this.c.r = rgb.r; this.c.g = rgb.g; this.c.b = rgb.b; this.c.a = this.p.a;
        window.S.Drawing.drawCircle(this.p, this.c);
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
            if (p) { this.t.x = p.x || this.p.x; this.t.y = p.y || this.p.y; this.t.z = p.z || this.p.z; this.t.a = p.a || this.p.a; this.p.h = p.h || 0; }
            else {
                if (this.s) {
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    const amplitude = isMobile ? 0.1 : 3.142;
                    this.p.x -= Math.sin(Math.random() * amplitude); this.p.y -= Math.sin(Math.random() * amplitude);
                } else {
                    this.move(new window.S.Point({ x: this.p.x + (Math.random() * 50) - 25, y: this.p.y + (Math.random() * 50) - 25 }));
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

window.S.ShapeBuilder = (function () {
    var shapeCanvas = document.createElement('canvas'), shapeContext = shapeCanvas.getContext('2d'), fontFamily = 'Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';
    function getGap() { 
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobile ? 4 : 8; 
    }
    function fit() {
        const gap = getGap();
        shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
        shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
        shapeContext.fillStyle = 'red'; shapeContext.textBaseline = 'middle'; shapeContext.textAlign = 'center';
    }
    function processCanvas() {
        const gap = getGap();
        var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data, dots = [], x = 0, y = 0, fx = shapeCanvas.width, fy = shapeCanvas.height, w = 0, h = 0;
        for (var p = 0; p < pixels.length; p += (4 * gap)) {
            if (pixels[p + 3] > 0) {
                dots.push(new window.S.Point({ x: x, y: y }));
                w = x > w ? x : w; h = y > h ? y : h; fx = x < fx ? x : fx; fy = y < fy ? y : fy;
            }
            x += gap;
            if (x >= shapeCanvas.width) { x = 0; y += gap; p += gap * 4 * shapeCanvas.width; }
        }
        return { dots: dots, w: w + fx, h: h + fy };
    }
    function setFontSize(s) { shapeContext.font = 'bold ' + s + 'px ' + fontFamily; }
    function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
    function init() { fit(); window.addEventListener('resize', fit); }
    init();

    return {
        circle: function (d) {
            var r = Math.max(0, d) / 2; const gap = getGap();
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.beginPath(); shapeContext.arc(r * gap, r * gap, r * gap, 0, 2 * Math.PI, false); shapeContext.fill(); shapeContext.closePath();
            return processCanvas();
        },
        letter: function (l) {
            var s = 0; const isSmallScreen = window.innerWidth < 768; 
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const baseFontSize = (isMobile || isSmallScreen) ? 250 : 500;
            setFontSize(baseFontSize);
            s = Math.min(baseFontSize, (shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * baseFontSize, (shapeCanvas.height / baseFontSize) * (isNumber(l) ? 0.8 : 0.35) * baseFontSize);
            setFontSize(s);
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);
            return processCanvas();
        }
    };
}());

window.S.Shape = (function () {
    var dots = [], width = 0, height = 0, cx = 0, cy = 0;
    function compensate() { var a = window.S.Drawing.getArea(); cx = a.w / 2 - width / 2; cy = a.h / 2 - height / 2; }
    function getDotCreationParams() {
        const isSmallScreen = window.innerWidth < 768;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile || isSmallScreen) return { minSize: 1, maxSize: 4, minZ: 2, maxZ: 3 };
        else return { minSize: 3, maxSize: 12, minZ: 4, maxZ: 8 };
    }

    return {
        switchShape: function (n, fast) {
            var size, a = window.S.Drawing.getArea();
            width = n.w; height = n.h;
            compensate();
            const params = getDotCreationParams();

            if (n.dots.length > dots.length) {
                size = n.dots.length - dots.length;
                for (var d = 1; d <= size; d++) dots.push(new window.S.Dot(a.w / 2, a.h / 2));
            }

            var d = 0, i = 0;
            while (n.dots.length > 0) {
                i = Math.floor(Math.random() * n.dots.length);
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                dots[d].e = isMobile ? 0.35 : 0.11;

                if (dots[d].s) {
                    dots[d].move(new window.S.Point({ z: Math.random() * (params.maxSize - params.minSize) + params.minSize, a: Math.random(), h: 18 }));
                } else {
                    dots[d].move(new window.S.Point({ z: Math.random() * (params.minZ) + params.minZ, h: fast ? 18 : 30 }));
                }

                dots[d].s = true;
                dots[d].move(new window.S.Point({ x: n.dots[i].x + cx, y: n.dots[i].y + cy, a: 1, z: params.minZ, h: 0 }));
                n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
                d++;
            }

            for (var i = d; i < dots.length; i++) {
                if (dots[i].s) {
                    dots[i].move(new window.S.Point({ z: Math.random() * (params.maxSize - params.minSize) + params.minSize, a: Math.random(), h: 20 }));
                    dots[i].s = false; dots[i].e = 0.04;
                    dots[i].move(new window.S.Point({ x: Math.random() * a.w, y: Math.random() * a.h, a: 0.3, z: Math.random() * params.minZ, h: 0 }));
                }
            }
        },
        render: function () { for (var d = 0; d < dots.length; d++) dots[d].render(); }
    };
}());

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 211, g: 155, b: 155 };
}
