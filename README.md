
# Musicfy Web Player

![Musicfy Logo](assets/icons/logo.svg)

A **fully-responsive**, **vanilla-JavaScript** web music player inspired by popular streaming UIs—renamed “Musicfy” to avoid any trademark conflicts. This project demonstrates dynamic content loading, audio playback controls, mobile-first responsive design, and a JSON-driven manifest for easy song management.

---

## 🚀 Live Demo

> Hosted on GitHub Pages:  
> https://vedantroy475.github.io/Musicfy-Web-Player/

---

## 📖 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Development Notes](#development-notes)  
- [Adding & Managing Songs](#adding--managing-songs)  
- [Contributing](#contributing)  
- [License](#license)  
- [Disclaimer](#disclaimer)  

---

## ✨ Features

- **Dynamic Playlist Loading**  
  - Reads a single **`songs/songs.json`** manifest, which lists all folders and MP3 filenames.  
  - Automatically builds “albums” (cards) and per-folder song lists.  

- **Audio Playback Controls**  
  - Play, Pause, Next, Previous buttons  
  - Click any song in the sidebar to jump directly to that track  
  - Seekbar with draggable progress indicator  
  - Volume control with mute/unmute toggle  

- **Mobile-First Responsive Design**  
  - CSS media queries adapt layout for screens from 1920px down to 340px  
  - Hamburger menu to toggle sidebar on small viewports  

- **Clean, Modular JavaScript**  
  - Single `script.js` orchestrates:  
    1. Loading the songs manifest  
    2. Rendering album cards  
    3. Populating the sidebar playlist  
    4. Wiring up playback, navigation, and volume events  
  - No external libraries—pure ES6+  

- **Customizable & Extendable**  
  - Just update `songs/songs.json` or drop new folders under `songs/`  
  - Each album folder can include an `info.json` with `title` and `description` fields  
  - Drop in new icon SVGs or swap out styling in `css/style.css`  

---

## 🛠 Tech Stack

- **HTML5** & **CSS3** (Flexbox, Grid, Custom Scrollbars)  
- **Vanilla JavaScript** (ES6 modules, `fetch()`, `Audio` API)  
- **JSON** for song manifest and album metadata  
- **GitHub Pages** for static hosting  

---

## 🔧 Installation & Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Vedantroy475/Musicfy-Web-Player.git
   cd Musicfy-Web-Player
   ```

2. **Serve Locally**  
   Any static-file server will work. For example, with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code or:
   ```bash
   npx http-server . -p 3000
   ```
   Then open `http://localhost:3000` in your browser.

3. **Build & Deploy**  
   - All files are static—no build step required.  
   - Push to your GitHub repo’s `main` branch and enable **GitHub Pages** in Settings → Pages → Deploy from `main/` folder `/root`.

---

## 📋 Usage

- Click any **album card** to load its song list into the sidebar.  
- Click the **Play** ▶️ icon or any track in the sidebar to start playback.  
- Use **Prev ⏮ / Next ⏭** buttons to navigate.  
- Click the **seekbar** to jump to any point in the track.  
- Drag the **volume slider** or click the **mute** 🔈 icon.  
- On mobile, tap the **hamburger** ☰ to reveal the sidebar, and tap ✕ to hide it.

---

## 🗂 Project Structure

```
Musicfy-Web-Player/
├─ assets/
│  └─ icons/                # SVG icons (play, pause, volume, etc.)
├─ css/
│  ├─ style.css             # Main styles and responsive media queries
│  └─ utility.css           # Helper classes (flex, padding, scrollbar, etc.)
├─ js/
│  └─ script.js             # All player logic and DOM wiring
├─ songs/
│  ├─ songs.json            # Manifest listing each folder’s MP3 files
│  ├─ American_NCS/
│  │  ├─ cover.png
│  │  ├─ info.json          # { title, description }
│  │  └─ *.mp3
│  ├─ Happy_Songs/
│  └─ Korean_NCS/
├─ index.html
└─ README.md
```

---

## 📝 Development Notes

- **Manifest (`songs.json`)** must match the folder names exactly.  
- All file paths in `script.js` are **relative**, so GitHub Pages can serve them from `/Musicfy-Web-Player/`.  
- If you add a new folder under `songs/`, simply update `songs.json` and add `info.json` & `cover.png` to have it auto-detected.

---

## ➕ Adding & Managing Songs

1. Create a new subfolder under `songs/`, e.g. `My_New_Album/`.  
2. Drop in your MP3 files **(no spaces or URL-encoded names are fine; the script will decode them).**  
3. Update `songs/songs.json`:
   ```json
   {
     "American_NCS": [ "file1.mp3", … ],
     "Happy_Songs":  [ … ],
     "Korean_NCS":  [ … ],
     "My_New_Album": [ "trackA.mp3", "trackB.mp3" ]
   }
   ```
4. (Optional) Add `songs/My_New_Album/info.json`:
   ```json
   {
     "title":       "My New Album",
     "description": "A brief description"
   }
   ```
5. Push to GitHub—your new album appears automatically.

---

## 🤝 Contributing

1. Fork this repository.  
2. Create a feature branch: `git checkout -b feat/awesome`  
3. Commit your changes: `git commit -m "feat: add awesome feature"`  
4. Push to your fork: `git push origin feat/awesome`  
5. Open a Pull Request—describe what you’ve added or fixed.  

Please keep all styling consistent and update this README if you introduce new config options.
---


## 📫 Contact

- **GitHub:** [Vedantroy475](https://github.com/Vedantroy475)  
- **LinkedIn:** [Vedant Roy](https://www.linkedin.com/in/vedant-roy-b58117227/)  
- **Email:** [vedantroy3@gmail.com](mailto:vedantroy3@gmail.com)

---

## 📄 License

MIT © Vedant Roy  
See [LICENSE](LICENSE) for details.

---

## ⚠️ Disclaimer & Data Privacy

> **DISCLAIMER:** Musicfy is a **personal educational project** and is **not affiliated**, endorsed by, or sponsored by Spotify (or any other music service).  
> Musicfy does **not** collect, track, or store any user data, usage analytics, personal information, payment details, or behavior.  
> All music files must be *royalty-free* or used with proper permission.  
> This site is provided “as is” for learning and demonstration purposes only.


---
