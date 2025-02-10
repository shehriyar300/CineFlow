// const totalPages = 6;
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

let movie = document.createElement("div");
movie.classList.add("movie");
movie.innerHTML = ""
for (let index = 1; index <= 5; index++) {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&page=${index}`
  )
    .then((response) => response.json())
    .then((data) => {
      
      data.results.forEach((element) => {
        let movie = document.createElement("div");
        movie.classList.add("movie");
        movie.innerHTML = `<a href="#movie">
              <img class="movie_image" src="${  
                element.poster_path ? "https://image.tmdb.org/t/p/w500" + element.poster_path : "images/placeholder.png"
              }" alt="" />
              <h4 class="movie_title" > ${
                element.title
              }</h4>
              <h5 class="movie_info">
                <i><img src="images/star.png" alt=""><p>${
                  element.vote_average.toString().slice(0, 3)
                }</p></i>
                <p>${
                  element.release_date ? element.release_date.split('-')[0] : "N/A"
                }</p>
              </h5>
            </a>`;
        movies.appendChild(movie);
      });
    });
}

