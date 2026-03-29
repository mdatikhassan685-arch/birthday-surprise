// ==========================================
// ⚙️ USER SETTINGS (For user.html)
// ==========================================

const IMGBB_API_KEY = "250ca5e91b77576f5bb44dcd1dd9ad46";
const JSONBIN_API_KEY = "$2a$10$WXbOxmvcjLQuVo5jnoQCAeAeSkcuDJlabKulj.TwfCN0CBKfpvFrq";

const applySettingsButton = document.getElementById('applySettings');
let settings = {};

const currentUserName = localStorage.getItem("currentUserName") || "guest";
const userStorageKey = `birthdaySettings_${currentUserName}`;

document.addEventListener('DOMContentLoaded', () => {
    const headerTitle = document.querySelector('.user-header h1');
    if (headerTitle && currentUserName !== "guest") headerTitle.innerHTML = `⚙️ Hello, ${currentUserName}!`;
});

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
const musicPreviewAudio = new Audio();

function handleMusicPreview() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect || !musicSelect.value) return;
    if (!musicPreviewAudio.paused) {
        musicPreviewAudio.pause();
        musicPreviewButton.textContent = '▶ Play';
        return;
    }
    musicPreviewAudio.src = musicSelect.value;
    musicPreviewAudio.play().then(() => { musicPreviewButton.textContent = '⏸ Stop'; });
}
if (musicPreviewButton) musicPreviewButton.addEventListener('click', handleMusicPreview);

async function uploadImageToImgBB(file, previewImgId, noImgId, statusId, urlInputId, arrayIndex = null) {
    const statusText = document.getElementById(statusId);
    statusText.style.display = 'block'; statusText.textContent = 'Uploading... ⏳';
    const formData = new FormData(); formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
        const data = await response.json();
        
        if (data.success) {
            statusText.textContent = 'Success! ✅';
            setTimeout(() => statusText.style.display = 'none', 2000);
            document.getElementById(previewImgId).src = data.data.url;
            document.getElementById(previewImgId).style.display = 'block';
            if(document.getElementById(noImgId)) document.getElementById(noImgId).style.display = 'none';

            if(arrayIndex !== null) settings.pages[arrayIndex].image = data.data.url; 
            else document.getElementById(urlInputId).value = data.data.url;
        } else statusText.textContent = 'Failed! ❌';
    } catch (error) { statusText.textContent = 'Error! ❌'; }
}

document.getElementById('memoryImageFile').addEventListener('change', function(e) {
    if (e.target.files[0]) uploadImageToImgBB(e.target.files[0], 'memoryImageDisplay', 'memoryNoImage', 'memoryUploadStatus', 'memoryImageUrl', null);
});

function loadSettingsForAdmin() {
    const savedSettings = localStorage.getItem(userStorageKey);
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        if(settings.pages.length > 0 && settings.pages[0].isCover) settings.pages.shift(); 
        if(settings.pages.length > 0 && settings.pages[settings.pages.length - 1].isCover) settings.pages.pop(); 
    } else {
        settings = {
            music: './music/zahra.mp3', countdown: 3, matrixText: 'HAPPYBIRTHDAY', matrixColor1: '#ff69b4', matrixColor2: '#ff1493', sequence: 'HAPPY|BIRTHDAY|TO|YOU|❤', sequenceColor: '#ff69b4', gift: '', colorTheme: 'pink',
            sequenceOrder: ['memory', 'book', 'hearts'], // 🎯 New Timeline Default
            memoryHeading: 'Hyy Baby ❤️', memoryText: 'Today is your special day!', memoryBtnText: 'Open Memories ✨', memoryImage: '',
            pages: [ { image: '', content: 'Message 1' }, { image: '', content: 'Message 2' } ]
        };
    }
}

function populateAdminForm() {
    loadSettingsForAdmin();

    document.getElementById('backgroundMusic').innerHTML = musicOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    document.getElementById('backgroundMusic').value = settings.music;
    document.getElementById('countdownTime').value = settings.countdown;
    document.getElementById('giftImage').innerHTML = gifOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    document.getElementById('giftImage').value = settings.gift;
    document.getElementById('matrixText').value = settings.matrixText;
    document.getElementById('matrixColor1').value = settings.matrixColor1;
    document.getElementById('matrixColor2').value = settings.matrixColor2;
    document.getElementById('sequenceText').value = settings.sequence;
    document.getElementById('sequenceColor').value = settings.sequenceColor;

    // 🎯 Timeline population
    if(settings.sequenceOrder && settings.sequenceOrder.length === 3) {
        document.getElementById('phase1').value = settings.sequenceOrder[0];
        document.getElementById('phase2').value = settings.sequenceOrder[1];
        document.getElementById('phase3').value = settings.sequenceOrder[2];
    }

    document.getElementById('memoryHeading').value = settings.memoryHeading || 'Hyy Baby ❤️';
    document.getElementById('memoryText').value = settings.memoryText || '';
    document.getElementById('memoryBtnText').value = settings.memoryBtnText || 'Open Memories ✨';
    
    if(settings.memoryImage) {
        document.getElementById('memoryImageUrl').value = settings.memoryImage;
        document.getElementById('memoryImageDisplay').src = settings.memoryImage;
        document.getElementById('memoryImageDisplay').style.display = 'block';
        document.getElementById('memoryNoImage').style.display = 'none';
    }

    renderPagesForm();
}

