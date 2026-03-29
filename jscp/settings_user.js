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
    { value: './music/happy-birthday1.mp3', label: 'Happy Birthday 1' }
];
const gifOptions = [ { value: '', label: 'None' }, { value: './gif/happy.gif', label: 'Gif1' } ];
const sequenceOptions = [
    { value: 'none', label: 'None (Disable)' },
    { value: 'memory', label: '💌 Memory Card' },
    { value: 'book', label: '📖 3D Book' },
    { value: 'hearts', label: '💖 Floating Hearts' }
];

function loadSettingsForAdmin() {
    const savedSettings = localStorage.getItem(userStorageKey);
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        if(settings.pages.length > 0 && settings.pages[0].isCover) settings.pages.shift(); 
        if(settings.pages.length > 0 && settings.pages[settings.pages.length - 1].isCover) settings.pages.pop(); 
    } else {
        settings = {
            music: './music/zahra.mp3', countdown: 3, matrixText: 'HAPPYBIRTHDAY',
            sequence: 'HAPPY|BIRTHDAY|TO|YOU|❤', gift: '',
            effectSequence: ['memory', 'book', 'hearts'], // 🎯 ডিফল্ট সিকোয়েন্স
            memoryCard: {
                title: 'Hyy Baby ❤️', message: 'Today is your special day! Let me celebrate the incredible person you are.', image: '', btnText: 'Open Memories ✨'
            },
            pages: [ { image: '', content: 'Message 1...' }, { image: '', content: 'Message 2...' } ]
        };
    }
}

function populateAdminForm() {
    loadSettingsForAdmin();

    document.getElementById('backgroundMusic').innerHTML = musicOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    document.getElementById('backgroundMusic').value = settings.music;
    
    document.getElementById('giftImage').innerHTML = gifOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    document.getElementById('giftImage').value = settings.gift;

    document.getElementById('matrixText').value = settings.matrixText;
    document.getElementById('sequenceText').value = settings.sequence;

    // Populate Effect Sequence
    const seqHtml = sequenceOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    ['seq1', 'seq2', 'seq3'].forEach((id, i) => {
        document.getElementById(id).innerHTML = seqHtml;
        document.getElementById(id).value = settings.effectSequence[i] || 'none';
    });

    // Populate Memory Card
    document.getElementById('mcTitle').value = settings.memoryCard.title;
    document.getElementById('mcMessage').value = settings.memoryCard.message;
    document.getElementById('mcBtnText').value = settings.memoryCard.btnText;
    if(settings.memoryCard.image) {
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

    settings.pages.forEach((page, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.style.cssText = "border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:8px; background:#fff;";
        pageDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #ff1493;">Page ${index + 1}</h4>
                ${settings.pages.length > 1 ? `<button onclick="removePage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>` : ''}
            </div>
            <input type="file" id="pageFile${index}" accept="image/*" style="width: 100%; padding: 8px; margin-bottom: 5px;">
            <div class="image-preview-box" id="previewBox${index}" style="width: 100%; height: 150px; border: 2px dashed #ddd; border-radius: 8px; display: flex; justify-content: center; align-items: center; overflow: hidden; background: #f9f9f9; position: relative;">
                <div class="upload-status" id="uploadStatus${index}" style="position: absolute; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; display: none;"></div>
                ${page.image ? `<img src="${page.image}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` : '<span style="color:#aaa; font-size: 12px;">No Image</span>'}
            </div>
            <textarea id="pageContent${index}" style="width: 100%; padding: 8px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;">${page.content || ''}</textarea>
        `;
        pageConfigs.appendChild(pageDiv);
        document.getElementById(`pageFile${index}`).addEventListener('change', e => {
            if (e.target.files[0]) uploadToImgBB(e.target.files[0], 'page', index);
        });
    });

    if (settings.pages.length < 18) { 
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add New Page'; addBtn.onclick = addNewPage;
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
        settings.gift = document.getElementById('giftImage').value;
        
        settings.effectSequence = [
            document.getElementById('seq1').value,
            document.getElementById('seq2').value,
            document.getElementById('seq3').value
        ];

        settings.memoryCard.title = document.getElementById('mcTitle').value;
        settings.memoryCard.message = document.getElementById('mcMessage').value;
        settings.memoryCard.btnText = document.getElementById('mcBtnText').value;

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
