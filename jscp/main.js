// ==========================================
// 🎮 MAIN LOGIC (Book, Hearts, UI, Audio)
// ==========================================

let isLandscape = false;
let matrixInterval = null;
let hasSurpriseStarted = false; 
const confettiPool = [];
const maxConfetti = 50;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function createConfetti() { const confetti = document.createElement("div"); confetti.className = "confetti"; return confetti; }
function getConfettiFromPool() { if (confettiPool.length > 0) return confettiPool.pop(); return createConfetti(); }
function returnConfettiToPool(confetti) { confetti.remove(); confettiPool.push(confetti); }

function requestAutoFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen().catch(err => console.log(err));
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    }
}

function checkOrientation() {
    const orientationLock = document.getElementById('orientation-lock');
    const matrixCanvas = document.getElementById('matrix-rain');
    const mainCanvas = document.querySelector('.canvas');
    const startScreen = document.getElementById('start-screen');
    const musicControl = document.getElementById('musicControl');

    function handleReadyState() {
        if(orientationLock) orientationLock.style.display = 'none';
        
        if (!hasSurpriseStarted) {
            if(startScreen) startScreen.style.display = 'flex';
            if(matrixCanvas) matrixCanvas.style.display = 'none';
            if(mainCanvas) mainCanvas.style.display = 'none';
        } else {
            if(startScreen) startScreen.style.display = 'none';
            if(matrixCanvas) matrixCanvas.style.display = 'block';
            if(mainCanvas) mainCanvas.style.display = 'block';
            if(musicControl) musicControl.style.display = 'flex';
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
        } else {
            if(orientationLock) orientationLock.style.display = 'flex';
            if(startScreen) startScreen.style.display = 'none';
            if(matrixCanvas) matrixCanvas.style.display = 'none';
            if(mainCanvas) mainCanvas.style.display = 'none';
            if(musicControl) musicControl.style.display = 'none';
            stopWebsite();
        }

        mediaQuery.addEventListener('change', (e) => {
            isLandscape = e.matches;
            if (isLandscape) {
                handleReadyState();
            } else {
                if(orientationLock) orientationLock.style.display = 'flex';
                if(startScreen) startScreen.style.display = 'none';
                if(matrixCanvas) matrixCanvas.style.display = 'none';
                if(mainCanvas) mainCanvas.style.display = 'none';
                if(musicControl) musicControl.style.display = 'none';
                stopWebsite();
            }
        });
    }
}

