// Elements
const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const volumeSlider = document.getElementById("volume");
const volumeTooltip = document.getElementById("volume-tooltip");
const muteBtn = document.getElementById("mute");
const tooltip = document.getElementById("progress-tooltip");

// Songs
const songs = [
  {
    name: "jacinto-1",
    displayName: "Someone Like You – Adele",
    artist: "AliYaSer Design",
  },
  {
    name: "jacinto-2",
    displayName: "Let Her Go – Passenger",
    artist: "AliYaSer Design",
  },
  {
    name: "jacinto-3",
    displayName: "Perfect – Ed Sheeran",
    artist: "AliYaSer Design",
  },
  {
    name: "jacinto-4",
    displayName: "A Sky Full of Stars – Coldplay",
    artist: "AliYaSer Design",
  },
];

// State
let isPlaying = false;
let songIndex = 0;
let isShuffle = false;
let isRepeat = false;
let lastVolume = music.volume;

// Play / Pause
function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
  document.querySelector(".img-container").classList.add("playing");
}
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
  document.querySelector(".img-container").classList.remove("playing");
}

// Load Song
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `/music/${song.name}.mp3`;
  image.src = `/img/${song.name}.jpg`;
}

// Next / Prev
function prevSong() {
  songIndex = isShuffle
    ? getShuffle()
    : (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}
function nextSong() {
  songIndex = isShuffle ? getShuffle() : (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}
function getShuffle() {
  let idx;
  do {
    idx = Math.floor(Math.random() * songs.length);
  } while (idx === songIndex && songs.length > 1);
  return idx;
}

// Shuffle / Repeat Toggle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#ff6a00" : "#fff";
});
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "#ff6a00" : "#fff";
});

// Progress
function updateProgress(e) {
  if (!isPlaying) return;
  const { duration, currentTime } = e.srcElement;
  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;

  const durMin = Math.floor(duration / 60);
  let durSec = Math.floor(duration % 60);
  durSec = durSec < 10 ? "0" + durSec : durSec;
  if (duration) durationEl.textContent = `${durMin}:${durSec}`;

  const curMin = Math.floor(currentTime / 60);
  let curSec = Math.floor(currentTime % 60);
  curSec = curSec < 10 ? "0" + curSec : curSec;
  currentTimeEl.textContent = `${curMin}:${curSec}`;
}
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
}

// Progress Tooltip
progressContainer.addEventListener("mousemove", (e) => {
  tooltip.style.display = "block";
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percent = offsetX / rect.width;
  const time = percent * music.duration;
  const min = Math.floor(time / 60);
  let sec = Math.floor(time % 60);
  if (sec < 10) sec = "0" + sec;
  tooltip.textContent = `${min}:${sec}`;
  tooltip.style.left = `${offsetX}px`;
});
progressContainer.addEventListener("mouseleave", () => {
  tooltip.style.display = "none";
});
progressContainer.addEventListener("click", setProgress);

// Volume Control + Tooltip
volumeSlider.addEventListener("input", (e) => {
  music.volume = e.target.value / 100;
  volumeTooltip.textContent = e.target.value + "%";
});

// Mute / Unmute
muteBtn.addEventListener("click", () => {
  if (music.volume > 0) {
    lastVolume = music.volume;
    music.volume = 0;
    volumeSlider.value = 0;
    muteBtn.classList.replace("fa-volume-up", "fa-volume-mute");
    volumeTooltip.textContent = "0%";
  } else {
    music.volume = lastVolume;
    volumeSlider.value = lastVolume * 100;
    muteBtn.classList.replace("fa-volume-mute", "fa-volume-up");
    volumeTooltip.textContent = Math.round(lastVolume * 100) + "%";
  }
});

// Event Listeners
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
music.addEventListener("timeupdate", updateProgress);
music.addEventListener("ended", () => (isRepeat ? playSong() : nextSong()));

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    playBtn.click();
  }
  if (e.code === "ArrowRight") nextBtn.click();
  if (e.code === "ArrowLeft") prevBtn.click();
});

// Initial Load
loadSong(songs[songIndex]);
music.volume = 0.8;
volumeSlider.value = 80;
volumeTooltip.textContent = "80%";
