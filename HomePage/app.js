let movies = document.querySelector(".movies");
let genreUl = document.querySelector(".genre_ul");
let moviesContainer = document.querySelector(".movies");
const api_key = "2a3c21f7203959050cb73bdefd2b2ae2";

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
let watchNow = "";
console.log(lang);
if (lang == "en-US") {
  document.querySelector(".most_h1").innerHTML = "Most Watched";
  document.querySelector(".imdb_h1").innerHTML = "Highest IMDb Rated";
  document.querySelector(".upcomming_h1").innerHTML = "Upcoming Movies";
  document.querySelector(".genre_movies_title").innerHTML = "Movies";
  document.querySelector(".genre h1").innerHTML = "Genres";
  document.querySelector(".search__input").placeholder = "Search any movies...";
  watchNow = "Watch Now";
} else if (lang == "tr") {
  document.querySelector(".most_h1").innerHTML = "En Çok İzlenenler";
  document.querySelector(".imdb_h1").innerHTML = "En Yüksek IMDb Puanlı";
  document.querySelector(".upcomming_h1").innerHTML = "Gelecek Filmler";
  document.querySelector(".genre_movies_title").innerHTML = "Filmler";
  document.querySelector(".genre h1").innerHTML = "Türler";
  document.querySelector(".search__input").placeholder =
    "Herhangi bir filmi ara...";
  watchNow = "Şimdi izle";
} else {
  document.querySelector(".most_h1").innerHTML = "Самые популярные";
  document.querySelector(".imdb_h1").innerHTML = "Самые высокие рейтинги IMDb";
  document.querySelector(".upcomming_h1").innerHTML = "Предстоящие фильмы";
  document.querySelector(".genre_movies_title").innerHTML = "фильмы";
  document.querySelector(".genre h1").innerHTML = "Жанры";
  document.querySelector(".search__input").placeholder = "Найти любой фильм...";
  watchNow = "Смотреть сейчас";
}
let movie = document.createElement("div");
movie.classList.add("movie");
let currentPage = 1;
const getMovies = (index) => {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?language=${lang}&page=1&api_key=${api_key}&page=${index}`
  )
    .then((response) => response.json())
    .then((data) => {
      generatePagination(currentPage, data.total_pages);
      data.results.forEach((element) => {
        let movie = document.createElement("div");
        movie.classList.add("movie");
        movie.innerHTML = `<a target="_blank" href="DetailPage/detail.html?id=${
          element.id
        }">
  <img class="movie_image" src="${
    element.poster_path
      ? "https://image.tmdb.org/t/p/w500" + element.poster_path
      : "images/placeholder.png"
  }" alt="" />
  <h4 class="movie_title">${
    element.title.length > 15
      ? element.title.slice(0, 15) + "..."
      : element.title
  }</h4>
  <h5 class="movie_info">
    <i><img src="images/star.png" alt=""><p>${element.vote_average
      .toString()
      .slice(0, 3)}</p></i>
    <p>${element.release_date ? element.release_date.split("-")[0] : "N/A"}</p>
  </h5>
</a>`;

        movies.appendChild(movie);
      });
    });
};
const paginationEl = document.querySelector(".pagination");

const generatePagination = (j, totalPages, genreId) => {
  movies.innerHTML = "";

  let paginationEl = document.querySelector(".pagination"); // Pagination elementi
  paginationEl.innerHTML = ""; // Yeni pagination oluşturuluyor

  let paginationItem;
  const createPaginationItem = (i, text) => {
    paginationItem = document.createElement("li");
    paginationItem.classList.add("pagination_item");

    if (i === j) {
      paginationItem.classList.add("active");
    }
    paginationItem.textContent = text;

    paginationItem.addEventListener("click", () => {
      currentPage = i;

      if (genreId) {
        getMoviesByGenre(genreId, currentPage);
      } else {
        getMovies(currentPage);
      }
    });

    paginationEl.appendChild(paginationItem);
  };

  createPaginationItem(1, 1); // İlk sayfa

  if (j - 3 > 2) {
    const dots = document.createElement("li");
    dots.classList.add("pagination_item");
    dots.textContent = "...";
    paginationEl.appendChild(dots);
  }

  let start = j - 3 > 1 ? j - 3 : 2;
  let end = j + 3 < totalPages ? j + 3 : totalPages - 1;

  for (let i = start; i <= end; i++) {
    createPaginationItem(i, i);
  }

  if (j + 3 < totalPages - 1) {
    const dots = document.createElement("li");
    dots.classList.add("pagination_item");
    dots.textContent = "...";
    paginationEl.appendChild(dots);
  }

  createPaginationItem((totalPages = 500), (totalPages = 500)); // Son sayfa
};

getMovies(currentPage);

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
          <a target="_blank" href="DetailPage/detail.html?id=${element.id}">
            <li>
              <img class="search_img" src="https://image.tmdb.org/t/p/w500/${element.poster_path}" />
              <p class="search_title">${element.title}</p>
            </li>
          </a>`;
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

let sliderAddEl = document.querySelector(".slider_add");
let nowPlayingMovies = document.createElement("div");
nowPlayingMovies.classList.add("swiper-slide");
sliderAddEl.prepend(nowPlayingMovies);