function startWebsite() {
    if (!matrixInterval && typeof initMatrixRain === 'function') initMatrixRain();
    if (typeof S !== 'undefined' && S.UI) S.UI.reset(true);
    if (typeof S !== 'undefined') S.init(); 
    if (typeof S !== 'undefined') S.initialized = true;
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

const heartPool = [];
const maxFloatingHearts = 25; 
function createFloatingHeart() { const heart = document.createElement('div'); heart.className = 'heart'; return heart; }
function getHeartFromPool() { if (heartPool.length > 0) return heartPool.pop(); return createFloatingHeart(); }
function returnHeartToPool(heart) { heart.remove(); heartPool.push(heart); }
function showFloatingHearts() {
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💓', '💞'];
    let heartCount = 0;
    function spawnHeart() {
        if (heartCount >= maxFloatingHearts) return;
        const heart = getHeartFromPool();
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%'; heart.style.top = '100%'; heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
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
        bookContainer.style.display = 'block'; bookContainer.classList.add('show'); book.style.display = 'block';
        if(typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
        if(typeof setupPageObserver === 'function') setupPageObserver();

        requestAnimationFrame(() => {
            book.style.opacity = '0'; book.style.transform = 'scale(0.8) translateY(50px)'; book.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            requestAnimationFrame(() => {
                book.style.opacity = '1'; book.style.transform = 'scale(1) translateY(0)';
            });
        });
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 211, g: 155, b: 155 };
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
        confetti.style.setProperty('--x', (Math.random() * 400 - 200) + 'px'); confetti.style.setProperty('--y', (Math.random() * -400) + 'px');
        confetti.style.left = (window.innerWidth / 2) + 'px'; confetti.style.top = (window.innerHeight / 2) + 'px';
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
    fireworkContainer.innerHTML = ''; fireworkContainer.style.opacity = 1;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 20; i++) { 
        const fw = document.createElement('div'); fw.className = 'firework'; fw.style.transform = `rotate(${i * 18}deg) translateY(-40px)`; fragment.appendChild(fw);
    }
    fireworkContainer.appendChild(fragment);
    requestAnimationFrame(() => { setTimeout(() => { fireworkContainer.style.opacity = 0; }, 1000); });
}

const photoCache = new Map();
let heartPhotosCreated = 0;
const maxHeartPhotos = 30;

function preloadPhoto(url) {
    if (photoCache.has(url)) return photoCache.get(url);
    const img = new Image(); img.src = url; photoCache.set(url, img); return img;
}

function createHeartPhotoCentered(idx, total) {
    if (heartPhotosCreated >= maxHeartPhotos || photoUrls.length === 0) return;
    const photoUrl = photoUrls[idx % photoUrls.length];
    preloadPhoto(photoUrl);

    const photo = document.createElement('img');
    photo.src = photoUrl; photo.className = 'photo'; photo.style.zIndex = '300';
    const centerX = window.innerWidth * 0.5, centerY = window.innerHeight * 0.5, t = (idx / total) * 2 * Math.PI;
    const isLandscapeMobile = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
    const scale = isLandscapeMobile ? 8 : 16;
    const sin_t = Math.sin(t), cos_t = Math.cos(t);
    const targetX = scale * 16 * Math.pow(sin_t, 3);
    const targetY = -scale * (13 * cos_t - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    photo.style.left = centerX + 'px'; photo.style.top = centerY + 'px'; photo.style.opacity = '0'; photo.style.transform = 'translate(-50%, -50%) scale(0)'; photo.style.transition = 'all 1.5s ease-out'; 
    document.body.appendChild(photo);
    heartPhotosCreated++;
    requestAnimationFrame(() => {
        photo.style.opacity = '1'; photo.style.transform = 'translate(-50%, -50%) scale(1)'; photo.style.left = (centerX + targetX) + 'px'; photo.style.top = (centerY + targetY) + 'px';
    });
}

function spawnHeartPhotosCentered() {
    heartPhotosCreated = 0;
    photoUrls.forEach(url => preloadPhoto(url));
    let currentIndex = 0;
    function spawnNext() {
        if (currentIndex < maxHeartPhotos) {
            createHeartPhotoCentered(currentIndex, maxHeartPhotos); currentIndex++;
            setTimeout(() => { requestAnimationFrame(spawnNext); }, 80); 
        }
    }
    spawnNext();
}

function startHeartEffect() {
    const currentSettings = window.settings || {};
    if (!currentSettings.enableHeart) return;
    const book = document.getElementById('book'); const bookContainer = document.querySelector('.book-container'); const contentDisplay = document.getElementById('contentDisplay');
    if (book) { book.style.display = 'none'; book.classList.remove('show'); }
    if (bookContainer) { bookContainer.style.display = 'none'; bookContainer.classList.remove('show'); }
    if (contentDisplay) { contentDisplay.classList.remove('show'); }

    requestAnimationFrame(() => {
        setTimeout(() => showConfetti(), 100);
        setTimeout(() => showFirework(), 200);
        setTimeout(() => spawnHeartPhotosCentered(), 300);
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
                // 🎯 Timeline logic will handle what happens next (handled in engine.js window.onBookFinished)
                if (typeof window.onBookFinished === 'function') {
                    window.onBookFinished();
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
            if(pageToFlip) { pageToFlip.classList.remove('flipping'); pageToFlip.classList.add('flipped'); }
            currentPage++; isFlipping = false; showPageContent(); checkBookFinished();
        }, 400);
    } else if (currentPage === totalPhysicalPages - 1 && !isFlipping) {
        const lastPage = document.querySelector(`.page[data-page="${currentPage}"]`);
        if (lastPage && !lastPage.classList.contains('flipped')) {
            isFlipping = true; lastPage.classList.add('flipping');
            setTimeout(() => {
                lastPage.classList.remove('flipping'); lastPage.classList.add('flipped');
                isFlipping = false; showPageContent(); checkBookFinished();
            }, 400);
        }
    }
}

function prevPage() {
    if (currentPage > 0 && !isFlipping) {
        isFlipping = true; currentPage--;
        const pageToFlip = document.querySelector(`.page[data-page="${currentPage}"]`);
        if(pageToFlip) pageToFlip.classList.add('flipping');
        setTimeout(() => {
            if(pageToFlip) { pageToFlip.classList.remove('flipping'); pageToFlip.classList.remove('flipped'); }
            isFlipping = false; showPageContent(); isBookFinished = false;
        }, 400);
    }
}

function typewriterEffect(element, text, speed = 50) {
    return new Promise((resolve) => {
        element.innerHTML = ''; let i = 0; let lastScrollTime = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i); i++;
                const now = Date.now();
                if (now - lastScrollTime > 100) { 
                    const container = element.closest('.content-display');
                    if (container && container.scrollHeight > container.clientHeight) { container.scrollTop = container.scrollHeight - container.clientHeight; }
                    lastScrollTime = now;
                }
                if (speed < 16) requestAnimationFrame(type); else typewriterTimeout = setTimeout(type, speed);
            } else resolve();
        }
        type();
    });
}

