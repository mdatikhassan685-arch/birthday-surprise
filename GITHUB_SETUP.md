# 🚀 GitHub Setup & Deployment Guide for Magic Birthday Generator

This guide will help you upload your serverless birthday site to GitHub and instantly deploy it online for free!

---

## 📋 Prerequisites

Before you begin, ensure you have:
- A GitHub account ([Sign up here](https://github.com/join) if you don't have one).
- Git installed on your computer.

---

## 🔗 Step 1: Create a New Repository on GitHub

1. Log in to your [GitHub](https://github.com) account.
2. Click the **"+"** icon in the top-right corner and select **"New repository"**.
3. Fill in the repository details:
   - **Repository name**: `magic-birthday-generator` (or choose your own).
   - **Description**: "A serverless, interactive birthday surprise generator with animations and memory cards."
   - **Visibility**: Choose **Public** (required for free GitHub Pages deployment).
   - **DO NOT** initialize with a README, .gitignore, or license (since you already have these files locally).
4. Click the green **"Create repository"** button.

---

## 🔄 Step 2: Connect Your Local Files to GitHub

Open your computer's terminal (or command prompt/Git Bash), navigate to your project folder (e.g., `cd path/to/your/folder`), and run the following commands sequentially:

```bash
# Initialize the local directory as a Git repository
git init

# Add all your files to the staging area
git add .

# Commit your files with a message
git commit -m "Initial commit: Added Serverless Birthday Generator"

# Add the GitHub repository as your remote origin (Replace YOUR-USERNAME with your actual GitHub username!)
git remote add origin https://github.com/YOUR-USERNAME/magic-birthday-generator.git

# Rename your main branch (if needed)
git branch -M main

# Push your code to the GitHub repository
git push -u origin main

🌐 Step 3: Deploy to GitHub Pages (100% Free Hosting)
Now that your code is on GitHub, you can make it a live website!
Go to your repository on GitHub.
Click the "Settings" tab (top right, near the gear icon).
Scroll down and click on "Pages" in the left sidebar.
Under the "Source" section, look for the "Branch" dropdown.
Select main (or master) and keep the folder as / (root).
Click "Save".
Wait 1-2 minutes, then refresh the page.
You will see a green banner saying: "Your site is live at https://YOUR-USERNAME.github.io/magic-birthday-generator/"
🎉 Congratulations! Your site is now live on the internet!

🛠️ Step 4: How to Make Updates in the Future
Whenever you change a picture, modify text, or update an API key locally, you must push those changes to GitHub to update your live website.
Run these 3 simple commands in your terminal:
code

# 1. Add all changed files
git add .

# 2. Commit the changes
git commit -m "Updated images and text"

# 3. Push to GitHub (Your live site will update automatically in 1-2 minutes)
git push
