// ==========================================
// 🎈 CLIENT SETTINGS (For surprise.html)
// ==========================================

const defaultSettings = {
    music: './music/zahra.mp3', countdown: 3, matrixText: 'HAPPYBIRTHDAY', sequence: 'HAPPY|BIRTHDAY|ZAHRA|❤',
    effectSequence: ['memory', 'matrix', 'book', 'hearts'], 
    memoryCard: { title: 'Hyy Baby ❤️', message: 'Today is your special day!', image: './image/Birthday!/cover.jpg', btnText: 'Open Memories ✨' },
    innerMemory: { title: 'Birthday Memories', message: 'These are the moments...', btnText: 'Read My Heart 💌', photos: ['', '', '', '', '', ''] },
    loveNote: { letter: 'My Dearest...', title: 'A Love Note', subText: 'A few words...', btnText: "Let's Play a Game!" },
    // 🎯 Default Mystery Cards
    mysteryCards: { title: "Why You're Special 🎂", subText: "Click on the cards to reveal!", btnText: "Next ➔", cards: ["You are kind", "You are beautiful", "You inspire me", "You are smart", "You are funny", "I love your smile", "You are caring", "You are my world", "I love you!"] },
    colorTheme: 'pink', pages: []
};

async function loadSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    const dbId = urlParams.get('id');

    if (dbId) {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${dbId}`);
            const data = await response.json();
            if (data.record) {
                window.settings = data.record; applyLoadedSettings(); return;
            } else throw new Error("Invalid data");
        } catch (e) { fallbackToLocalOrDefaults(); }
    } else fallbackToLocalOrDefaults();
}

function fallbackToLocalOrDefaults() {
    const savedSettings = localStorage.getItem("birthdaySettings");
    if (savedSettings) window.settings = JSON.parse(savedSettings);
    else window.settings = defaultSettings;
    applyLoadedSettings();
}

function applyLoadedSettings() {
    const settings = window.settings;
    const birthdayAudio = document.getElementById('birthdayAudio');
    if (birthdayAudio) birthdayAudio.src = settings.music;

    if (typeof matrixChars !== 'undefined') matrixChars = settings.matrixText.split('');

    createPages();
    createInnerMemoryScreen();
    createMysteryCardsScreen(); // 🎯 Generate 9 Cards
}

function createInnerMemoryScreen() {
    const currentSettings = window.settings || {};
    if (currentSettings.innerMemory) {
        const inPhotoGrid = document.getElementById('innerPhotoGrid');
        if (inPhotoGrid && currentSettings.innerMemory.photos) {
            inPhotoGrid.innerHTML = '';
            currentSettings.innerMemory.photos.forEach((url, index) => {
                if (url && url.trim() !== '') {
                    const polaroid = document.createElement('div');
                    polaroid.className = 'polaroid';
                    polaroid.setAttribute('ontouchstart', ''); 
                    const rotation = index % 2 === 0 ? '3deg' : '-3deg';
                    polaroid.style.transform = `rotate(${rotation})`;
                    polaroid.innerHTML = `<img src="${url}" alt="Memory">`;
                    inPhotoGrid.appendChild(polaroid);
                }
            });
        }
    }
}

// 🎯 Generate 9 Mystery Cards
function createMysteryCardsScreen() {
    const currentSettings = window.settings || {};
    if(currentSettings.mysteryCards) {
        const grid = document.getElementById('mysteryGrid');
        if(grid && currentSettings.mysteryCards.cards) {
            grid.innerHTML = '';
            currentSettings.mysteryCards.cards.forEach((msg) => {
                const card = document.createElement('div');
                card.className = 'flip-card';
                card.innerHTML = `
                    <div class="flip-card-inner">
                        <div class="flip-card-front">?</div>
                        <div class="flip-card-back">${msg || '❤️'}</div>
                    </div>
                `;
                // Click to flip
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
                grid.appendChild(card);
            });
        }
    }
}

function createPages() {
    const book = document.getElementById('book');
    if(!book) return;
    book.innerHTML = '';
    const pages = window.settings.pages || [];
    if (pages.length === 0) return;

    if (pages.length % 2 !== 0) {
        const backCover = pages.pop();
        pages.push({ image: '', content: '' });
        pages.push(backCover);
    }
    const totalPhysicalPages = Math.ceil(pages.length / 2);

    for (let physicalPageIndex = 0; physicalPageIndex < totalPhysicalPages; physicalPageIndex++) {
        const page = document.createElement('div'); page.classList.add('page'); page.dataset.page = physicalPageIndex;
        const frontLogicalIndex = physicalPageIndex * 2, backLogicalIndex = frontLogicalIndex + 1;

        const front = document.createElement('div'); front.classList.add('page-front');
        if (frontLogicalIndex < pages.length && pages[frontLogicalIndex]) {
            const frontPageData = pages[frontLogicalIndex];
            if (frontPageData.image && frontPageData.image.trim() !== "") { const img = document.createElement('img'); img.src = frontPageData.image; front.appendChild(img); }
            if (frontPageData.content && frontPageData.content.trim() !== "") { const div = document.createElement('div'); div.classList.add('page-text'); div.textContent = frontPageData.content; front.appendChild(div); }
            if(!frontPageData.image && !frontPageData.content) front.classList.add('empty-page');
        }

        const back = document.createElement('div'); back.classList.add('page-back');
        if (backLogicalIndex < pages.length && pages[backLogicalIndex]) {
            const backPageData = pages[backLogicalIndex];
            if (backPageData.image && backPageData.image.trim() !== "") { const img = document.createElement('img'); img.src = backPageData.image; back.appendChild(img); }
            if (backPageData.content && backPageData.content.trim() !== "") { const div = document.createElement('div'); div.classList.add('page-text'); div.textContent = backPageData.content; back.appendChild(div); }
            if(!backPageData.image && !backPageData.content) back.classList.add('empty-page');
        }

        page.appendChild(front); page.appendChild(back); book.appendChild(page);

        page.addEventListener('click', (e) => {
            if (typeof isFlipping !== 'undefined' && !isFlipping) {
                const rect = page.getBoundingClientRect(); const clickX = e.clientX - rect.left;
                if (clickX < rect.width / 2 && page.classList.contains('flipped')) { if (typeof prevPage === 'function') prevPage(); } 
                else if (clickX >= rect.width / 2 && !page.classList.contains('flipped')) { if (typeof nextPage === 'function') nextPage(); }
            }
        });
    }
    if (typeof photoUrls !== 'undefined') photoUrls = pages.filter(p => !p.isCover && p.image && p.image.trim() !== "").map(p => p.image);
    if (typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
}

document.addEventListener('DOMContentLoaded', async function () {
    await loadSettings();
    window.isWebsiteReady = true;
    if (typeof tryStartWebsiteWhenLandscape === 'function') tryStartWebsiteWhenLandscape();
    else if (typeof startWebsite === 'function') startWebsite();
});
