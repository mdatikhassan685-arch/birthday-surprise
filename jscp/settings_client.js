const defaultSettings = {
    music: './music/zahra.mp3',
    countdown: 3,
    matrixText: 'HAPPYBIRTHDAY',
    matrixColor1: '#ff69b4',
    matrixColor2: '#ff1493',
    sequence: 'HAPPY|BIRTHDAY|NAME|❤',
    sequenceColor: '#ff69b4',
    gift: '',
    enableBook: true,
    enableHeart: true,
    colorTheme: 'pink',
    pages: [
        { image: './image/Birthday!/cover.jpg', content: '', isCover: true }, 
        { image: './image/Birthday!/photo1.jpg', content: 'Dear Zahra, you bring so much joy and happiness! 💕' }, 
    ]
};

// 🪄 ম্যাজিক লিংক বা লোকাল স্টোরেজ থেকে সেটিংস লোড করা
function loadSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    const magicData = urlParams.get('data'); 

    if (magicData) {
        try {
            const decodedString = decodeURIComponent(escape(atob(magicData)));
            window.settings = JSON.parse(decodedString);
            console.log("✅ Magic Link Loaded Successfully!");
        } catch (e) {
            console.error("❌ Invalid Magic Link! Loading default settings...", e);
            fallbackToLocalOrDefaults();
        }
    } else {
        fallbackToLocalOrDefaults();
    }
}

// ম্যাজিক লিংক না থাকলে লোকাল স্টোরেজ বা ডিফল্ট সেটিংস লোড করা
function fallbackToLocalOrDefaults() {
    const savedSettings = localStorage.getItem("birthdaySettings");
    if (savedSettings) {
        window.settings = JSON.parse(savedSettings);
        console.log("✅ Local Storage Loaded (Admin Preview Mode)");
    } else {
        window.settings = defaultSettings;
        console.log("⚠️ No Magic Link or Local Storage found. Loading defaults.");
    }
}

// সেটিংস অ্যাপ্লাই করা
function applyLoadedSettings() {
    const settings = window.settings;
    
    const birthdayAudio = document.getElementById('birthdayAudio');
    if (birthdayAudio) {
        birthdayAudio.src = settings.music;
    }

    const giftImageElement = document.getElementById('gift-image');
    if (giftImageElement && settings.gift) {
        giftImageElement.src = settings.gift;
    }

    if (typeof matrixChars !== 'undefined') {
        matrixChars = settings.matrixText.split('');
    }

    createPages();
}

// বইয়ের পেজ তৈরি করার ফাংশন
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
                front.textContent = 'Empty';
            }
        } else {
            front.classList.add('empty-page');
            front.textContent = 'Empty';
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
                back.textContent = 'Empty';
            }
        } else {
            // বইয়ের শেষ পাতা (ডিফল্ট)
            const img = document.createElement('img');
            img.src = './image/theend.jpg';
            img.onerror = () => {
                back.classList.add('empty-page');
                back.textContent = 'The End';
            };
            back.appendChild(img);
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        // ফিপিং লজিক
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

    // 🛠️ ফিক্স: এখানে কভার ইমেজগুলোকে ফিল্টার করে বাদ দেওয়া হয়েছে!
    if (typeof photoUrls !== 'undefined') {
        photoUrls = pages
            .filter(page => page.image && page.image.trim() !== "" && !page.isCover) // isCover: true থাকলে বাদ
            .map(page => page.image);
            
        // যদি কভার ছাড়া অন্য কোনো ছবি না থাকে, তবে ডিফল্ট হিসেবে কিছু একটা দেখাতে হবে, যাতে ক্র্যাশ না করে
        if(photoUrls.length === 0) {
            photoUrls = ['./image/logo.png']; 
        }
    }
    
    if (typeof calculatePageZIndexes === 'function') calculatePageZIndexes();
}

// পেজ লোড হলে এনিমেশন শুরু করা
document.addEventListener('DOMContentLoaded', function () {
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

    // সেটিংস লোড এবং অ্যাপ্লাই
    loadSettings();
    applyLoadedSettings();

    window.isWebsiteReady = true;

    // এনিমেশন শুরু
    if (typeof tryStartWebsiteWhenLandscape === 'function') {
        tryStartWebsiteWhenLandscape();
    } else if (typeof startWebsite === 'function') {
        startWebsite();
    }
});
