// --- 1. TAB CONTROLLER ---
function showTab(tabId) {
  // Hide every single panel layout
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.style.display = "none";
  });

  // Show the matching selected element
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.style.display = "block";
  }

  // Auto-refresh dynamic memory templates whenever opening lists
  if (tabId === "logShows") displayShows();
  if (tabId === "removeShow") displayShowsToDelete();
  if (tabId === "logMovies") displayMovies();
  if (tabId === "removeMovie") displayMoviesToDelete();
}

// --- 2. TV SHOWS STORAGE LOGIC ---
function saveShow() {
  const name = document.getElementById("showName").value;
  const season = document.getElementById("showSeason").value;
  const episode = document.getElementById("showEpisode").value;

  if (!name || !season || !episode) return alert("Please fill out all fields!");

  const shows = JSON.parse(localStorage.getItem("myShows")) || [];
  shows.push({ name, season, episode });
  localStorage.setItem("myShows", JSON.stringify(shows));

  // Clear inputs
  document.getElementById("showName").value = "";
  document.getElementById("showSeason").value = "";
  document.getElementById("showEpisode").value = "";

  showTab("shows");
}

function displayShows() {
  const showsList = document.getElementById("showsList");
  const shows = JSON.parse(localStorage.getItem("myShows")) || [];

  if (shows.length === 0) {
    showsList.innerHTML = "<p>No shows logged yet.</p>";
    return;
  }

  // Generates HTML buttons targeting both seasons and episodes
  showsList.innerHTML = shows
    .map(
      (show, index) => `
    <div class="media-card">
      <h3>${show.name}</h3>
      <p>Season: <strong>${show.season}</strong> | Episode: <strong>${show.episode}</strong></p>
      
      <!-- Control Triggers -->
      <button onclick="updateShowProgress(${index}, 'season', 1)">+1 Season</button>
      <button onclick="updateShowProgress(${index}, 'season', -1)">-1 Season</button>
      <button onclick="updateShowProgress(${index}, 'episode', 1)">+1 Ep</button>
      <button onclick="updateShowProgress(${index}, 'episode', -1)">-1 Ep</button>
    </div>
  `,
    )
    .join("");
}

function updateShowProgress(index, type, amount) {
  const shows = JSON.parse(localStorage.getItem("myShows"));
  const currentValue = parseInt(shows[index][type]) || 1;

  // Safe math bounds restriction checking
  shows[index][type] = Math.max(1, currentValue + amount);

  // When bumping a season up, automatically set episode counter baseline back to 1
  if (type === "season" && amount > 0) {
    shows[index]["episode"] = 1;
  }

  localStorage.setItem("myShows", JSON.stringify(shows));
  displayShows();
}

function displayShowsToDelete() {
  const container = document.getElementById("showsDeleteList");
  const shows = JSON.parse(localStorage.getItem("myShows")) || [];

  if (shows.length === 0) {
    container.innerHTML = "<p>No shows to remove.</p>";
    return;
  }

  container.innerHTML = shows
    .map(
      (show, index) => `
    <div class="delete-row media-card" style="display:flex; justify-content:space-between; align-items:center;">
      <span><strong>${show.name}</strong> (S${show.season}E${show.episode})</span>
      <button onclick="deleteShow(${index})">Delete</button>
    </div>
  `,
    )
    .join("");
}

function deleteShow(index) {
  const shows = JSON.parse(localStorage.getItem("myShows")) || [];
  shows.splice(index, 1);
  localStorage.setItem("myShows", JSON.stringify(shows));
  displayShowsToDelete();
}

// --- 3. MOVIES STORAGE LOGIC ---
function saveMovie() {
  const name = document.getElementById("movieName").value;
  const time = document.getElementById("movieTime").value;
  const date = document.getElementById("movieDate").value;

  if (!name || !time || !date) return alert("Please fill out all fields!");

  const movies = JSON.parse(localStorage.getItem("myMovies")) || [];
  movies.push({ name, time, date });
  localStorage.setItem("myMovies", JSON.stringify(movies));

  // Clear inputs
  document.getElementById("movieName").value = "";
  document.getElementById("movieTime").value = "";
  document.getElementById("movieDate").value = "";

  showTab("movies");
}

function displayMovies() {
  const moviesList = document.getElementById("moviesList");
  const movies = JSON.parse(localStorage.getItem("myMovies")) || [];

  if (movies.length === 0) {
    moviesList.innerHTML = "<p>No movies logged yet.</p>";
    return;
  }

  moviesList.innerHTML = movies
    .map(
      (movie) => `
    <div class="media-card">
      <h3>${movie.name}</h3>
      <p>Runtime duration: <strong>${movie.time}</strong></p>
      <p>Watched on: <strong>${movie.date}</strong></p>
    </div>
  `,
    )
    .join("");
}

function displayMoviesToDelete() {
  const container = document.getElementById("moviesDeleteList");
  const movies = JSON.parse(localStorage.getItem("myMovies")) || [];

  if (movies.length === 0) {
    container.innerHTML = "<p>No movies to remove.</p>";
    return;
  }

  container.innerHTML = movies
    .map(
      (movie, index) => `
    <div class="delete-row media-card" style="display:flex; justify-content:space-between; align-items:center;">
      <span><strong>${movie.name}</strong></span>
      <button onclick="deleteMovie(${index})">Delete</button>
    </div>
  `,
    )
    .join("");
}

function deleteMovie(index) {
  const movies = JSON.parse(localStorage.getItem("myMovies")) || [];
  movies.splice(index, 1);
  localStorage.setItem("myMovies", JSON.stringify(movies));
  displayMoviesToDelete();
}

// --- 4. ENGINE INITIALIZATION ---
showTab("homePage");
