// ==========================================
// 🎈 CLIENT SETTINGS (For surprise.html)
// ==========================================

const defaultSettings = {
    music: './music/song1.mp3',
    countdown: 3,
    matrixText: 'HAPPYBIRTHDAY',
    matrixColor1: '#ff69b4',
    matrixColor2: '#ff1493',
    sequence: 'HAPPY|BIRTHDAY|TO|YOU|NAME|❤',
    sequenceColor: '#ff69b4',
    effectSequence: ['memory', 'matrix', 'book', 'hearts'], 
    
    memoryCard: {
        title: 'Hello Dear ❤️',
        message: 'Today is a very special day! I made this just for you.',
        image: './gif/anime1.gif',
        btnText: 'Open Memories ✨'
    },
    
    innerMemory: {
        title: 'Beautiful Memories',
        message: 'These are the moments that make my life so special.',
        btnText: 'Read My Letter 💌',
        photos: ['', '', '', '', '', '']
    },

    loveNote: {
        letter: 'My Dearest,\n\nOn this beautiful day, I just want to tell you how amazing you are...',
        title: 'A Love Note',
        subText: 'A few words from the bottom of my heart.',
        btnText: "Let's Play a Game!"
    },

    colorTheme: 'pink',
    pages: [
        { image: './image/Birthday!/cover.jpg', content: '', isCover: true }, 
        { image: '', content: 'Wishing you all the happiness in the world! 💕' },
        { image: './image/Birthday!/cover.jpg', content: '', isCover: true }
    ]
};

async function loadSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    const dbId = urlParams.get('id');

    if (dbId) {
        try {
            console.log("Fetching data from Database... ⏳");
            const response = await fetch(`https://api.jsonbin.io/v3/b/${dbId}`);
            const data = await response.json();
            
            if (data.record) {
                window.settings = data.record;
                console.log("✅ Database Loaded Successfully!");
                applyLoadedSettings();
                return;
            } else {
                throw new Error("Invalid data format");
            }
        } catch (e) {
            console.error("❌ Database Fetch Error!", e);
            fallbackToLocalOrDefaults();
        }
    } else {
        fallbackToLocalOrDefaults();
    }
}

function fallbackToLocalOrDefaults() {
    // 🎯 ফিক্স: লোকাল স্টোরেজ কী এর নাম স্ট্যান্ডার্ড করা হলো
    const savedSettings = localStorage.getItem("userSurpriseSettings");
    if (savedSettings) {
        window.settings = JSON.parse(savedSettings);
        console.log("✅ Local Storage Loaded (Preview Mode)");
    } else {
        window.settings = defaultSettings;
        console.log("⚠️ No DB or Local Storage found. Loading defaults.");
    }
    applyLoadedSettings();
}

function applyLoadedSettings() {
    const settings = window.settings;
    
    const birthdayAudio = document.getElementById('birthdayAudio');
    if (birthdayAudio) birthdayAudio.src = settings.music;

    if (typeof matrixChars !== 'undefined') matrixChars = settings.matrixText.split('');

    createPages();
    createInnerMemoryScreen();
}

function createInnerMemoryScreen() {
    const currentSettings = window.settings || {};
    
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
        const page = document.createElement('div');
        page.classList.add('page');
        page.dataset.page = physicalPageIndex;

        const frontLogicalIndex = physicalPageIndex * 2;
        const backLogicalIndex = frontLogicalIndex + 1;

        const front = document.createElement('div');
        front.classList.add('page-front');
        if (frontLogicalIndex < pages.length && pages[frontLogicalIndex]) {
            const frontPageData = pages[frontLogicalIndex];
            if (frontPageData.image && frontPageData.image.trim() !== "") {
                const frontImg = document.createElement('img');
                frontImg.src = frontPageData.image;
                front.appendChild(frontImg);
            }
            if (frontPageData.content && frontPageData.content.trim() !== "") {
                const textDiv = document.createElement('div');
                textDiv.classList.add('page-text');
                textDiv.textContent = frontPageData.content;
                front.appendChild(textDiv);
            }
            if(!frontPageData.image && !frontPageData.content) front.classList.add('empty-page');
        }

        const back = document.createElement('div');
        back.classList.add('page-back');
        if (backLogicalIndex < pages.length && pages[backLogicalIndex]) {
            const backPageData = pages[backLogicalIndex];
            if (backPageData.image && backPageData.image.trim() !== "") {
                const backImg = document.createElement('img');
                backImg.src = backPageData.image;
                back.appendChild(backImg);
            }
            if (backPageData.content && backPageData.content.trim() !== "") {
                const textDiv = document.createElement('div');
                textDiv.classList.add('page-text');
                textDiv.textContent = backPageData.content;
                back.appendChild(textDiv);
            }
            if(!backPageData.image && !backPageData.content) back.classList.add('empty-page');
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        page.addEventListener('click', (e) => {
            if (typeof isFlipping !== 'undefined' && !isFlipping) {
                const rect = page.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width / 2 && page.classList.contains('flipped')) {
                    if (typeof prevPage === 'function') prevPage();
                } else if (clickX >= rect.width / 2 && !page.classList.contains('flipped')) {
                    if (typeof nextPage === 'function') nextPage();
                }
            }
        });
    }

    if (typeof photoUrls !== 'undefined') {
        photoUrls = pages.filter(page => !page.isCover && page.image && page.image.trim() !== "").map(page => page.image);
    }
    
    if (typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
}

document.addEventListener('DOMContentLoaded', async function () {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    if (book) book.style.display = 'none';
    if (bookContainer) bookContainer.style.display = 'none';

    await loadSettings();

    window.isWebsiteReady = true;

    if (typeof tryStartWebsiteWhenLandscape === 'function') {
        tryStartWebsiteWhenLandscape();
    } else if (typeof startWebsite === 'function') {
        startWebsite();
    }
});
