// script.js
let currentIndex = -1;

// 1) Load a pre‐built JSON manifest at /songs/songs.json
let songManifest = {};
async function loadManifest() {
  const resp = await fetch('/songs/songs.json');
  if (!resp.ok) throw new Error("Couldn't load songs.json");
  songManifest = await resp.json();
}

// 2) Helpers to clean filenames and build URLs
function cleanName(filename) {
  return decodeURIComponent(filename)
    .split('-yt.savetube')[0]
    .replace(/J%C3%A9ja/g, '')
    .trim();
}

function getCleanSongNames(folder) {
  return (songManifest[folder] || []).map(cleanName);
}

function getSongURLs(folder) {
  return (songManifest[folder] || [])
    .map(fn => `/songs/${folder}/${fn}`);
}

// 3) Play a track and update the UI
let currentSong    = new Audio();
let currFolder     = 'American_NCS'; // default key
let hasLoadedFirst = false;

function playMusic(playBtn, url, name, artist) {
  currentSong.src = url;
  currentSong.play();
  hasLoadedFirst = true;

  document.querySelector('.playbar').classList.add('playing');
  document.querySelector('.songbuttons').classList.add('playing');
  document.querySelector('.volume').classList.add('playing');

  playBtn.src = 'assets/icons/pause.svg';
  document.querySelector('.songinfo')
          .innerHTML = `Song: ${name}<br>Artist: ${artist}`;
  document.querySelector('.songtime')
          .innerText = '00:00/00:00';
}

// 4) Populate the song list sidebar
async function loadPlaylist(folder) {
  currFolder = folder;
  currentIndex  = -1;        // ← reset index
  const names = getCleanSongNames(folder);
  const urls  = getSongURLs(folder);

  const ul = document.querySelector('.songList ul');
  ul.innerHTML     = '';
  hasLoadedFirst   = false;
  currentSong.src  = '';

  names.forEach((nm, i) => {
    ul.insertAdjacentHTML('beforeend', `
      <li data-url="${urls[i]}">
        <img class="music-icon invert" src="assets/icons/music.svg">
        <div class="info">
          <div class="songName">${nm}</div>
          <div class="songArtist">Vedant</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="assets/icons/play_button_Version-2.svg">
        </div>
      </li>
    `);
  });

  // wire up each new li
  document.querySelectorAll('.songList li').forEach((li,i) => {
    li.addEventListener('click', () => {
      currentIndex = i;      // ← track which one was clicked
      const url    = li.dataset.url;
      const name   = li.querySelector('.songName').textContent;
      const artist = li.querySelector('.songArtist').textContent;
      playMusic(document.querySelector('#play'), url, name, artist);
    });
  });
}

// 5) Render album cards
async function displayAlbums() {
  const container = document.querySelector('.cardContainer');
  container.innerHTML = '';

  for (const folder of Object.keys(songManifest)) {
    let info = { title: folder, description: '' };
    try {
      const r = await fetch(`/songs/${folder}/info.json`);
      if (r.ok) info = await r.json();
    } catch (_) {}

    const card = document.createElement('div');
    card.className      = 'card';
    card.dataset.folder = folder;
    card.innerHTML = `
      <div class="cover-image">
        <img src="/songs/${folder}/cover.png" alt="${info.title} cover">
        <div class="play"><img src="assets/icons/play.svg" alt="Play"></div>
      </div>
      <h2>${info.title}</h2>
      <span class="artists">${info.description}</span>
    `;

    card.addEventListener('click', () => loadPlaylist(folder));
    container.appendChild(card);
  }
}

// 6) Bootstrap everything
async function main() {
  try {
    await loadManifest();
    await displayAlbums();
    await loadPlaylist(currFolder);

    const playBtn       = document.querySelector('#play');
    const prevBtn       = document.querySelector('#previous');
    const nextBtn       = document.querySelector('#next');
    const volumeControl = document.querySelector('#volume-range');
    const volumeBtn     = document.querySelector('.volume img');
    const seekbar       = document.querySelector('.seekbar');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const closeIcon     = document.querySelector('.close img');

    // Play/Pause
    playBtn.addEventListener('click', () => {
      if (!hasLoadedFirst) {
        const firstLi = document.querySelector('.songList li');
        if (!firstLi) return;
        currentIndex = 0;        // ← remember we’re on song 0
        firstLi.click();         // this will call playMusic as above
        return;
      }
      if (currentSong.paused) {
        currentSong.play();
        playBtn.src = 'assets/icons/pause.svg';
      } else {
        currentSong.pause();
        playBtn.src = 'assets/icons/play_button_Version-2.svg';
      }
    });

    // Prev/Next
    function changeSong(offset) {
      const items = Array.from(document.querySelectorAll('.songList li'));
      if (!items.length) return;
      // wrap around
      currentIndex = (currentIndex + offset + items.length) % items.length;
      items[currentIndex].click();
    }
    prevBtn.addEventListener('click', () => changeSong(-1));
    nextBtn.addEventListener('click', () => changeSong(+1));

    // Timeupdate → clock + circle
    currentSong.addEventListener('timeupdate', () => {
      const c = Math.floor(currentSong.currentTime);
      const d = Math.floor(currentSong.duration)||0;
      const fmt = t => String(Math.floor(t/60)).padStart(2,'0')
                    + ':' + String(t%60).padStart(2,'0');
      document.querySelector('.songtime').textContent = `${fmt(c)}/${fmt(d)}`;
      document.querySelector('.circle').style.left =
        (currentSong.currentTime / currentSong.duration * 100)+'%';
    });

    // Seekbar
    seekbar.addEventListener('click', e => {
      const pct = e.offsetX / e.currentTarget.clientWidth;
      currentSong.currentTime = pct * currentSong.duration;
    });

    // Mobile sidebar toggle
    hamburgerIcon.addEventListener('click', () => {
      document.querySelector('.left').style.left = '0%';
      hamburgerIcon.style.display = 'none';
    });
    closeIcon.addEventListener('click', () => {
      document.querySelector('.left').style.left = '-120%';
      hamburgerIcon.style.display = 'block';
    });

    // Volume
    volumeControl.addEventListener('input', e => {
      currentSong.volume = e.target.value/100;
      volumeBtn.src = currentSong.volume===0
        ? 'assets/icons/volume-mute.svg'
        : 'assets/icons/volume-high.svg';
    });
    volumeBtn.addEventListener('click', () => {
      if (currentSong.volume>0) {
        currentSong.volume=0;
        volumeControl.value=0;
      } else {
        currentSong.volume=0.5;
        volumeControl.value=50;
      }
      volumeBtn.src = currentSong.volume===0
        ? 'assets/icons/volume-mute.svg'
        : 'assets/icons/volume-high.svg';
    });

  } catch (err) {
    console.error("Initialization failed:", err);
  }
}

main();
