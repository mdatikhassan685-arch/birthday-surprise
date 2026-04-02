// ==========================================
// 🌐 Multi-Language System (English & Bengali)
// ==========================================

const translations = {
    en: {
        title: "Happy Birthday Surprise 🎁",
        description: "A special birthday surprise! Create a beautiful interactive site with animations, music, and memories!",
        login: "User Login",
        logout: "Logout",
        settings: "Create Your Surprise",
        musicSettings: "🎵 Music Settings",
        textSettings: "📝 Text Settings",
        mainAnimationText: "Main Animation Text (Use | to separate words):",
        matrixText: "Background Matrix Text:",
        countdownTime: "Countdown Time (seconds):",
        effectSequence: "🪄 Effect Sequence",
        seqInstruction: "Set the order of effects. Select 'None' to disable an effect.",
        memoryCardSettings: "💌 Screen 1: Memory Card (Front Screen)",
        titleLabel: "Title (e.g., Happy Birthday ❤️):",
        messageLabel: "Message:",
        btnTextLabel: "Button Text:",
        uploadPhoto: "Upload Photo:",
        chooseGif: "Or Choose an Animation GIF:",
        innerMemorySettings: "🖼️ Screen 2: Inner Memory (6 Photos)",
        innerTitleLabel: "Inner Title:",
        innerMessageLabel: "Inner Message:",
        innerBtnTextLabel: "Final Button Text:",
        upload6Photos: "Upload 6 Photos for Collage:",
        loveNoteSettings: "💌 Screen 3: A Love Note",
        writeLoveLetter: "Write your Love Letter:",
        rightCardTitle: "Right Card Title:",
        rightCardSub: "Right Card Subtext:",
        finalBtnText: "Final Button Text:",
        bookSettings: "📖 Book Pages (Upload Photos)",
        addPage: "+ Add New Page",
        removePage: "Remove Page",
        colorTheme: "🎨 Choose Color Theme",
        sweetPink: "Sweet Pink",
        coolBlue: "Cool Blue",
        dreamyPurple: "Dreamy Purple",
        customColor: "Custom Color",
        generateLink: "🪄 Generate Magic Link",
        linkReady: "🎉 Your Surprise Link is Ready!",
        copyLink: "📋 Copy Link",
        rotatePhone: "Please rotate your phone<br>(Hold it in landscape mode)",
        tapToStart: "Tap to Start Surprise 🎁",
        emptyPage: "Empty Page",
        theEnd: "The End",
        uploading: "Uploading... ⏳",
        success: "Success! ✅",
        error: "Error! ❌",
        noPhoto: "No Photo Uploaded"
    },
    bn: {
        title: "শুভ জন্মদিন সারপ্রাইজ 🎁",
        description: "একটি বিশেষ জন্মদিনের সারপ্রাইজ! এনিমেশন, মিউজিক এবং স্মৃতি দিয়ে তৈরি করুন একটি চমৎকার ওয়েবসাইট!",
        login: "ইউজার লগিন",
        logout: "লগআউট",
        settings: "আপনার সারপ্রাইজ তৈরি করুন",
        musicSettings: "🎵 মিউজিক সেটিংস",
        textSettings: "📝 টেক্সট সেটিংস",
        mainAnimationText: "মূল এনিমেশন টেক্সট (শব্দ আলাদা করতে | ব্যবহার করুন):",
        matrixText: "ব্যাকগ্রাউন্ড ম্যাট্রিক্স টেক্সট:",
        countdownTime: "কাউন্টডাউন সময় (সেকেন্ড):",
        effectSequence: "🪄 ইফেক্ট সিকোয়েন্স (কোনটির পর কোনটি আসবে)",
        seqInstruction: "ইফেক্টের সিরিয়াল ঠিক করুন। বন্ধ করতে 'None' সিলেক্ট করুন।",
        memoryCardSettings: "💌 স্ক্রিন ১: মেমোরি কার্ড (প্রথম পেজ)",
        titleLabel: "টাইটেল (যেমন, শুভ জন্মদিন ❤️):",
        messageLabel: "মেসেজ:",
        btnTextLabel: "বাটন টেক্সট:",
        uploadPhoto: "ছবি আপলোড করুন:",
        chooseGif: "অথবা একটি এনিমেশন জিফ (GIF) সিলেক্ট করুন:",
        innerMemorySettings: "🖼️ স্ক্রিন ২: ভেতরের মেমোরি (৬টি ছবি)",
        innerTitleLabel: "ভেতরের টাইটেল:",
        innerMessageLabel: "ভেতরের মেসেজ:",
        innerBtnTextLabel: "শেষ বাটনের টেক্সট:",
        upload6Photos: "কোলাজের জন্য ৬টি ছবি আপলোড করুন:",
        loveNoteSettings: "💌 স্ক্রিন ৩: একটি ভালোবাসার চিঠি",
        writeLoveLetter: "আপনার ভালোবাসার চিঠিটি লিখুন:",
        rightCardTitle: "ডান পাশের কার্ডের টাইটেল:",
        rightCardSub: "ডান পাশের কার্ডের সাবটেক্সট:",
        finalBtnText: "শেষ বাটনের টেক্সট:",
        bookSettings: "📖 বইয়ের পাতা (ছবি আপলোড)",
        addPage: "+ নতুন পাতা যোগ করুন",
        removePage: "পাতাটি মুছুন",
        colorTheme: "🎨 কালার থিম সিলেক্ট করুন",
        sweetPink: "মিষ্টি গোলাপি",
        coolBlue: "কুল ব্লু (নীল)",
        dreamyPurple: "মায়াবী বেগুনি",
        customColor: "কাস্টম কালার",
        generateLink: "🪄 ম্যাজিক লিংক তৈরি করুন",
        linkReady: "🎉 আপনার সারপ্রাইজ লিংক রেডি!",
        copyLink: "📋 লিংক কপি করুন",
        rotatePhone: "অনুগ্রহ করে আপনার ফোনটি ঘোরান<br>(আড়াআড়ি করে ধরুন)",
        tapToStart: "সারপ্রাইজ শুরু করতে ক্লিক করুন 🎁",
        emptyPage: "ফাঁকা পাতা",
        theEnd: "সমাপ্ত",
        uploading: "আপলোড হচ্ছে... ⏳",
        success: "সফল! ✅",
        error: "ত্রুটি! ❌",
        noPhoto: "কোনো ছবি আপলোড করা হয়নি"
    }
};

let currentLang = localStorage.getItem('siteLang') || 'en';

function applyLanguage() {
    document.documentElement.lang = currentLang;
    
    // HTML এর ভেতরের সব data-i18n টেক্সট পরিবর্তন করবে
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // ইনপুট বক্সের প্লেসহোল্ডারগুলো পরিবর্তন করবে
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    applyLanguage();
}

document.addEventListener('DOMContentLoaded', applyLanguage);
