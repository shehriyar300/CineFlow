let movies = document.querySelector(".movies");
let genreUl = document.querySelector(".genre_ul");
let moviesContainer = document.querySelector(".movies"); // Film kartlarını ekleyeceğimiz ana div
const api_key = "2a3c21f7203959050cb73bdefd2b2ae2";
const totalPages = 1;

let lang = "tr";
let ulLangs = document.querySelector(".language");
let liLang = document.createElement("li");
liLang.innerHTML = ` <li><button data-lang="tr">Turkish</button></li>
  <li><button data-lang="en-US">English</button></li>
  <li><button data-lang="ru">Russian</button></li>`;
ulLangs.appendChild(liLang);

document.querySelectorAll(".language button").forEach((button) => {
  button.addEventListener("click", (e) => {
    lang = e.target.getAttribute("data-lang");

    localStorage.setItem("selectedLang", lang);
    location.reload();
  });
});

const savedLang = localStorage.getItem("selectedLang");
if (savedLang) {
  lang = savedLang;
}
if (lang == "en-US") {
  document.querySelector(".genre h1").innerHTML = "Genres";
  document.querySelector(".search__input").placeholder = "Search any movies...";
  watchNow = "Watch Now";
} else if (lang == "tr") {
  document.querySelector(".genre h1").innerHTML = "Türler";
  document.querySelector(".search__input").placeholder =
    "Herhangi bir filmi ara...";
  watchNow = "Şimdi izle";
} else {
  document.querySelector(".genre h1").innerHTML = "Жанры";
  document.querySelector(".search__input").placeholder = "Найти любой фильм...";
  document.querySelector(".logo p").innerHTML = "СинеФлоу";
  watchNow = "Смотреть сейчас";
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

fetch(
  `https://api.themoviedb.org/3/genre/movie/list?language=${lang}&api_key=${api_key}`
)
  .then((response) => response.json())
  .then((data) => {
    data.genres.forEach((element) => {
      let genreLi = document.createElement("li");
      genreLi.classList.add("genre_li");
      genreLi.innerHTML = `<a href="#">${capitalizeFirstLetter(
        element.name
      )}</a>`;
      genreLi.dataset.genreId = element.id; // Janr ID'sini kaydediyoruz
      genreLi.addEventListener("click", () => {
        document.querySelector(
          ".genre_movies_title"
        ).innerHTML = `${capitalizeFirstLetter(element.name)}`;
        getMoviesByGenre(element.id); // Tıklanınca filmleri getir
      });
      genreUl.appendChild(genreLi);
    });
  });

const searchMovie = (q) => {
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=${lang}&page=1&query=${q}&api_key=${api_key}`;
  const options = { method: "GET", headers: { accept: "application/json" } };
  const resultsDiv = document.querySelector(".search__result");
  resultsDiv.innerHTML = "";

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((element) => {
        resultsDiv.innerHTML += `
            <a target="_blank" href="../DetailPage/detail.html?id=${element.id}">
              <li>
                <img class="search_img" src="https://image.tmdb.org/t/p/w780/${element.poster_path}" />
                <p class="search_title">${element.title}</p>
              </li>
            </a>`;
        console.log(element.title, element.id, element.poster_path);
      });
    })
    .catch((error) => console.error("Error fetching movies:", error));
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
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=${lang}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector(
        ".detail_movie"
      ).style.backgroundImage = `linear-gradient(rgba(15, 12, 54, 0.69), rgba(5, 3, 17, 0.93)), url("https://image.tmdb.org/t/p/w1280/${data.backdrop_path}")`;
      document.title = `${data.title} || Film izlə`;
      document.querySelector(".detail_movie").innerHTML += `
        <img src="https://image.tmdb.org/t/p/w780/${data.poster_path}" alt="" />
        <div class="detail_movie_info">
          <h1>${data.title}</h1>
          <div class="detail_movie_imdb">
            <i>⭐<span>${data.vote_average.toFixed(1)}</span></i>
            <p>${data.runtime} min</p>
            <p>${`${data.release_date}`.split("-")[0]}</p>
          </div>
          <div class="detail_genre">${data.genres
            .map((genre) => capitalizeFirstLetter(genre.name))
            .join(" , ")}</div>
          <div class="movie_about">
            <div>${data.overview}</div>
            <div>${data.production_companies
              .map((a) => capitalizeFirstLetter(a.name))
              .join(" , ")}</div>
          </div>
        </div>
      `;
    })
    .catch((error) => console.error("Error fetching movie details:", error));
} else {
  document.querySelector(".movie_detail").innerHTML = "<p>Movie not found.</p>";
}

document.addEventListener("click", (event) => {
  let searchBox = document.querySelector(".search__result");
  let searchInput = document.querySelector(".search__input");

  if (!searchBox.contains(event.target) && event.target !== searchInput) {
    searchBox.innerHTML = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector(".search__result").innerHTML = "";
    document.querySelector(".search__result").value = "";
  }
});

// fetch(
//   `https://api.themoviedb.org/3/movie/top_rated?&language=${lang}&page=1&api_key=2a3c21f7203959050cb73bdefd2b2ae2`
// )
//   .then((response) => response.json())
//   .then((data) => {
//     data.results.forEach((a) => {
//       let addAlsoMovie = document.querySelector(".add_also_movie");

//       let mostWatcher = document.createElement("div");
//       mostWatcher.classList.add("swiper-slide");

//       mostWatcher.innerHTML += `<a target="_blank"  href="../DetailPage/detail.html?id=${
//         a.id
//       }">
//             <img class="most_watcher_image" src="${
//               a.poster_path
//                 ? "https://image.tmdb.org/t/p/w500" + a.poster_path
//                 : "images/placeholder.png"
//             }" alt="" />
//             <h4 class="most_watcher_title" > ${
//               a.title.length > 15 ? a.title.slice(0, 15) + "..." : a.title
//             }</h4>
//             <h5 class="most_watcher_info">
//               <i><img src="../images/star.png" alt=""><p>${a.vote_average
//                 .toString()
//                 .slice(0, 3)}</p></i>
//               <p>${a.release_date ? a.release_date.split("-")[0] : "N/A"}</p>
//             </h5>

//           </a>`;

//           addAlsoMovie.appendChild(mostWatcher);
//     });
//   });

// Assuming genreIds is an array like [28, 35, 18] for Action, Comedy, Drama
let genreIds = [];
fetch(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=${lang}`
)
  .then((response) => response.json())
  .then((data) => {
    // Modify genreIds to just hold the current movie ID
    genreIds.push(data.genres[0].id); // Using the movie's ID instead of genre IDs

    console.log('Selected Movie ID:', genreIds);

    // Fetch top-rated movies based on the selected movie's ID (genreIds will now hold the movie ID)
    fetch(
      `https://api.themoviedb.org/3/discover/movie?language=${lang}&api_key=2a3c21f7203959050cb73bdefd2b2ae2&with_genres=${genreIds}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Movies with the same genre:', data);

        // Loop through the fetched movies and display them
        data.results.forEach((a) => {
          let addAlsoMovie = document.querySelector(".add_also_movie");

          let mostWatcher = document.createElement("div");
          mostWatcher.classList.add("swiper-slide");

          mostWatcher.innerHTML += `<a target="_blank"  href="../DetailPage/detail.html?id=${
            a.id
          }">
                <img class="most_watcher_image" src="${
                  a.poster_path
                    ? "https://image.tmdb.org/t/p/w500" + a.poster_path
                    : "images/placeholder.png"
                }" alt="" />
                <h4 class="most_watcher_title" > ${
                  a.title.length > 15 ? a.title.slice(0, 15) + "..." : a.title
                }</h4>
                <h5 class="most_watcher_info">
                  <i><img src="../images/star.png" alt=""><p>${a.vote_average
                    .toString()
                    .slice(0, 3)}</p></i>
                  <p>${a.release_date ? a.release_date.split("-")[0] : "N/A"}</p>
                </h5>
              </a>`;

          addAlsoMovie.appendChild(mostWatcher);
        });
      });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
