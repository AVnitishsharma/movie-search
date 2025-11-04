const APIURL ="https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI ="https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const movieBox = document.querySelector('.movie-box');

//get movies

let currentPage = 1;
let isLoading = false;

async function getMovies(url, append = false) {
  if (isLoading) return; // agar pehle se loading ho rhi hai to return kar do
  isLoading = true;

  const resp = await fetch(url);
  const data = await resp.json();
  showMovies(data.results, append);

  isLoading = false;
} 

//show movies in page
const showMovies = (data, append = false) => {
  if (!append)movieBox.innerHTML = "";
  // clear the movie box
  data.forEach(
    (itam) => {
      const box = document.createElement('div');
      box.classList.add('box');
      box.innerHTML = `
      <img src="${IMGPATH + itam.poster_path}" alt="${itam.title}">
      <div class="overlay">
        <div class="title">
          <h3>${itam.title}</h3>
          <h4 class="rating">${itam.vote_average}</h4>
        </div>
        <div class="info">
          <h4>Overview</h4>
          <p>${itam.overview}</p>
        </div>
      </div>`;

      // 👇 Jab user box pe click kare, trailer chale
      box.addEventListener("click", () => {
        getTrailer(itam.id);
      });
      movieBox.appendChild(box);
    }
  )
}

//search bar
document.querySelector('#search').addEventListener(
  "keyup",
  function (event) {
    if (event.target.value !== '') {
      getMovies(SEARCHAPI + event.target.value);
      //surch movie
    } else {
      getMovies(APIURL);
      //display popular movies
    }
  }
);

// Get trailer from TMDB
async function getTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=04c35731a5ee918f014970082a0088b1`;
  const resp = await fetch(url);
  const data = await resp.json();

  if (data.results.length > 0) {
    const youtubeKey = data.results[0].key;
    const trailerUrl = `https://www.youtube.com/embed/${youtubeKey}`;

    // Show popup
    document.getElementById("popup").style.display = "flex";
    document.getElementById("trailerFrame").src = trailerUrl;
  } else {
    alert("Trailer not available 😢");
  }
}

// Close popup
document.getElementById("closeBtn").addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
  document.getElementById("trailerFrame").src = ""; // Stop video
});

// Infinite scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    // almost end me aa gaye
    currentPage++;
    getMovies(`${APIURL}&page=${currentPage}`, true);
  }
});

// Get initial movies
getMovies(APIURL);
