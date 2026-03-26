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
    pages: [
        { image: './image/Birthday!/cover.jpg', content: '' }, 
        { image: './image/Birthday!/photo1.jpg', content: 'Dear Zahra, you bring so much joy and happiness! 💕' },
        { image: './image/Birthday!/photo2.jpg', content: 'Your smile lights up every room you enter! ✨' },
        { image: './image/Birthday!/photo3.jpg', content: 'You are such an amazing and beautiful person! 🌸' },
        { image: './image/Birthday!/photo4.jpg', content: 'Your kindness and warmth touch hearts! 💖' },
        { image: './image/Birthday!/photo5.jpg', content: 'Wishing you the most wonderful birthday ever! 🎉' },
        { image: './image/Birthday!/photo6.jpg', content: 'May all your dreams come true! ⭐' },
        { image: './image/Birthday!/photo7.jpg', content: 'You deserve all the happiness! 🌈' },
        { image: './image/Birthday!/photo8.jpg', content: 'Love you so much! Have the best day! ❤️🎂' },
        { image: './image/Birthday!/9.jpg', content: '' }
    ]
};

// লোকাল স্টোরেজ থেকে সেটিংস লোড করা
function loadSettings() {
    const savedSettings = localStorage.getItem("birthdaySettings");
    if (savedSettings) {
        window.settings = JSON.parse(savedSettings);
    } else {
        window.settings = defaultSettings;
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
    const pages = window.settings.pages;
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

            if (frontPageData.image) {
                const frontImg = document.createElement('img');
                frontImg.src = frontPageData.image;
                front.appendChild(frontImg);
                
                if (frontPageData.content) {
                    const textDiv = document.createElement('div');
                    textDiv.classList.add('page-text');
                    textDiv.textContent = frontPageData.content;
                    front.appendChild(textDiv);
                }
            } else if (frontPageData.content) {
                front.classList.add('text-page');
                const textDiv = document.createElement('div');
                textDiv.classList.add('page-text');
                textDiv.textContent = frontPageData.content;
                front.appendChild(textDiv);
            } else {
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

            if (backPageData.image) {
                const backImg = document.createElement('img');
                backImg.src = backPageData.image;
                back.appendChild(backImg);
                
                if (backPageData.content) {
                    const textDiv = document.createElement('div');
                    textDiv.classList.add('page-text');
                    textDiv.textContent = backPageData.content;
                    back.appendChild(textDiv);
                }
            } else if (backPageData.content) {
                back.classList.add('text-page');
                const textDiv = document.createElement('div');
                textDiv.classList.add('page-text');
                textDiv.textContent = backPageData.content;
                back.appendChild(textDiv);
            } else {
                back.classList.add('empty-page');
                back.textContent = 'Empty';
            }
        } else {
            const endImg = document.createElement('img');
            endImg.src = './image/theend.jpg';
            back.appendChild(endImg);
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

    if (typeof photoUrls !== 'undefined') {
        photoUrls = pages.filter(page => page.image).map(page => page.image);
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

    loadSettings();
    applyLoadedSettings();

    window.isWebsiteReady = true;

    if (typeof tryStartWebsiteWhenLandscape === 'function') {
        tryStartWebsiteWhenLandscape();
    } else if (typeof startWebsite === 'function') {
        startWebsite();
    }
});
