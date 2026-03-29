// ==========================================
// 🎈 CLIENT SETTINGS (For surprise.html)
// ==========================================

const defaultSettings = {
    music: './music/zahra.mp3', countdown: 3, matrixText: 'HAPPYBIRTHDAY', matrixColor1: '#ff69b4', matrixColor2: '#ff1493', sequence: 'HAPPY|BIRTHDAY|NAME|❤', sequenceColor: '#ff69b4', gift: '', colorTheme: 'pink',
    sequenceOrder: ['memory', 'book', 'hearts'], // 🎯 Default Timeline
    pages: [ { image: './image/Birthday!/cover.jpg', content: '' }, { image: './image/Birthday!/photo1.jpg', content: '💕' }, { image: './image/Birthday!/photo2.jpg', content: '' } ]
};

async function loadSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    const dbId = urlParams.get('id'); 
    const magicData = urlParams.get('data'); 

    if (dbId) {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${dbId}`);
            const data = await response.json();
            if (data.record) { window.settings = data.record; applyLoadedSettings(); return; }
        } catch (e) { fallbackToLocalOrDefaults(); }
    } else if (magicData) {
        try {
            window.settings = JSON.parse(decodeURIComponent(escape(atob(magicData))));
            applyLoadedSettings(); return;
        } catch (e) { fallbackToLocalOrDefaults(); }
    } else {
        fallbackToLocalOrDefaults();
    }
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
    const giftImageElement = document.getElementById('gift-image');
    if (giftImageElement && settings.gift) giftImageElement.src = settings.gift;
    if (typeof matrixChars !== 'undefined') matrixChars = settings.matrixText.split('');
    createPages();
}

function createPages() {
    const book = document.getElementById('book');
    if(!book) return;
    book.innerHTML = '';
    const pages = window.settings.pages || [];
    if (pages.length === 0) return;

    const totalPhysicalPages = Math.ceil(pages.length / 2);

    for (let physicalPageIndex = 0; physicalPageIndex < totalPhysicalPages; physicalPageIndex++) {
        const page = document.createElement('div');
        page.classList.add('page'); page.dataset.page = physicalPageIndex;
        const frontLogicalIndex = physicalPageIndex * 2, backLogicalIndex = frontLogicalIndex + 1;

        const front = document.createElement('div'); front.classList.add('page-front');
        if (frontLogicalIndex < pages.length && pages[frontLogicalIndex]) {
            if (pages[frontLogicalIndex].image) { const img = document.createElement('img'); img.src = pages[frontLogicalIndex].image; front.appendChild(img); }
            if (pages[frontLogicalIndex].content) { const textDiv = document.createElement('div'); textDiv.classList.add('page-text'); textDiv.textContent = pages[frontLogicalIndex].content; front.appendChild(textDiv); }
            if(!pages[frontLogicalIndex].image && !pages[frontLogicalIndex].content) front.textContent = 'Empty';
        }

        const back = document.createElement('div'); back.classList.add('page-back');
        if (backLogicalIndex < pages.length && pages[backLogicalIndex]) {
            if (pages[backLogicalIndex].image) { const img = document.createElement('img'); img.src = pages[backLogicalIndex].image; back.appendChild(img); }
            if (pages[backLogicalIndex].content) { const textDiv = document.createElement('div'); textDiv.classList.add('page-text'); textDiv.textContent = pages[backLogicalIndex].content; back.appendChild(textDiv); }
            if(!pages[backLogicalIndex].image && !pages[backLogicalIndex].content) back.textContent = 'Empty';
        } else {
            const img = document.createElement('img'); img.src = './image/theend.jpg'; back.appendChild(img);
        }

        page.appendChild(front); page.appendChild(back); book.appendChild(page);

        page.addEventListener('click', (e) => {
            if (typeof isFlipping !== 'undefined' && !isFlipping) {
                const rect = page.getBoundingClientRect();
                if (e.clientX - rect.left < rect.width / 2 && page.classList.contains('flipped')) { if (typeof prevPage === 'function') prevPage(); } 
                else if (e.clientX - rect.left >= rect.width / 2 && !page.classList.contains('flipped')) { if (typeof nextPage === 'function') nextPage(); }
            }
        });
    }
    if (typeof photoUrls !== 'undefined') photoUrls = pages.filter(p => p.image).map(p => p.image);
    if (typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
}

document.addEventListener('DOMContentLoaded', async function () {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    if (book) { book.style.display = 'none'; book.classList.remove('show'); }
    if (bookContainer) { bookContainer.style.display = 'none'; bookContainer.classList.remove('show'); }

    await loadSettings();
    window.isWebsiteReady = true;

    if (typeof tryStartWebsiteWhenLandscape === 'function') tryStartWebsiteWhenLandscape();
    else if (typeof startWebsite === 'function') startWebsite();
});
