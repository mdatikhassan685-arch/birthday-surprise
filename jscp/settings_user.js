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
    { value: './music/happy-birthday.mp3', label: 'Happy Birthday (Miễn phí)' }
];
const sequenceOptions = [
    { value: 'none', label: 'None (Disable)' },
    { value: 'matrix', label: '🌧️ Matrix Rain' },
    { value: 'memory', label: '💌 Memory Card' },
    { value: 'book', label: '📖 3D Book' },
    { value: 'hearts', label: '💖 Floating Hearts' }
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
        stopMusicPreview(); return;
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

// Theme Handling
const colorThemes = {
    pink: { matrixColor1: '#ff69b4', matrixColor2: '#ff1493', sequenceColor: '#ff69b4' },
    blue: { matrixColor1: '#87ceeb', matrixColor2: '#4169e1', sequenceColor: '#1e90ff' },
    purple: { matrixColor1: '#dda0dd', matrixColor2: '#9370db', sequenceColor: '#8a2be2' },
    custom: { matrixColor1: '#ffb6c1', matrixColor2: '#ffc0cb', sequenceColor: '#d39b9b' }
};

function handleColorThemeChange(selectedTheme) {
    const matrixColor1Input = document.getElementById('matrixColor1');
    const matrixColor2Input = document.getElementById('matrixColor2');
    const sequenceColorInput = document.getElementById('sequenceColor');
    const customColorSection = document.getElementById('customColorSection');
    const sequenceColorSection = document.getElementById('sequenceColorSection');
    
    settings.colorTheme = selectedTheme;
    document.querySelectorAll('.color-theme-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeButton = document.querySelector(`[data-theme="${selectedTheme}"]`);
    if (activeButton) activeButton.classList.add('active');
    
    if (selectedTheme === 'custom') {
        if (customColorSection) customColorSection.style.display = 'flex';
        if (sequenceColorSection) sequenceColorSection.style.display = 'block';
    } else {
        if (customColorSection) customColorSection.style.display = 'none';
        if (sequenceColorSection) sequenceColorSection.style.display = 'none';
        
        const theme = colorThemes[selectedTheme];
        if (theme && matrixColor1Input && matrixColor2Input && sequenceColorInput) {
            matrixColor1Input.value = theme.matrixColor1;
            matrixColor2Input.value = theme.matrixColor2;
            sequenceColorInput.value = theme.sequenceColor;
        }
    }
}

document.querySelectorAll('.color-theme-btn').forEach(button => {
    button.addEventListener('click', function() {
        handleColorThemeChange(this.getAttribute('data-theme'));
    });
});

function loadSettingsForAdmin() {
    const savedSettings = localStorage.getItem(userStorageKey);
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        if(settings.pages.length > 0 && settings.pages[0].isCover) settings.pages.shift(); 
        if(settings.pages.length > 0 && settings.pages[settings.pages.length - 1].isCover) settings.pages.pop(); 
    } else {
        settings = {
            music: './music/zahra.mp3', countdown: 3, matrixText: 'HAPPYBIRTHDAY',
            sequence: 'HAPPY|BIRTHDAY|TO|YOU|❤',
            effectSequence: ['memory', 'matrix', 'book', 'hearts'], 
            memoryCard: { title: 'Hyy Baby ❤️', message: 'Today is your special day!', image: '', defaultGif: './gif/anime1.gif', btnText: 'Open Memories ✨' },
            pages: [ { image: '', content: 'Message 1...' }, { image: '', content: 'Message 2...' } ],
            colorTheme: 'pink'
        };
    }
}

function populateAdminForm() {
    loadSettingsForAdmin();

    document.getElementById('backgroundMusic').innerHTML = musicOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    document.getElementById('backgroundMusic').value = settings.music || musicOptions[0].value;
    
    document.getElementById('matrixText').value = settings.matrixText || 'HAPPYBIRTHDAY';
    document.getElementById('sequenceText').value = settings.sequence || 'HAPPY|BIRTHDAY';
    document.getElementById('countdownTime').value = settings.countdown || 3;

    handleColorThemeChange(settings.colorTheme || 'pink');

    const seqHtml = sequenceOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    ['seq1', 'seq2', 'seq3', 'seq4'].forEach((id, i) => {
        document.getElementById(id).innerHTML = seqHtml;
        document.getElementById(id).value = settings.effectSequence[i] || 'none';
    });

    // 🎯 Populate Memory Card Settings
    document.getElementById('mcTitle').value = settings.memoryCard?.title || '';
    document.getElementById('mcMessage').value = settings.memoryCard?.message || '';
    document.getElementById('mcBtnText').value = settings.memoryCard?.btnText || '';
    document.getElementById('mcGifSelect').value = settings.memoryCard?.defaultGif || './gif/anime1.gif';

    if(settings.memoryCard?.image && !settings.memoryCard.image.includes('.gif')) {
        document.getElementById('mcPreviewBox').innerHTML = `<img src="${settings.memoryCard.image}" style="max-width:100%;max-height:100%;object-fit:cover;">`;
    }

    renderPagesForm();
}

async function uploadToImgBB(file, targetKey, index = null) {
    const statusText = index !== null ? document.getElementById(`uploadStatus${index}`) : document.getElementById('mcUploadStatus');
    const previewBox = index !== null ? document.getElementById(`previewBox${index}`) : document.getElementById('mcPreviewBox');
    
    statusText.style.display = 'block'; statusText.textContent = 'Uploading... ⏳';
    const formData = new FormData(); formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
        const data = await response.json();
        if (data.success) {
            if(targetKey === 'memory') settings.memoryCard.image = data.data.url;
            else settings.pages[index].image = data.data.url;
            
            statusText.textContent = 'Success! ✅';
            setTimeout(() => statusText.style.display = 'none', 2000);
            previewBox.innerHTML = `<img src="${data.data.url}" style="max-width:100%;max-height:100%;object-fit:cover;">`;
        }
    } catch (error) { statusText.textContent = 'Error! ❌'; }
}

