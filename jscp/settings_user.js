// ==========================================
// ⚙️ ADMIN SETTINGS (For admin.html)
// ==========================================

const IMGBB_API_KEY = "250ca5e91b77576f5bb44dcd1dd9ad46";
const JSONBIN_API_KEY = "$2a$10$WXbOxmvcjLQuVo5jnoQCAeAeSkcuDJlabKulj.TwfCN0CBKfpvFrq";

const applySettingsButton = document.getElementById('applySettings');
let settings = {};

const musicOptions = [
    { value: './music/zahra.mp3', label: 'Zahra Birthday Music' },
    { value: './music/happy-birthday1.mp3', label: 'Happy Birthday 1' },
    { value: './music/happybirthday2.mp3', label: 'Happy Birthday 2' },
    { value: './music/happybirthday3.mp3', label: 'Happy Birthday 3' }
];

const gifOptions = [
    { value: '', label: 'None' },
    { value: './gif/happy.gif', label: 'Gif' },
    { value: './gif/happy1.gif', label: 'Gif1' },
    { value: './gif/happy2.gif', label: 'Gif2' },
];

const musicPreviewButton = document.getElementById('musicPreviewButton');
const musicPreviewStatus = document.getElementById('musicPreviewStatus');
const musicPreviewAudio = new Audio();
let currentPreviewTrack = '';

function getSelectedMusicLabel() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect) return '';
    return musicSelect.options[musicSelect.selectedIndex]?.textContent || '';
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

function loadSettingsForAdmin() {
    const savedSettings = localStorage.getItem("birthdaySettings");
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        if(settings.pages.length > 0 && settings.pages[0].isCover) settings.pages.shift(); 
        if(settings.pages.length > 0 && settings.pages[settings.pages.length - 1].isCover) settings.pages.pop(); 
    } else {
        settings = {
            music: './music/zahra.mp3',
            countdown: 3,
            matrixText: 'HAPPYBIRTHDAY',
            matrixColor1: '#ff69b4',
            matrixColor2: '#ff1493',
            sequence: 'HAPPY|BIRTHDAY|name|❤',
            sequenceColor: '#ff69b4',
            gift: '',
            enableBook: true,
            enableHeart: true,
            colorTheme: 'pink',
            pages: [
                { image: '', content: 'Dear name, you bring so much joy and happiness! 💕' },
                { image: '', content: 'Wishing you the most wonderful birthday ever! 🎉' }
            ]
        };
    }
}

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
            settings.pages[index].image = data.data.url; 
            statusText.textContent = 'Upload Success! ✅';
            setTimeout(() => statusText.style.display = 'none', 2000);
            previewBox.innerHTML = `<img src="${data.data.url}" alt="Preview">`;
        } else {
            statusText.textContent = 'Upload Failed! ❌';
            statusText.style.backgroundColor = 'rgba(255,0,0,0.7)';
        }
    } catch (error) {
        statusText.textContent = 'Error! ❌';
        statusText.style.backgroundColor = 'rgba(255,0,0,0.7)';
    }
}

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
                <h4 style="margin: 0; color: #ff1493;">Page ${index + 1}</h4>
                ${settings.pages.length > 1 ? `<button onclick="removePage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>` : ''}
            </div>
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Upload Photo (Auto-saves to ImgBB):</label>
            <input type="file" id="pageFile${index}" accept="image/*" style="width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px;">
            <div class="image-preview-box" id="previewBox${index}" style="width: 100%; height: 150px; border: 2px dashed #ddd; border-radius: 8px; display: flex; justify-content: center; align-items: center; overflow: hidden; background: #f9f9f9; position: relative;">
                <div class="upload-status" id="uploadStatus${index}" style="position: absolute; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; display: none;"></div>
                ${page.image ? `<img src="${page.image}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` : '<span style="color:#aaa; font-size: 12px;">No Image</span>'}
            </div>
            <label style="display: block; margin-top: 15px; margin-bottom: 5px; font-weight: bold;">Text Content (Optional):</label>
            <textarea id="pageContent${index}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;">${page.content || ''}</textarea>
        `;
        pageConfigs.appendChild(pageDiv);

        document.getElementById(`pageFile${index}`).addEventListener('change', function(e) {
            if (e.target.files[0]) uploadToImgBB(e.target.files[0], index);
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

// 🎯 Save to Database & Generate Short Link
if (applySettingsButton) {
    applySettingsButton.addEventListener('click', async () => {
        
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

        let finalSettings = JSON.parse(JSON.stringify(settings)); 
        finalSettings.pages = finalSettings.pages.filter(p => (p.image && p.image.trim() !== '') || (p.content && p.content.trim() !== ''));

        // কভার যোগ করা
        finalSettings.pages.unshift({ image: './image/Birthday!/cover.jpg', content: '', isCover: true });
        finalSettings.pages.push({ image: './image/Birthday!/cover.jpg', content: '', isCover: true });

        // লোকাল স্টোরেজে সেভ (অ্যাডমিনের জন্য)
        localStorage.setItem("birthdaySettings", JSON.stringify(finalSettings));

        const magicLinkSection = document.getElementById('magicLinkSection');
        const magicLinkInput = document.getElementById('magicLinkInput');
        
        magicLinkInput.value = "Saving to Database... ⏳";
        magicLinkSection.style.display = 'block';
        magicLinkSection.scrollIntoView({ behavior: "smooth" });

        // 🚀 JSONbin.io Database এ ডেটা সেভ করা
        try {
            const response = await fetch("https://api.jsonbin.io/v3/b", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": JSONBIN_API_KEY,
                    "X-Bin-Private": "false" // যাতে ক্লায়েন্ট লিংক থেকে ডিরেক্ট রিড করতে পারে
                },
                body: JSON.stringify(finalSettings)
            });
            
            const data = await response.json();
            
            if(data.metadata && data.metadata.id) {
                const binId = data.metadata.id; // ডাটাবেস থেকে পাওয়া ছোট আইডি
                const currentUrl = window.location.href.split('admin.html')[0];
                const finalLink = `${currentUrl}surprise.html?id=${binId}`;
                
                magicLinkInput.value = finalLink; // তৈরি হয়ে গেলো প্রফেশনাল শর্ট লিংক!
            } else {
                magicLinkInput.value = "Error saving to database! ❌";
            }
        } catch (error) {
            console.error("DB Error:", error);
            magicLinkInput.value = "Network Error! ❌";
        }
    });
}

document.addEventListener('DOMContentLoaded', populateAdminForm);
