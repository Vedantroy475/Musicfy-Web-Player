let currentSong = new Audio();
let currFolder = 'songs/American_NCS';     // default folder
let cleanNames = [];
let fullSongs = [];
let hasLoadedFirst = false;

// Fetch & clean names for a folder
async function getcleanSongNames(folder) {
  const res = await fetch(`http://127.0.0.1:3000/${folder}/`);
  const html = await res.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('a'))
    .filter(a => a.href.endsWith('.mp3'))
    .map(a => {
      let name = a.href.split(`/${folder}/`)[1];
      // Check if the split failed and name is undefined
      if (!name) {
        console.warn(`Could not split href ${a.href} with folder ${folder}`);
        return ""; // or return a default value
      }

      name = name.replaceAll('%20', ' ')
        .split('-yt.savetube')[0]
        .replaceAll('J%C3%A9ja', '');
      return name;
    });
}

// Fetch full URLs for a folder
async function getSongs(folder) {
  const res = await fetch(`http://127.0.0.1:3000/${folder}/`);
  const html = await res.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('a'))
    .filter(a => a.href.endsWith('.mp3'))
    .map(a => a.href);
}

// Play a specific track and update UI
function playMusic(playBtn, url, name, artist) {
  currentSong.src = url;
  currentSong.play();
  hasLoadedFirst = true;

  document.querySelector('.playbar').classList.add('playing');
  document.querySelector('.songbuttons').classList.add('playing');
  document.querySelector('.volume').classList.add('playing');
  playBtn.src = 'assets/icons/pause.svg';
  document.querySelector('.songinfo').innerHTML = `Song: ${name}<br>Artist: ${artist}`;
  document.querySelector('.songtime').innerText = '00:00/00:00';
}
// Build the UL and attach click handlers for that playlist
async function loadPlaylist(folder) {
  currFolder = folder;
  cleanNames = await getcleanSongNames(folder);
  fullSongs = await getSongs(folder);

  const ul = document.querySelector('.songList ul');
  ul.innerHTML = '';  // clear old

  cleanNames.forEach((name, i) => {
    ul.innerHTML += `
      <li data-url="${fullSongs[i]}">
        <img class="music-icon invert" src="assets/icons/music.svg">
        <div class="info">
          <div class="songName">${name}</div>
          <div class="songArtist">Vedant</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="assets/icons/play_button_Version-2.svg">
        </div>
      </li>`;
  });

  // clear any previously loaded song
  currentSong.src = '';
  hasLoadedFirst = false;   // << reset here
  // attach click on each li
  document.querySelectorAll('.songList li').forEach(li => {
    li.addEventListener('click', () => {
      const url    = li.dataset.url;
      const name   = li.querySelector('.songName').innerText;
      const artist = li.querySelector('.songArtist').innerText;
      playMusic(document.querySelector('#play'), url, name, artist);
    });
  });
}