async function showPageContent() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if(!window.settings || !window.settings.pages) return;
    
    let logicalPageIndex = 0;
    if (currentPage === 0) logicalPageIndex = 0;
    else {
        const currentPhysicalPage = document.querySelector(`.page[data-page="${currentPage}"]`);
        if (currentPhysicalPage && currentPhysicalPage.classList.contains('flipped')) logicalPageIndex = currentPage * 2 + 1;
        else logicalPageIndex = currentPage * 2;
    }
    const contentToShow = window.settings.pages[logicalPageIndex]?.content;
    if (contentToShow && contentDisplay && contentText) {
        contentDisplay.classList.add('show'); contentText.innerHTML = '';
        await typewriterEffect(contentText, contentToShow, 30);
    } else if(contentDisplay) {
        contentDisplay.classList.remove('show');
    }
}

let startX = 0, startY = 0, startTime = 0, isDragging = false, currentTransform = 0;

if(book) {
    book.addEventListener('touchstart', handleTouchStart, { passive: false });
    book.addEventListener('touchmove', handleTouchMove, { passive: false });
    book.addEventListener('touchend', handleTouchEnd, { passive: false });
    book.addEventListener('mousedown', handleMouseStart);
    book.addEventListener('mousemove', handleMouseMove);
    book.addEventListener('mouseup', handleMouseEnd);
    book.addEventListener('mouseleave', handleMouseEnd);
}

function handleTouchStart(e) {
    if (isFlipping) return;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY; startTime = Date.now(); isDragging = true; currentTransform = 0;
}
function handleMouseStart(e) {
    if (isFlipping) return;
    startX = e.clientX; startY = e.clientY; startTime = Date.now(); isDragging = true; currentTransform = 0; e.preventDefault();
}
function handleTouchMove(e) {
    if (!isDragging || isFlipping) return; e.preventDefault();
    const currentX = e.touches[0].clientX, currentY = e.touches[0].clientY, deltaX = currentX - startX, deltaY = currentY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) handleSwipeMove(deltaX);
}
function handleMouseMove(e) {
    if (!isDragging || isFlipping) return;
    const deltaX = e.clientX - startX, deltaY = e.clientY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) handleSwipeMove(deltaX);
}
function handleSwipeMove(deltaX) {
    const swipeThreshold = 50, maxRotation = 45;
    let rotation = Math.max(-maxRotation, Math.min(maxRotation, deltaX / 3)); currentTransform = rotation;
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
    const endX = e.changedTouches[0].clientX, endY = e.changedTouches[0].clientY, deltaX = endX - startX, deltaY = endY - startY, deltaTime = Date.now() - startTime;
    handleSwipeEnd(deltaX, deltaY, deltaTime);
}
function handleMouseEnd(e) {
    if (!isDragging || isFlipping) return;
    const deltaX = e.clientX - startX, deltaY = e.clientY - startY, deltaTime = Date.now() - startTime;
    handleSwipeEnd(deltaX, deltaY, deltaTime);
}
function handleSwipeEnd(deltaX, deltaY, deltaTime) {
    isDragging = false;
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => { page.style.transform = ''; page.style.boxShadow = ''; });
    const swipeThreshold = 50, velocity = Math.abs(deltaX) / deltaTime;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) nextPage(); else prevPage();
    } else if (velocity > 0.5 && Math.abs(deltaX) > 30) {
        if (deltaX < 0) nextPage(); else prevPage();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextPage(); } 
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prevPage(); }
});

