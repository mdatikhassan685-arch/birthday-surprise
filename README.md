# 🎉 Magic Birthday Surprise Generator

A fully serverless, interactive, and personalized birthday surprise generator! Create magical, customized web pages with beautiful 3D animations, music, memory cards, and floating hearts to surprise your loved ones. 

![Project Banner](./image/logo.png)

## ✨ Features

- 🔐 **Multi-User System:** Secure login and registration using LocalStorage. Each user has their own private dashboard.
- 🎨 **Beautiful Animations:** Matrix rain, floating hearts, 3D flipping photo book, and fireworks.
- 💌 **Interactive Memory Cards:** A TikTok-style pop-up memory card and a 6-photo Polaroid collage with smooth touch/hover interactions.
- 🎵 **Custom Music & Gifs:** Choose from built-in romantic tracks and anime GIFs, or upload your own photos.
- ☁️ **Auto Image Hosting:** Seamlessly upload custom photos directly to ImgBB without any backend.
- 🚀 **Serverless Database:** Saves all text, colors, and sequences to JSONbin.io instantly.
- 🪄 **Magic Link Generator:** Automatically generates a short, shareable link (via is.gd API) to send to the birthday person!
- 📱 **Fully Responsive:** Works perfectly on desktop, tablet, and mobile devices with a smart "Rotate Screen" lock.

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** Browser LocalStorage (for user sessions and drafts)
- **Database:** [JSONbin.io](https://jsonbin.io/) (NoSQL Document Storage)
- **Image Hosting:** [ImgBB API](https://api.imgbb.com/)
- **URL Shortener:** [is.gd API](https://is.gd/)
- **Animations:** HTML5 Canvas, CSS Keyframes, and custom 3D Transforms

---

## 🚀 How to Use (For Users)

1. **Sign Up / Login:**
   - Open `index.html`.
   - Create a new account or log in with your existing credentials.

2. **Customize Your Surprise:**
   - You will be redirected to the **User Dashboard** (`user.html`).
   - Select background music, write your special messages, and set the countdown timer.
   - Choose a color theme (Pink, Blue, Purple, or Custom).
   - **Set the Effect Sequence:** Decide what appears first (e.g., Memory Card ➡️ 3D Book ➡️ Floating Hearts ➡️ Matrix Rain).

3. **Upload Memories:**
   - Upload photos for the Front Memory Card, the 6-Photo Collage, and the 3D Book pages. 
   - *Note: Photos are automatically and securely uploaded to the cloud.*

4. **Generate Magic Link:**
   - Click the **"🪄 Generate Magic Link"** button.
   - Copy the short link and send it to your special someone!

5. **The Surprise (`surprise.html`):**
   - When the receiver opens the link, they will experience the magical sequence exactly as you designed it, without any settings or admin panels visible!

---

## 📁 Project Structure

```text
magic-birthday-surprise/
├── 📄 index.html              # User Authentication (Login/Signup)
├── 📄 user.html               # User Dashboard / Control Panel
├── 📄 surprise.html           # The final generated surprise page
├── 📄 README.md               # Project documentation
│
├── 📁 css/
│   └── index.css              # Main stylesheet (Animations, UI, Layouts)
│
├── 📁 jscp/
│   ├── settings_user.js       # Handles Dashboard UI, ImgBB uploads, and JSONbin saves
│   ├── settings_client.js     # Fetches data from JSONbin using the Magic Link ID
│   └── main.js                # The Animation Engine (Matrix, Book, Hearts, Sequence Control)
│
├── 📁 image/
│   └── Birthday!/             # Default local assets (Cover, Logo, Icons)
│
├── 📁 gif/                    # Default Anime GIFs for Memory Cards
│
└── 📁 music/                  # Default Background Music tracks (.mp3)

License

This project is open-source and free to use for personal, non-commercial purposes. Spread the love and make someone's birthday unforgettable!

Created with by MD Atik Hassan
