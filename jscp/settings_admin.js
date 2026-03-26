// ==========================================
// ⚙️ ADMIN SETTINGS (For admin.html)
// ==========================================

const applySettingsButton = document.getElementById('applySettings');
let settings = {};

const musicOptions = [
    { value: './music/zahra.mp3', label: 'Zahra Birthday Music' },
    { value: './music/happy-birthday.mp3', label: 'Happy Birthday (Miễn phí)' },
    { value: './music/happybirthday.mp3', label: 'Happy Birthday (Phiên bản 2)' },
    { value: './music/perfect.mp3', label: 'Perfect' }
];

const gifOptions = [
    { value: '', label: 'None' },
    { value: './gif/happy.gif', label: 'Gif1' },
    { value: './gif/Cat Love GIF by KIKI.gif', label: 'Gif2' },
    { value: './gif/happy2.gif', label: 'Gif4' },
];

const musicPreviewButton = document.getElementById('musicPreviewButton');
const musicPreviewStatus = document.getElementById('musicPreviewStatus');
const musicPreviewAudio = new Audio();
let currentPreviewTrack = '';

function getSelectedMusicLabel() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect) return '';
    const selectedOption = musicSelect.options[musicSelect.selectedIndex];
    return selectedOption ? selectedOption.textContent : '';
}

function stopMusicPreview(customMessage) {
    musicPreviewAudio.pause();
    musicPreviewAudio.currentTime = 0;
    currentPreviewTrack = '';
    if (musicPreviewButton) musicPreviewButton.textContent = '▶ Play';
    if (musicPreviewStatus) musicPreviewStatus.textContent = customMessage || getSelectedMusicLabel();
}

function handleMusicPreview() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect || !musicSelect.value) return;

    const selectedSrc = musicSelect.value;

    if (currentPreviewTrack === selectedSrc && !musicPreviewAudio.paused) {
        stopMusicPreview();
        return;
    }

    currentPreviewTrack = selectedSrc;
    musicPreviewAudio.pause();
    musicPreviewAudio.src = selectedSrc;

    musicPreviewAudio.play().then(() => {
        if (musicPreviewButton) musicPreviewButton.textContent = '⏸ Stop';
        if (musicPreviewStatus) musicPreviewStatus.textContent = `Playing: ${getSelectedMusicLabel()}`;
    }).catch(error => {
        stopMusicPreview('Error playing preview.');
    });
}

if (musicPreviewButton) musicPreviewButton.addEventListener('click', handleMusicPreview);
musicPreviewAudio.addEventListener('ended', () => stopMusicPreview());

// লোকাল স্টোরেজ থেকে ডেটা লোড করা
function loadSettingsForAdmin() {
    const savedSettings = localStorage.getItem("birthdaySettings");
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    } else {
        // ডিফল্ট সেটিংস
        settings = {
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
                { image: './image/Birthday!/9.jpg', content: '' }
            ]
        };
    }
}

// ফর্ম পপুলেট করা
function populateAdminForm() {
    loadSettingsForAdmin();

    const musicSelect = document.getElementById('backgroundMusic');
    if (musicSelect) {
        musicSelect.innerHTML = musicOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
        musicSelect.value = settings.music;
        musicSelect.onchange = () => stopMusicPreview();
    }

    document.getElementById('countdownTime').value = settings.countdown;
    document.getElementById('enableBook').value = settings.enableBook.toString();
    document.getElementById('enableHeart').value = settings.enableHeart.toString();
    
    const giftSelect = document.getElementById('giftImage');
    if (giftSelect) {
        giftSelect.innerHTML = gifOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
        giftSelect.value = settings.gift;
    }

    document.getElementById('matrixText').value = settings.matrixText;
    document.getElementById('matrixColor1').value = settings.matrixColor1;
    document.getElementById('matrixColor2').value = settings.matrixColor2;
    document.getElementById('sequenceText').value = settings.sequence;
    document.getElementById('sequenceColor').value = settings.sequenceColor;

    renderPagesForm();
}

// পেজ ফর্ম রেন্ডার করা
function renderPagesForm() {
    const pageConfigs = document.getElementById('pageConfigs');
    if (!pageConfigs) return;
    pageConfigs.innerHTML = '';

    settings.pages.forEach((page, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page-config';
        pageDiv.style.border = "1px solid #ddd";
        pageDiv.style.padding = "15px";
        pageDiv.style.marginBottom = "15px";
        pageDiv.style.borderRadius = "8px";

        pageDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0;">Page ${index + 1} ${index === 0 ? '(Cover)' : ''}</h4>
                ${settings.pages.length > 1 ? `<button onclick="removePage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>` : ''}
            </div>
            
            <label style="display: block; margin-bottom: 5px;">Image URL (e.g., ./image/Birthday!/photo1.jpg):</label>
            <input type="text" id="pageImage${index}" value="${page.image}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
            
            <label style="display: block; margin-bottom: 5px;">Text Content (Optional):</label>
            <textarea id="pageContent${index}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;">${page.content || ''}</textarea>
        `;
        pageConfigs.appendChild(pageDiv);
    });

    if (settings.pages.length < 20) {
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add New Page';
        addBtn.onclick = addNewPage;
        addBtn.style.cssText = 'background: #4caf50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;';
        pageConfigs.appendChild(addBtn);
    }
}

function addNewPage() {
    saveFormData();
    settings.pages.push({ image: '', content: '' });
    renderPagesForm();
}

function removePage(index) {
    saveFormData();
    settings.pages.splice(index, 1);
    renderPagesForm();
}

// ফর্ম থেকে ডেটা পড়ে লোকাল স্টোরেজে সেভ করা
function saveFormData() {
    settings.music = document.getElementById('backgroundMusic').value;
    settings.countdown = parseInt(document.getElementById('countdownTime').value) || 3;
    settings.enableBook = document.getElementById('enableBook').value === 'true';
    settings.enableHeart = document.getElementById('enableHeart').value === 'true';
    settings.gift = document.getElementById('giftImage').value;
    settings.matrixText = document.getElementById('matrixText').value;
    settings.matrixColor1 = document.getElementById('matrixColor1').value;
    settings.matrixColor2 = document.getElementById('matrixColor2').value;
    settings.sequence = document.getElementById('sequenceText').value;
    settings.sequenceColor = document.getElementById('sequenceColor').value;

    settings.pages.forEach((page, index) => {
        const imageInput = document.getElementById(`pageImage${index}`);
        const contentInput = document.getElementById(`pageContent${index}`);
        if (imageInput) settings.pages[index].image = imageInput.value;
        if (contentInput) settings.pages[index].content = contentInput.value;
    });

    localStorage.setItem("birthdaySettings", JSON.stringify(settings));
}

// সেভ বাটন
if (applySettingsButton) {
    applySettingsButton.addEventListener('click', () => {
        saveFormData();
        alert("✅ Settings Saved Successfully! Open surprise.html to see the magic!");
    });
}

// পেজ লোড হলে ফর্ম রেন্ডার করা
document.addEventListener('DOMContentLoaded', populateAdminForm);