if(book) book.addEventListener('contextmenu', (e) => e.preventDefault());

const musicControl = document.getElementById('musicControl');
const birthdayAudio = document.getElementById('birthdayAudio');
let isPlaying = false;

if(birthdayAudio) birthdayAudio.volume = 0.6;

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
        }).catch(error => { console.log(error) });
    }
}

if(musicControl) musicControl.addEventListener('click', toggleMusic);
if(birthdayAudio) birthdayAudio.addEventListener('error', (e) => { if(musicControl) musicControl.style.display = 'none'; });
document.addEventListener('visibilitychange', () => { if (document.hidden && isPlaying && birthdayAudio) birthdayAudio.pause(); });

let starsCreated = false;
function createStars() {
    if (starsCreated) return; 
    const starsContainer = document.getElementById('starsContainer');
    if(!starsContainer) return;
    starsContainer.innerHTML = '';
    const starCount = 100, starSizes = ['small', 'medium', 'large'], fragment = document.createDocumentFragment();
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = `star ${starSizes[Math.floor(Math.random() * starSizes.length)]}`;
        star.style.cssText = `left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-duration: ${Math.random() * 3 + 1}s; animation-delay: ${Math.random() * 2}s;`;
        fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment); starsCreated = true;
}

function showStars() {
    const starsContainer = document.getElementById('starsContainer');
    if(!starsContainer) return; createStars(); starsContainer.style.display = 'block';
}

function hideStars() {
    const starsContainer = document.getElementById('starsContainer');
    if(starsContainer) starsContainer.style.display = 'none';
}

function cleanup() {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if (typeof zIndexUpdateTimeout !== 'undefined' && zIndexUpdateTimeout) clearTimeout(zIndexUpdateTimeout);
    confettiPool.length = 0; heartPool.length = 0; photoCache.clear();
    heartPhotosCreated = 0; starsCreated = false;
    const book = document.getElementById('book');
    if (book) {
        const pages = book.querySelectorAll('.page');
        pages.forEach(page => { page.style.removeProperty('--page-z-index'); page.style.removeProperty('--page-flipped-z-index'); });
    }
}

let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const matrixCanvas = document.getElementById('matrix-rain');
        if (matrixCanvas) { matrixCanvas.width = window.innerWidth; matrixCanvas.height = window.innerHeight; }
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
        const normalZIndex = totalPages - physicalIndex, flippedZIndex = physicalIndex + 1;
        page.style.setProperty('--page-z-index', normalZIndex.toString());
        page.style.setProperty('--page-flipped-z-index', flippedZIndex.toString());
    });
}

function updatePageZIndexes() {
    clearTimeout(zIndexUpdateTimeout);
    zIndexUpdateTimeout = setTimeout(() => calculatePageZIndexes(), 100);
}

function setupPageObserver() {
    const book = document.getElementById('book');
    if (!book) return;
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => { if (mutation.type === 'childList') shouldUpdate = true; });
        if (shouldUpdate) updatePageZIndexes();
    });
    observer.observe(book, { childList: true, subtree: true });
}

function updateFullscreenBtnVisibility() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn && isMobile && !document.fullscreenElement) {
        fullscreenBtn.style.display = 'block';
        if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
        fullscreenBtn.hideTimeout = setTimeout(() => { fullscreenBtn.style.display = 'none'; }, 2500);
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
            if (document.fullscreenElement) document.exitFullscreen();
            else elem.requestFullscreen();
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
            
            const matrixCanvas = document.getElementById('matrix-rain');
            const mainCanvas = document.querySelector('.canvas');
            const musicControl = document.getElementById('musicControl');
            
            if(matrixCanvas) matrixCanvas.style.display = 'block';
            if(mainCanvas) mainCanvas.style.display = 'block';
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
            startWebsite();
        });
    }
    
    checkOrientation();
});
