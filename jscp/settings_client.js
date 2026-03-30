// ==========================================
// 🎈 CLIENT SETTINGS (For surprise.html)
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
    enableBook: true,
    enableHeart: true,
    colorTheme: 'pink',
    effectSequence: ['memory', 'matrix', 'book', 'hearts'],
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
        console.log("✅ Local Storage Loaded (Admin Preview Mode)");
    } else {
        window.settings = defaultSettings;
        console.log("⚠️ No DB or Local Storage. Loading defaults.");
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
        page.classList.add('page');
        page.dataset.page = physicalPageIndex;

        const frontLogicalIndex = physicalPageIndex * 2;
        const backLogicalIndex = frontLogicalIndex + 1;

        // ================= Front Page =================
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
            
            // ছবি বা টেক্সট না থাকলে ব্যাকগ্রাউন্ড সাদা থাকবে, কোনো লেখা দেখাবে না
            if (!frontPageData.image && !frontPageData.content) {
                front.style.background = "#fff"; 
            }
        } else {
            front.style.background = "#fff";
        }

        // ================= Back Page =================
        const back = document.createElement('div');
        back.classList.add('page-back');

        if (backLogicalIndex < pages.length && pages[backLogicalIndex]) {
            const backPageData = pages[backLogicalIndex];

            // 🎯 লজিক ফিক্স: যদি এটি একেবারে শেষ পেজ হয় এবং কভার হয়, তবে কভার ইমেজ দেখাবে
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

            if (!backPageData.image && !backPageData.content) {
                back.style.background = "#fff";
            }
        } else {
            // 🎯 লজিক ফিক্স: কোনো এক্সট্রা পেজ থাকলে শুধু সাদা ব্যাকগ্রাউন্ড দেখাবে, "The End" দেখাবে না
            back.style.background = "#fff";
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        // Flipping Logic
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
        photoUrls = pages.filter(page => page.image && page.image.trim() !== "").map(page => page.image);
    }
    if (typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
}

document.addEventListener('DOMContentLoaded', async function () {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    if (book) { book.style.display = 'none'; book.classList.remove('show'); }
    if (bookContainer) { bookContainer.style.display = 'none'; bookContainer.classList.remove('show'); }

    await loadSettings();
    window.isWebsiteReady = true;

    if (typeof tryStartWebsiteWhenLandscape === 'function') {
        tryStartWebsiteWhenLandscape();
    } else if (typeof startWebsite === 'function') {
        startWebsite();
    }
});
