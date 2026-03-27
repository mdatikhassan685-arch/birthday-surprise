// ==========================================
// ⚙️ ADMIN SETTINGS (For admin.html)
// ==========================================

// 🔑 আপনার ImgBB API Key
const IMGBB_API_KEY = "250ca5e91b77576f5bb44dcd1dd9ad46";

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

// ☁️ ImgBB Upload Function
async function uploadToImgBB(file, index) {
    const previewBox = document.getElementById(`previewBox${index}`);
    const statusText = document.getElementById(`uploadStatus${index}`);
    
    statusText.style.display = 'block';
    statusText.textContent = 'Uploading... ⏳';

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            const imageUrl = data.data.url; // ImgBB ডিরেক্ট লিংক
            settings.pages[index].image = imageUrl; // সেটিংসে সেভ করা
            
            statusText.textContent = 'Upload Success! ✅';
            setTimeout(() => statusText.style.display = 'none', 2000);
            
            previewBox.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
        } else {
            statusText.textContent = 'Upload Failed! ❌';
            statusText.style.backgroundColor = 'rgba(255,0,0,0.7)';
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        statusText.textContent = 'Error! ❌';
        statusText.style.backgroundColor = 'rgba(255,0,0,0.7)';
    }
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
        pageDiv.style.background = "#fff";

        pageDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0;">Page ${index + 1} ${index === 0 ? '(Cover)' : ''}</h4>
                ${settings.pages.length > 1 ? `<button onclick="removePage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>` : ''}
            </div>
            
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Upload Photo (Auto-saves to ImgBB):</label>
            <input type="file" id="pageFile${index}" accept="image/*" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px;">
            
            <div class="image-preview-box" id="previewBox${index}">
                <div class="upload-status" id="uploadStatus${index}"></div>
                ${page.image ? `<img src="${page.image}" alt="Preview">` : '<span style="color:#aaa; font-size: 12px;">No Image</span>'}
            </div>
            
            <label style="display: block; margin-top: 15px; margin-bottom: 5px; font-weight: bold;">Text Content (Optional):</label>
            <textarea id="pageContent${index}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;">${page.content || ''}</textarea>
        `;
        
        pageConfigs.appendChild(pageDiv);

        // ফাইল সিলেক্ট করলেই ImgBB তে আপলোড শুরু হবে
        document.getElementById(`pageFile${index}`).addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadToImgBB(file, index);
            }
        });
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
    saveFormDataLocally();
    settings.pages.push({ image: '', content: '' });
    renderPagesForm();
}

function removePage(index) {
    saveFormDataLocally();
    settings.pages.splice(index, 1);
    renderPagesForm();
}

function saveFormDataLocally() {
    settings.pages.forEach((page, index) => {
        const contentInput = document.getElementById(`pageContent${index}`);
        if (contentInput) settings.pages[index].content = contentInput.value;
    });
}

// 🪄 Magic Link জেনারেট করা
if (applySettingsButton) {
    applySettingsButton.addEventListener('click', () => {
        
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
        
        saveFormDataLocally(); 
        
        // লোকাল স্টোরেজে সেভ (অ্যাডমিন প্রিভিউর জন্য)
        localStorage.setItem("birthdaySettings", JSON.stringify(settings));

        // 🪄 Magic Link তৈরি (Base64 Encode করে URL এ জুড়ে দেওয়া)
        const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(settings))));
        
        // বর্তমান ওয়েবসাইটের ডোমেইন বের করে surprise.html এর লিংক তৈরি
        const currentUrl = window.location.href.split('admin.html')[0];
        const magicLink = `${currentUrl}surprise.html?data=${encodedData}`;

        // স্ক্রিনে ম্যাজিক লিংক দেখানো
        const magicLinkSection = document.getElementById('magicLinkSection');
        const magicLinkInput = document.getElementById('magicLinkInput');
        
        magicLinkInput.value = magicLink;
        magicLinkSection.style.display = 'block';

        // ম্যাজিক লিংক সেকশনে স্ক্রল করে যাওয়া
        magicLinkSection.scrollIntoView({ behavior: "smooth" });
    });
}

document.addEventListener('DOMContentLoaded', populateAdminForm);
