// ==========================================
// 🎈 CLIENT SETTINGS (For surprise.html Magic Link)
// ==========================================

const defaultSettings = {
    music: './music/zahra.mp3',
    countdown: 3,
    matrixText: 'HAPPYBIRTHDAY',
    matrixColor1: '#ff69b4',
    matrixColor2: '#ff1493',
    sequence: 'HAPPY|BIRTHDAY|ZAHRA|❤',
    sequenceColor: '#ff69b4',
    gift: '',
    effectSequence: ['memory', 'matrix', 'book', 'hearts'], 
    
    // Front Memory Card
    memoryCard: {
        title: 'Hyy Baby ❤️',
        message: 'Today is your special day! Let me celebrate the incredible person you are.',
        image: './image/Birthday!/cover.jpg',
        btnText: 'Open Memories ✨'
    },
    
    // Inner Memory Card (6 Photos)
    innerMemory: {
        title: 'Birthday Memories',
        message: 'These are the moments that make you the most beautiful person to me.',
        btnText: 'Read My Heart 💌',
        photos: ['', '', '', '', '', '']
    },

    colorTheme: 'pink',
    pages: [
        { image: './image/Birthday!/cover.jpg', content: '', isCover: true }, 
        { image: './image/Birthday!/photo1.jpg', content: 'Dear Zahra, you bring so much joy and happiness! 💕' },
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
            alert("❌ ডেটাবেস থেকে ডেটা লোড করা যায়নি! ডিফল্ট সেটিংস লোড হচ্ছে।");
            fallbackToLocalOrDefaults();
        }
    } else {
        fallbackToLocalOrDefaults();
    }
}

function fallbackToLocalOrDefaults() {
    const savedSettings = localStorage.getItem("birthdaySettings");
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

    const giftImageElement = document.getElementById('gift-image');
    if (giftImageElement && settings.gift) giftImageElement.src = settings.gift;

    if (typeof matrixChars !== 'undefined') matrixChars = settings.matrixText.split('');

    createPages();
    createInnerMemoryScreen();
}

// 🎯 নতুন: ৬ ছবির কোলাজ স্ক্রিন তৈরি করার ফাংশন
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
                    
                    // 🎯 ফিক্স: মোবাইলের টাচ এনিমেশন যেন সুন্দরভাবে কাজ করে তার জন্য ontouchstart যোগ করা হলো
                    polaroid.setAttribute('ontouchstart', ''); 
                    
                    // জোড় ছবি ডানে বাঁকবে, বিজোড় বামে
                    const rotation = index % 2 === 0 ? '3deg' : '-3deg';
                    polaroid.style.transform = `rotate(${rotation})`;
                    
                    polaroid.innerHTML = `<img src="${url}" alt="Memory">`;
                    inPhotoGrid.appendChild(polaroid);
                }
            });
        }
    }
}

// বইয়ের পেজ তৈরি করার ফাংশন
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

        // Front Page
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
            
            if(!frontPageData.image && !frontPageData.content) {
                front.classList.add('empty-page');
            }
        }

        // Back Page
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
            
            if(!backPageData.image && !backPageData.content) {
                back.classList.add('empty-page');
            }
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        page.addEventListener('click', (e) => {
            if (typeof isFlipping !== 'undefined' && !isFlipping) {
                const rect = page.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pageWidth = rect.width;
                if (clickX < pageWidth / 2 && page.classList.contains('flipped')) {
                    if (typeof prevPage === 'function') prevPage();
                } else if (clickX >= pageWidth / 2 && !page.classList.contains('flipped')) {
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
    if (book) {
        book.style.display = 'none';
        book.classList.remove('show');
    }
    if (bookContainer) {
        bookContainer.style.display = 'none';
        bookContainer.classList.remove('show');
    }

    await loadSettings();

    window.isWebsiteReady = true;

    if (typeof tryStartWebsiteWhenLandscape === 'function') {
        tryStartWebsiteWhenLandscape();
    } else if (typeof startWebsite === 'function') {
        startWebsite();
    }
});
