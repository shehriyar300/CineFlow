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