// Render album cards
async function displayAlbums() {
  const res = await fetch(`http://127.0.0.1:3000/songs/`);
  const html = await res.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  const cardContainer = document.querySelector('.cardContainer');
  const anchors = Array.from(div.querySelectorAll('a'))
    .filter(a => a.href.includes('/songs/'));

  for (let a of anchors) {
    const folder = a.href.split('/songs/')[1].split('/')[0];
    try {
      const info = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`).then(r=>r.json());
      cardContainer.innerHTML += `
        <div data-folder="songs/${folder}" class="card">
        
        <div class="cover-image">
        <img src="/songs/${folder}/cover.png" alt="">
        <div class="play"><img src="assets/icons/play.svg" alt=""></div>
        </div>
        
          <h2>${info.title}</h2>
          <span class="artists">${info.description}</span>
        </div>`;
    } catch(e){
      console.warn('no info.json for', folder);
    }
  }
}

async function main() {
  const playBtn = document.querySelector('#play');
  // Display all the albums on the page
  await displayAlbums();

  // initial load of default playlist
  await loadPlaylist(currFolder);

  // card click => load that album
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const folder = card.dataset.folder;
      if (folder) loadPlaylist(folder);
    });
  });
  // Attach an event listener to the play, previous, and next buttons
  
// Play/Pause button logic
playBtn.addEventListener('click', () => {
  // 1) First‐time load & play
  if (!hasLoadedFirst) {
    const firstLi = document.querySelector('.songList li');
    if (!firstLi) return;
    const url    = firstLi.dataset.url;
    const name   = firstLi.querySelector('.songName').innerText;
    const artist = firstLi.querySelector('.songArtist').innerText;
    playMusic(playBtn, url, name, artist);
    return;
  }

  // 2) Toggle play/pause
  if (currentSong.paused) {
    currentSong.play();
    playBtn.src = 'assets/icons/pause.svg';
    document.querySelector('.playbar').classList.add('playing');
    document.querySelector('.songbuttons').classList.add('playing');
    document.querySelector('.volume').classList.add('playing');
  } else {
    currentSong.pause();
    playBtn.src = 'assets/icons/play_button_Version-2.svg';
  }
});



  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {

    let currentTime = Math.floor(currentSong.currentTime);
    let duration = Math.floor(currentSong.duration);
    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = currentTime % 60;
    let durationMinutes = Math.floor(duration / 60);
    let durationSeconds = duration % 60;

    // Format time as MM:SS

    currentMinutes = currentMinutes < 10 ? '0' + currentMinutes : currentMinutes;
    currentSeconds = currentSeconds < 10 ? '0' + currentSeconds : currentSeconds;
    durationMinutes = durationMinutes < 10 ? '0' + durationMinutes : durationMinutes;
    durationSeconds = durationSeconds < 10 ? '0' + durationSeconds : durationSeconds;

    document.querySelector(".songtime").innerHTML = `${currentMinutes}:${currentSeconds}/${durationMinutes}:${durationSeconds}`;
    document.querySelector(".circle").style.left = `${currentSong.currentTime / currentSong.duration * 100}%`;
  })


  // Add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // Get the percentage of the seekbar that was clicked
    // Calculate the percentage based on the click position and the width of the seekbar
    let seekbar_percentage = e.offsetX / e.target.getBoundingClientRect().width * 100;
    document.querySelector(".circle").style.left = seekbar_percentage + "%";
    currentSong.currentTime = (seekbar_percentage * currentSong.duration) / 100;

  })

  // Add an event listener for the hamburger icon
  document.querySelector(".hamburger-icon").addEventListener("click", (e) => {
    let left_side = document.querySelector(".left");
    left_side.style.left = "0%";
    left_side.style.transition = "left 0.3s ease-in-out";
    e.target.style.display = "none";

  })

  // Add an event listener for the close icon
  let cross_icon = document.querySelector(".close img");
  cross_icon.addEventListener("click", () => {
    let left_side = document.querySelector(".left");
    left_side.style.left = "-120%";
    let hamburger_icon = document.querySelector(".hamburger-icon");
    hamburger_icon.style.display = "block";
    left_side.style.transition = "left 0.3s ease-in-out";
    // hamburger_icon.style.transition="display 0.3s ease-in-out";

  })

  // Add an event listener to previous button
  let previousBtn = document.querySelector("#previous");
  previousBtn.addEventListener("click", () => {
    let currentSongIndex = Array.from(document.querySelectorAll(".songList li")).findIndex(li => li.getAttribute("data-url") == currentSong.src);
    let previousSongIndex = (currentSongIndex - 1 + cleanNames.length) % cleanNames.length;
    let previousSong = document.querySelectorAll(".songList li")[previousSongIndex];
    let previousSongUrl = previousSong.getAttribute("data-url");
    let previousSongName = previousSong.querySelector(".songName").innerText;
    let previousSongArtist = previousSong.querySelector(".songArtist").innerText;
    playMusic(playBtn, previousSongUrl, previousSongName, previousSongArtist);

  })

  // Add an event listener to next button
  let nextBtn = document.querySelector("#next");
  nextBtn.addEventListener("click", () => {
    let currentSongIndex = Array.from(document.querySelectorAll(".songList li")).findIndex(li => li.getAttribute("data-url") == currentSong.src);
    let nextSongIndex = (currentSongIndex + 1) % cleanNames.length;
    let nextSong = document.querySelectorAll(".songList li")[nextSongIndex];
    let nextSongUrl = nextSong.getAttribute("data-url");
    let nextSongName = nextSong.querySelector(".songName").innerText;
    let nextSongArtist = nextSong.querySelector(".songArtist").innerText;
    playMusic(playBtn, nextSongUrl, nextSongName, nextSongArtist);
  })


  // Add an event listener to control song volume
  volumeControl = document.querySelector("#volume-range");
  volumeControl.addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
    if (currentSong.volume == 0) {
      volumeBtn.src = "assets/icons/volume-mute.svg";
    }
    else {
      volumeBtn.src = "assets/icons/volume-high.svg";
    }
  })

  volumeBtn = document.querySelector(".volume img");
  volumeBtn.addEventListener("click", () => {
    if (currentSong.volume == 0) {
      currentSong.volume = 0.5; // Set to half of max: 100 when volume is unmuted
      volumeBtn.src = "assets/icons/volume-high.svg";
      volumeControl.value = 50; // Set the range input to half of max: 100 when volume is unmuted
      
    }

    else {
      currentSong.volume = 0;
      volumeBtn.src = "assets/icons/volume-mute.svg";
      volumeControl.value = 0
    }
  })


  //Load the playlist whenever a card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", async () => {
      // Logic here for handling the card click event
      let folder = card.getAttribute("data-folder");   // You can also use element.currentTarget.getAttribute("data-folder") where element is the event object         // Or element.currentTarget.dataset.folder
      if (folder) { // To Check if folder exists
        currFolder = folder;
        cleanNames = await getcleanSongNames(currFolder);
        fullSongs = await getSongs(currFolder);
      } else {
        console.warn("data-folder attribute missing in clicked card:", card);
      }
    });
  });
}

main();
