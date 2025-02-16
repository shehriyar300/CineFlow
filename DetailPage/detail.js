let movies = document.querySelector(".movies");
let genreUl = document.querySelector(".genre_ul");
let moviesContainer = document.querySelector(".movies"); // Film kartlarını ekleyeceğimiz ana div
const api_key = "2a3c21f7203959050cb73bdefd2b2ae2";
const totalPages = 1;

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
  .then((response) => response.json())
  .then((data) => {
    data.genres.forEach((element) => {
      let genreLi = document.createElement("li");
      genreLi.classList.add("genre_li");
      genreLi.innerHTML = `<a href="#${element.name}">${element.name}</a>`;
      genreUl.appendChild(genreLi);
    });
  });

const searchMovie = (q) => {
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=az-AZ&page=1&query=${q}&api_key=${api_key}`;
  const options = { method: "GET", headers: { accept: "application/json" } };
  const resultsDiv = document.querySelector(".search__result");
  resultsDiv.innerHTML = "";
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((element) => {
        resultsDiv.innerHTML += `<li>
          <img src="https://image.tmdb.org/t/p/w500/${element.poster_path}"/>
          <p>${element.title}</p>
          </li>`;
      });
    });
};
let searchTimeout = null;
document.querySelector(".search__input").addEventListener("input", (e) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    searchMovie(e.target.value);
  }, 300);
});

// URL-dən ID-ni götürmək
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams);

const movieId = urlParams.get("id");
console.log(movieId);

if (movieId) {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=en-US`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector(
        ".detail_movie"
      ).style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)), url("https://image.tmdb.org/t/p/w780/${data.backdrop_path}")`;

      document.querySelector(".detail_movie").innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="" />
        <div class="detail_movie_info">
          <h1>${data.title}</h1>
          <div class="detail_movie_imdb">
            <i>⭐<span>${data.vote_average.toFixed(1)}</span></i>
            <p>${data.runtime} min</p>
            <p>${`${data.release_date}`.split("-")[0]}</p>
          </div>
          <div class="detail_genre">${data.genres
            .map((genre) => genre.name)
            .join(" , ")}</div>
          <div class="movie_about">
            <div>${data.overview}</div>
            <div>${data.production_companies
              .map((a) => a.name)
              .join(" , ")}</div>
          </div>
        </div>
      `;
    })
    .catch((error) => console.error("Error fetching movie details:", error));
} else {
  document.querySelector(".movie_detail").innerHTML = "<p>Movie not found.</p>";
}
