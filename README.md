
<p align="center">
  <img src="https://telegra.ph/file/17cb37c73de7b63cdd1c8.jpg" width="300"/>
</p>

<h1 align="center">DANUWA-MD</h1>

<p align="center">
  A powerful multi-device WhatsApp bot built using the Baileys library.
</p>

<p align="center">
  <a href="https://github.com/your-username/DANUWA-MD">
    <img src="https://img.shields.io/github/repo-size/your-username/DANUWA-MD?color=green&label=Repo%20Size&style=flat-square" />
  </a>
  <a href="https://github.com/your-username/DANUWA-MD">
    <img src="https://img.shields.io/github/license/your-username/DANUWA-MD?color=blue&style=flat-square" />
  </a>
  <a href="https://github.com/your-username/DANUWA-MD/fork">
    <img src="https://img.shields.io/github/forks/your-username/DANUWA-MD?style=flat-square" />
  </a>
  <a href="https://github.com/your-username/DANUWA-MD/stargazers">
    <img src="https://img.shields.io/github/stars/your-username/DANUWA-MD?style=flat-square" />
  </a>
</p>

---

## 📍 What is DANUWA-MD?

**DANUWA-MD** is a multi-device WhatsApp bot written in Node.js using the [Baileys](https://github.com/adiwajshing/Baileys) library. It supports QR/Pairing code login, a plugin-based command system, and various media tools such as sticker conversion, song and video downloads, and group management commands.

---

## 🛠️ Setup

### 🧾 Requirements

- Node.js v18 or newer
- FFmpeg installed and accessible in your terminal
- A WhatsApp account with multi-device enabled

### 🚀 Installation

```bash
git clone https://github.com/your-username/DANUWA-MD.git
cd DANUWA-MD
npm install
npm start
```

Then visit:  
**http://localhost:3000**  
Scan the QR code or paste the pairing code.

---

## 🧰 Features

✅ Multi-device support using Baileys  
✅ QR/Code-based login via Express web server  
✅ Media downloaders (song, video, Facebook, YouTube)  
✅ Sticker conversion (image/video to WebP)  
✅ Group tools (kick, promote, add, groupinfo)  
✅ Reply-based command interaction  
✅ Modular plugin system for easy development

---

## 💡 Example Commands

```
.song shape of you
.video https://youtube.com/....
.sticker (reply to image/video)
.kick @user
.promote @user
.groupinfo
```

Use `.menu` or `.help` to see all commands.

---

## 🔌 Plugin Development

You can add custom commands easily by creating new files in the `/plugins` folder.

```js
const { cmd } = require('../command');

cmd({
  pattern: 'hello',
  desc: 'Replies with hello',
  category: 'fun',
  filename: __filename
}, async (m) => {
  await m.reply('Hello from DANUWA-MD!');
});
```

---

## 🖥 Deploying on Various Platforms

### 🚀 Deploying on **Railway**

1. Visit [Railway](https://railway.app/) and sign in.
2. Click on **New Project** → **Deploy from GitHub**.
3. Select the repository for **DANUWA-MD**.
4. Railway will automatically install dependencies and deploy the bot.
5. After deployment, access the bot via the URL provided by Railway.

##### Example for environment variables (if needed):
Add these variables in the **Railway** dashboard under **Settings > Variables**:
- `SESSION_ID` (optional if using session-based auth)
- `ADMIN` (optional, to specify the admin)

### 🚀 Deploying on **Replit**

1. Go to [Replit](https://replit.com/) and log in.
2. Click on **Create New Repl** → Choose **Node.js**.
3. Connect your **GitHub** repository by selecting **Import from GitHub**.
4. After importing, run the following command in the **Shell**:
    ```bash
    npm install
    ```
5. Set up **Environment Variables** by navigating to **Secrets (Environment Variables)** and adding necessary keys like:
    - `SESSION_ID`
    - `ADMIN`
6. Run the bot using **Start** in the Replit interface.
7. Replit provides a URL for the bot, and you'll need to set up a webhook for continuous operation using the Replit uptime service.

### 🚀 Deploying on **Heroku**

1. Visit [Heroku](https://heroku.com/) and log in.
2. Create a new **Heroku App** from your **Heroku Dashboard**.
3. Link your **GitHub** repository with Heroku.
4. In the **Deploy** tab, select **GitHub** as the deployment method.
5. Set up necessary environment variables:
    - `SESSION_ID`
    - `ADMIN`
6. After deployment, your app will be live on a **Heroku URL**.

##### Example steps to set up:
- Open the **Heroku CLI** and run:
    ```bash
    heroku login
    heroku create
    git push heroku main
    ```

### 🚀 Deploying on **Koyeb**

1. Visit [Koyeb](https://www.koyeb.com/) and log in.
2. Click **Create App** and choose **Deploy from GitHub**.
3. Select **DANUWA-MD** repository and configure the deployment.
4. Set up **Environment Variables** in the Koyeb dashboard:
    - `SESSION_ID`
    - `ADMIN`
5. Koyeb will build and deploy the app. You'll receive a **URL** for your bot.

---

## 🖥 Deploying on VPS (Linux)

```bash
sudo apt update && sudo apt install ffmpeg
npm install -g pm2
pm2 start index.js
pm2 save
pm2 startup
```

---

## 👨‍💻 Developer

- **Name**: [Your Name]
- **GitHub**: [github.com/your-username](https://github.com/your-username)
- **Telegram**: [@yourhandle](https://t.me/yourhandle)

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🌟 Star the Repository

If you like this project, don’t forget to ⭐️ the repo!

---

> Made with 💖 by DANUWA-MD Team
