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
    memoryCard: {
        title: 'Hyy Baby ❤️',
        message: 'Today is your special day! Let me celebrate the incredible person you are. This is my gift to you - a little journey through our most cherished moments.',
        image: './image/Birthday!/cover.jpg',
        btnText: 'Open Memories ✨'
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
}

// 🎯 বইয়ের পেজ তৈরি করার ফাংশন (১০০% ফিক্সড)
function createPages() {
    const book = document.getElementById('book');
    if(!book) return;
    
    book.innerHTML = '';
    const pages = window.settings.pages || [];
    
    if (pages.length === 0) return;

    // 🎯 ফিক্স: জোড় পেজ বানানোর জন্য যদি পাতা বিজোড় হয়, তবে শেষে একটি ফাঁকা পাতা যোগ করা হবে (যাতে কভার ঠিক থাকে)
    if (pages.length % 2 !== 0) {
        // ব্যাক কভারের ঠিক আগে একটি ফাঁকা পাতা যোগ করা হচ্ছে
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

        // =======================
        // 📖 FRONT PAGE LOGIC
        // =======================
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
            
            // ছবি বা টেক্সট কিছুই না থাকলে ফাঁকা দেখাবে (কোনো Empty বা The End লেখা থাকবে না)
            if(!frontPageData.image && !frontPageData.content) {
                front.classList.add('empty-page');
            }
        }

        // =======================
        // 📖 BACK PAGE LOGIC
        // =======================
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

        // 🎯 ফিপিং লজিক (ক্লিক করলে পাতা উল্টাবে)
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

    // 🎯 ফিক্স: হার্ট ইফেক্টের জন্য কভার ইমেজগুলো ফিল্টার করে বাদ দেওয়া হয়েছে
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