document.getElementById('mcImageFile').addEventListener('change', e => {
    if(e.target.files[0]) uploadToImgBB(e.target.files[0], 'memory');
});

function renderPagesForm() {
    const pageConfigs = document.getElementById('pageConfigs');
    if (!pageConfigs) return;
    pageConfigs.innerHTML = '';

    if(!settings.pages) settings.pages = [];

    settings.pages.forEach((page, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.style.cssText = "border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:8px; background:#fff;";
        pageDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #ff1493;">Page ${index + 1}</h4>
                ${settings.pages.length > 1 ? `<button type="button" onclick="removePage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>` : ''}
            </div>
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Upload Photo for Book Page:</label>
            <input type="file" id="pageFile${index}" accept="image/*" style="width: 100%; padding: 8px; margin-bottom: 5px;">
            <div class="image-preview-box" id="previewBox${index}" style="width: 100%; height: 150px; border: 2px dashed #ddd; border-radius: 8px; display: flex; justify-content: center; align-items: center; overflow: hidden; background: #f9f9f9; position: relative;">
                <div class="upload-status" id="uploadStatus${index}" style="position: absolute; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; display: none;"></div>
                ${page.image ? `<img src="${page.image}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` : '<span style="color:#aaa; font-size: 12px;">No Image</span>'}
            </div>
            <label style="display: block; margin-top: 15px; margin-bottom: 5px; font-weight: bold;">Text Content (Optional):</label>
            <textarea id="pageContent${index}" style="width: 100%; padding: 8px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;" placeholder="Write a message...">${page.content || ''}</textarea>
        `;
        pageConfigs.appendChild(pageDiv);
        
        document.getElementById(`pageFile${index}`).addEventListener('change', e => {
            if (e.target.files[0]) uploadToImgBB(e.target.files[0], 'page', index);
        });
    });

    if (settings.pages.length < 18) { 
        const addBtn = document.createElement('button');
        addBtn.type = "button"; 
        addBtn.textContent = '+ Add New Page'; 
        addBtn.onclick = addNewPage;
        addBtn.style.cssText = 'background: #4caf50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;';
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
        settings.matrixText = document.getElementById('matrixText').value;
        settings.sequence = document.getElementById('sequenceText').value;
        settings.countdown = parseInt(document.getElementById('countdownTime').value) || 3;
        
        settings.colorTheme = document.querySelector('.color-theme-btn.active')?.getAttribute('data-theme') || 'pink';
        settings.matrixColor1 = document.getElementById('matrixColor1').value;
        settings.matrixColor2 = document.getElementById('matrixColor2').value;
        settings.sequenceColor = document.getElementById('sequenceColor').value;
        
        settings.effectSequence = [
            document.getElementById('seq1').value,
            document.getElementById('seq2').value,
            document.getElementById('seq3').value,
            document.getElementById('seq4').value
        ];

        if(!settings.memoryCard) settings.memoryCard = {};
        settings.memoryCard.title = document.getElementById('mcTitle').value;
        settings.memoryCard.message = document.getElementById('mcMessage').value;
        settings.memoryCard.btnText = document.getElementById('mcBtnText').value;
        settings.memoryCard.defaultGif = document.getElementById('mcGifSelect').value;

        // 🎯 লজিক: ইউজার ছবি আপলোড না করলে জিফ দেখাবে
        if (!settings.memoryCard.image || settings.memoryCard.image === '') {
            settings.memoryCard.finalImageToShow = settings.memoryCard.defaultGif;
        } else {
            settings.memoryCard.finalImageToShow = settings.memoryCard.image;
        }

        saveFormDataLocally(); 

        let finalSettings = JSON.parse(JSON.stringify(settings)); 
        finalSettings.pages = finalSettings.pages.filter(p => (p.image && p.image.trim() !== '') || (p.content && p.content.trim() !== ''));
        
        finalSettings.pages.unshift({ image: './image/Birthday!/cover.jpg', content: '', isCover: true });
        finalSettings.pages.push({ image: './image/Birthday!/cover.jpg', content: '', isCover: true });

        localStorage.setItem(userStorageKey, JSON.stringify(finalSettings));
        localStorage.setItem("birthdaySettings", JSON.stringify(finalSettings));

        const magicLinkInput = document.getElementById('magicLinkInput');
        document.getElementById('magicLinkSection').style.display = 'block';
        magicLinkInput.value = "Saving to Database... ⏳";

        try {
            const response = await fetch("https://api.jsonbin.io/v3/b", {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_API_KEY, "X-Bin-Private": "false" },
                body: JSON.stringify(finalSettings)
            });
            const data = await response.json();
            if(data.metadata && data.metadata.id) {
                const currentUrl = window.location.href.split('user.html')[0];
                const longLink = `${currentUrl}surprise.html?id=${data.metadata.id}`;
                window.handleShortUrl = function(d) { magicLinkInput.value = d.shorturl || longLink; };
                const script = document.createElement('script');
                script.src = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longLink)}&callback=handleShortUrl`;
                document.body.appendChild(script);
            }
        } catch (error) { magicLinkInput.value = "Error! ❌"; }
    });
}

document.addEventListener('DOMContentLoaded', populateAdminForm);
