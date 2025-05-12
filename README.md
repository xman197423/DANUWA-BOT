<h1 align="center" style="font-weight:bold;">
  ✨ ＤＡＮＵＷＡ－ＭＤ ✨
</h1>

<p align="center">
  <img src="https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images/Danuwa%20-%20MD.png?raw=true" alt="DANUWA-MD Logo" style="border-radius: 50px; box-shadow: 0 0 20px #00ffe5, 0 0 30px #00ffe5, 0 0 40px #00ffe5;">
</p> 

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=10B981&center=true&vCenter=true&width=600&lines=Hello+How+are+you%3F;Welcome+to+DANUWA-MD+WhatsApp+Bot;I'm+Danuka+Disanayaka" alt="Typing SVG" />
</p>

<p align="center">
  <strong>A modern, multi-device WhatsApp bot</strong><br>
  <em>Powered by <a href="https://github.com/WhiskeySockets/Baileys" target="_blank">Baileys</a> — optimized for speed, flexibility, and automation.</em>
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

1. **Fork the Repository**  
   [DANUWA-MD GitHub Repo](https://github.com/DANUWA-MD/DANUWA-BOT)

2. **Generate Session ID**  
   [Generate Session ID](https://replit.com/@quizontalbot/DANUWA-MD-PAIR-CODE?v=1)

3. **Configure Session and Owner Info**  
   Edit `config.js` with your session ID and owner number (international format)

---

## ⚡ Deployment Methods

[![🚀 DEPLOY IN GITHUB CODESPACES](https://img.shields.io/badge/🚀%20DEPLOY%20IN-GITHUB%20CODESPACES-blue?logo=github&style=for-the-badge)](https://github.com/codespaces/new?hide_repo_select=true&repo=danuwa-bot/DANUWA-MD)  
[![⚡ DEPLOY IN REPLIT](https://img.shields.io/badge/⚡%20DEPLOY%20IN-REPLIT-4631D4?logo=replit&logoColor=white&style=for-the-badge)](https://replit.com)  
[![🚀 DEPLOY IN GITHUB](https://img.shields.io/badge/🚀%20DEPLOY%20IN-GITHUB%20ACTIONS-blue?logo=githubactions&style=for-the-badge)](https://github.com/your-username/DANUWA-MD/actions)

---

## 🧑‍💻 How to Deploy DANUWA-MD on GitHub Codespaces

1. Click the **"Launch in GitHub Codespaces"** button above.
2. Sign in with your GitHub account if needed.
3. Choose your forked repository (`DANUWA-MD`) to open in a new Codespace.
4. Wait for GitHub to set up your development environment.
5. In the terminal, install dependencies using:

   ```bash
   npm install
   ```

6. Start the bot using:

   ```bash
   node index.js
   ```


## ⚡ How to Deploy DANUWA-MD on Replit

1. Click the **"Run on Replit"** button above to begin deployment.  
2. Log in to [Replit](https://replit.com) using your **GitHub account** if prompted.  
3. On your Replit dashboard, click the **➕ “Create Repl”** button in the left sidebar.  
4. Select **“Import from GitHub”** and paste the link to your **forked `DANUWA-MD` repository**.  
5. Replit will automatically import and set up your project.  
6. Once ready, click the **“Run”** button at the top — the bot will start and show logs in the console.

✅ **Note:**  
Make sure your repository includes all required files (`index.js`, `plugins`, `auth/`, etc.) and no essential configuration is missing.

---

## 🚀 How to Deploy DANUWA-MD on GitHub (via Actions)

After you've added your **session ID** and updated the **owner number** in `config.js`, follow these steps to deploy your bot using **GitHub Actions**:

1. In your forked repository, click on the **Actions** tab in the navigation bar.

2. In the search bar that says **“Search workflows”**, type `node.js`. You’ll see a workflow template named **Node.js** — click on it to start configuring.

3. Once the workflow editor opens, **delete all the existing code** inside the editor.

4. **Copy and paste** the following GitHub Actions configuration into the editor:

```
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm install
    - run: npm start
    - run: npm test

 ```

5. Once pasted, **commit the changes**.

6. GitHub will now automatically deploy your bot using this workflow when you push updates to the `main` branch.

✅ **Note:** Make sure all required files (`index.js`, `config.js`, `plugins/`, `auth/`, etc.) are properly configured and committed to your repository before triggering the workflow.

---

## ✅ Features

DANUWA-MD is designed with scalability, flexibility, and functionality in mind. Here’s what it offers:

| Category          | Description |
|------------------|-------------|
| **🔗 Multi-Device Support** | Seamless compatibility with WhatsApp Multi-Device using the Baileys library. |
| **📱 QR/Pairing Login** | Secure and easy authentication via QR code or pairing session. |
| **📦 Modular Plugin Architecture** | Easily extend functionality with a clean, plugin-based command system. |
| **🎵 Media Tools** | Download music and videos from platforms like YouTube, Facebook, and more. |
| **🖼️ Sticker Tools** | Convert images and videos to high-quality stickers in WebP format. |
| **👥 Group Management** | Manage WhatsApp groups with commands to add, remove, promote, demote, etc. |
| **🧠 Smart Interaction** | Reply-based command handling for a more interactive user experience. |
| **⚙️ Developer Friendly** | Built in Node.js with clean structure, ideal for contributors and customization. |

---

## 👨‍💻 Developer

<p align="center">
  <img src="https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images%20/Danuka%20Dissanayake.jpg?raw=true" width="540" style="border-radius: 50px;" alt="Danuka Disanayaka"/>
</p>

<p align="center"><b>Danuka Disanayaka</b></p>

<p align="center">
Danuka Disanayaka is a passionate full-stack developer and automation enthusiast with a focus on building scalable bots, AI integrations, and open-source tools. With a deep understanding of JavaScript, Node.js, and real-time systems, Harshana actively contributes to the developer community by creating tools that simplify communication and task automation. His work emphasizes clean code, performance, and user-centric design.
</p>

<p align="center">
  <a href="https://github.com/DANUWA_MD">GitHub</a> • 
  <a href="https://www.youtube.com/@quizontal">YouTube</a> •
  <a href="https://Wa.me/+94776121326">WhatsApp</a> •
  <a href="https://www.facebook.com/share/1AM4qa8S4e/">Facebook</a>


</p>

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🌟 Star the Repository

If you like this project, don’t forget to ⭐️ the repo!

> Made with 💖 by DANUWA-MD Team