document.addEventListener("DOMContentLoaded", function () {
  let sliderAddEl = document.querySelector(".slider_add");
  if (!sliderAddEl) {
    console.error("Hata: .slider_add elementi bulunamadı!");
    return;
  }

  let genreList = {};

  fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=${lang}&api_key=${api_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.genres.forEach((genre) => {
        genreList[genre.id] = genre.name;
      });

      return fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=${lang}&page=1&api_key=${api_key}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      // Exclude the last movie by using slice
      const moviesToDisplay = data.results.slice(0, -1); // Remove the last movie

      moviesToDisplay.forEach((element) => {
        let movieGenres = element.genre_ids
          .map((id) => genreList[id] || "Bilinmiyor")
          .join(", ");

        let nowPlayingMovies = document.createElement("div");
        nowPlayingMovies.classList.add("swiper-slide");

        nowPlayingMovies.innerHTML = `
          <a target="_blank"  href="DetailPage/detail.html?id=${element.id}">
            <div class="main_slider_background">
             <img src="https://image.tmdb.org/t/p/w1280/${
               element.backdrop_path
             }" alt="" />
              <div class="main_slider_text">
                <h1>${element.title}</h1>
                <div>
                  <p>${element.release_date.toString().split("-").join(",")}</p>
                  <pre>${element.vote_average.toString().slice(0, 3)}</pre>
                  <p>${movieGenres}</p>
                </div>
                <p>${element.overview.slice(0, 150)}...</p>
                <button class="btn"><i class="fa-regular fa-circle-play"></i>${watchNow}</button>
              </div>
            </div>
          </a>`;
        sliderAddEl.prepend(nowPlayingMovies); // Add the movie to the slider
      });

      // Initialize or update Swiper
      let swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      swiper.update(); // Update the Swiper instance
    })
    .catch((error) => console.error("API Hatası:", error));
});

fetch(
  `https://api.themoviedb.org/3/movie/popular?language=${lang}&page=1&api_key=2a3c21f7203959050cb73bdefd2b2ae2`
)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((a) => {
      let addMostWatcher = document.querySelector(".add_most_watcher");

      let mostWatcher = document.createElement("div");
      mostWatcher.classList.add("swiper-slide");
      mostWatcher.classList.add("most_watcher_slide");

      mostWatcher.innerHTML += `<a target="_blank"  href="DetailPage/detail.html?id=${
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
              <i><img src="images/star.png" alt=""><p>${a.vote_average
                .toString()
                .slice(0, 3)}</p></i>
              <p>${a.release_date ? a.release_date.split("-")[0] : "N/A"}</p>
            </h5>
            
          </a>`;

      addMostWatcher.appendChild(mostWatcher);
    });
  });

fetch(
  `https://api.themoviedb.org/3/movie/top_rated?&language=${lang}&page=1&api_key=2a3c21f7203959050cb73bdefd2b2ae2`
)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((a) => {
      let addImdb = document.querySelector(".add_imdb");

      let mostWatcher = document.createElement("div");
      mostWatcher.classList.add("swiper-slide");
      mostWatcher.classList.add("most_watcher_slide");

      mostWatcher.innerHTML += `<a target="_blank"  href="DetailPage/detail.html?id=${
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
              <i><img src="images/star.png" alt=""><p>${a.vote_average
                .toString()
                .slice(0, 3)}</p></i>
              <p>${a.release_date ? a.release_date.split("-")[0] : "N/A"}</p>
            </h5>
            
          </a>`;

      addImdb.appendChild(mostWatcher);
    });
  });
fetch(
  `https://api.themoviedb.org/3/movie/upcoming?language=${lang}&page=9&api_key=2a3c21f7203959050cb73bdefd2b2ae2`
)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((a) => {
      let add_upcomming = document.querySelector(".add_upcomming");

      let mostWatcher = document.createElement("div");
      mostWatcher.classList.add("swiper-slide");
      mostWatcher.classList.add("most_watcher_slide");

      mostWatcher.innerHTML += `<a target="_blank"  href="DetailPage/detail.html?id=${
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
              <i><img src="images/star.png" alt=""><p>${a.vote_average
                .toString()
                .slice(0, 3)}</p></i>
              <p>${a.release_date ? a.release_date.split("-")[0] : "N/A"}</p>
            </h5>
            
          </a>`;
      add_upcomming.appendChild(mostWatcher);
    });
  });

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

const getMoviesByGenre = (genreId, page = 1) => {
  movies.innerHTML = "";
  document.querySelector(".slider_add").style.display = "none";
  document.querySelector(".swiper").style.display = "none";
  document.querySelector(".genres_movies").style.display = "none";

  fetch(
    `https://api.themoviedb.org/3/discover/movie?language=${lang}&api_key=${api_key}&with_genres=${genreId}&page=${page}`
  )
    .then((response) => response.json())
    .then((data) => {
      generatePagination(page, data.total_pages, genreId); // Pagination'ı güncelle
      data.results.forEach((element) => {
        let movie = document.createElement("div");
        movie.classList.add("movie");
        movie.innerHTML = `<a target="_blank" href="DetailPage/detail.html?id=${
          element.id
        }">
        <img class="movie_image" src="${
          element.poster_path
            ? "https://image.tmdb.org/t/p/w500" + element.poster_path
            : "images/placeholder.png"
        }" alt="" />
        <h4 class="movie_title">${
          element.title.length > 15
            ? element.title.slice(0, 15) + "..."
            : element.title
        }</h4>
        <h5 class="movie_info">
          <i><img src="images/star.png" alt=""><p>${element.vote_average
            .toString()
            .slice(0, 3)}</p></i>
          <p>${
            element.release_date ? element.release_date.split("-")[0] : "N/A"
          }</p>
        </h5>
      </a>`;

        movies.appendChild(movie);
      });
    })
    .catch((error) => console.error("Error fetching movies by genre:", error));
};

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
        ).innerHTML = `${element.name}`;
        getMoviesByGenre(element.id); // Tıklanınca filmleri getir
      });
      genreUl.appendChild(genreLi);
    });
  })
  .catch((error) => console.error("Error fetching genres:", error));