function renderPagesForm() {
    const pageConfigs = document.getElementById('pageConfigs');
    if (!pageConfigs) return;
    pageConfigs.innerHTML = '';

    settings.pages.forEach((page, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page-config';
        pageDiv.style.cssText = "border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #fff;";

        pageDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #ff1493;">Page ${index + 1}</h4>
                ${settings.pages.length > 1 ? `<button onclick="removePage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>` : ''}
            </div>
            <input type="file" id="pageFile${index}" accept="image/*" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px;">
            <div class="image-preview-box" style="width: 100%; height: 150px; border: 2px dashed #ddd; border-radius: 8px; display: flex; justify-content: center; align-items: center; overflow: hidden; background: #f9f9f9; position: relative;">
                <div class="upload-status" id="uploadStatus${index}" style="position: absolute; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; display: none;"></div>
                <img id="previewImg${index}" src="${page.image || ''}" style="max-width: 100%; max-height: 100%; object-fit: cover; display: ${page.image ? 'block' : 'none'};">
                <span id="noImg${index}" style="color:#aaa; font-size: 12px; display: ${page.image ? 'none' : 'block'};">No Image</span>
            </div>
            <textarea id="pageContent${index}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px; margin-top:10px;">${page.content || ''}</textarea>
        `;
        pageConfigs.appendChild(pageDiv);

        document.getElementById(`pageFile${index}`).addEventListener('change', function(e) {
            if (e.target.files[0]) uploadImageToImgBB(e.target.files[0], `previewImg${index}`, `noImg${index}`, `uploadStatus${index}`, null, index);
        });
    });

    if (settings.pages.length < 18) { 
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add New Page';
        addBtn.onclick = addNewPage;
        addBtn.style.cssText = 'background: #4caf50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;';
        pageConfigs.appendChild(addBtn);
    }
}

function addNewPage() { saveFormDataLocally(); settings.pages.push({ image: '', content: '' }); renderPagesForm(); }
function removePage(index) { saveFormDataLocally(); settings.pages.splice(index, 1); renderPagesForm(); }

function saveFormDataLocally() {
    settings.pages.forEach((page, index) => {
        const contentInput = document.getElementById(`pageContent${index}`);
        if (contentInput) settings.pages[index].content = contentInput.value;
    });
}

if (applySettingsButton) {
    applySettingsButton.addEventListener('click', async () => {
        settings.music = document.getElementById('backgroundMusic').value;
        settings.countdown = parseInt(document.getElementById('countdownTime').value) || 3;
        settings.gift = document.getElementById('giftImage').value;
        settings.matrixText = document.getElementById('matrixText').value;
        settings.matrixColor1 = document.getElementById('matrixColor1').value;
        settings.matrixColor2 = document.getElementById('matrixColor2').value;
        settings.sequence = document.getElementById('sequenceText').value;
        settings.sequenceColor = document.getElementById('sequenceColor').value;
        
        // 🎯 Save Sequence Order
        settings.sequenceOrder = [
            document.getElementById('phase1').value,
            document.getElementById('phase2').value,
            document.getElementById('phase3').value
        ];

        settings.memoryHeading = document.getElementById('memoryHeading').value;
        settings.memoryText = document.getElementById('memoryText').value;
        settings.memoryBtnText = document.getElementById('memoryBtnText').value;
        settings.memoryImage = document.getElementById('memoryImageUrl').value;
        
        saveFormDataLocally(); 

        let finalSettings = JSON.parse(JSON.stringify(settings)); 
        finalSettings.pages = finalSettings.pages.filter(p => (p.image && p.image.trim() !== '') || (p.content && p.content.trim() !== ''));

        finalSettings.pages.unshift({ image: './image/Birthday!/cover.jpg', content: '', isCover: true });
        finalSettings.pages.push({ image: './image/Birthday!/cover.jpg', content: '', isCover: true });

        localStorage.setItem(userStorageKey, JSON.stringify(finalSettings));
        localStorage.setItem("birthdaySettings", JSON.stringify(finalSettings));

        const magicLinkSection = document.getElementById('magicLinkSection');
        const magicLinkInput = document.getElementById('magicLinkInput');
        magicLinkInput.value = "Saving to Database... ⏳";
        magicLinkSection.style.display = 'block';
        magicLinkSection.scrollIntoView({ behavior: "smooth" });

        const jsonString = JSON.stringify(finalSettings);
        const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
        const safeUrlData = encodeURIComponent(base64Data);
        const currentUrl = window.location.href.split('user.html')[0];
        const longMagicLink = `${currentUrl}surprise.html?data=${safeUrlData}`;

        window.handleShortUrl = function(data) {
            if (data && data.shorturl) magicLinkInput.value = data.shorturl; 
            else magicLinkInput.value = longMagicLink; 
        };

        const script = document.createElement('script');
        script.src = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longMagicLink)}&callback=handleShortUrl`;
        document.body.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', populateAdminForm);
