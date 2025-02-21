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

// fetch(
//   `https://api.themoviedb.org/3/genre/movie/list?language=${lang}&api_key=${api_key}`
// )
//   .then((response) => response.json())
//   .then((data) => {
//     data.genres.forEach((element) => {
//       let genreLi = document.createElement("li");
//       genreLi.classList.add("genre_li");
//       genreLi.innerHTML = `<a href="#">${capitalizeFirstLetter(
//         element.name
//       )}</a>`;
//       genreLi.dataset.genreId = element.id; // Janr ID'sini kaydediyoruz
//       genreLi.addEventListener("click", () => {
//         document.querySelector(
//           ".genre_movies_title"
//         ).innerHTML = `${capitalizeFirstLetter(element.name)}`;
//         getMoviesByGenre(element.id); // Tıklanınca filmleri getir
//       });
//       genreUl.appendChild(genreLi);
//     });
//   });
document.querySelector(".genre_generation").style.display = "none";const getMoviesByGenre = (genreId, page = 1) => {
  document.querySelector(".detail_movie").style.display = "none";
  document.querySelector(".swiper").style.display = "none";
  
  // Yeni içerik geldiğinde eski içerikleri temizle
  let genre_generation = document.querySelector(".genre_generation");
  genre_generation.innerHTML = ""; // Bu satır, içerik sıfırlama işlevi görür

  fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=${lang}&api_key=${api_key}&with_genres=${genreId}&page=${page}`
  )
    .then((response) => response.json())
    .then((data) => {
      generatePagination(page, data.total_pages, genreId); // Pagination'ı güncelle
      data.results.forEach((element) => {
        let movie = document.createElement("div");
        movie.classList.add("movie");
        movie.innerHTML = `<a target="_blank" href="detail.html?id=${
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
            <i><img src="../images/star.png" alt=""><p>${element.vote_average
              .toString()
              .slice(0, 3)}</p></i>
            <p>${
              element.release_date ? element.release_date.split("-")[0] : "N/A"
            }</p>
          </h5>
        </a>`;

        genre_generation.appendChild(movie);
      });
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
};


const generatePagination = (currentPage, totalPages, genreId) => {
  let paginationEl = document.querySelector(".pagination"); // Pagination elementi
  paginationEl.innerHTML = ""; // Önceki sayfalamayı temizle

  const createPaginationItem = (page, text, isDisabled = false) => {
    let paginationItem = document.createElement("li");
    paginationItem.classList.add("pagination_item");

    // Eğer buton devre dışıysa, bu durumda "disabled" class'ı ekleniyor
    if (isDisabled) {
      paginationItem.classList.add("disabled");
    } else {
      paginationItem.addEventListener("click", () => {
        if (genreId) {
          getMoviesByGenre(genreId, page); // Janra göre film çekme
        } else {
          getMovies(page); // Sadece filmleri çekme
        }
      });
    }

    // Eğer sayfa şu anki seçili sayfa ise, aktif sınıfı ekleniyor
    if (page === currentPage) {
      paginationItem.classList.add("active");
    }

    paginationItem.textContent = text;
    paginationEl.appendChild(paginationItem);
  };

  // ⬅️ İlk sayfa butonu
  createPaginationItem(1, "İlk Sayfa", currentPage === 1);


  // Sayfa numaraları (Maksimum 5 gösterilecek)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    createPaginationItem(i, i);
  }



  // 📌 "Daha çox" butonu (Eğer 5+ sayfa varsa)
  if (endPage < totalPages) {
    createPaginationItem(currentPage + 5, ">5");
  }

  // ➡️ Son sayfa butonu
  createPaginationItem(totalPages, "Son Sayfa", currentPage === totalPages);
};


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
        // document.querySelector(
        //   ".genre_generation_title"
        // ).innerHTML = `${element.name}`;
        document.querySelector(".genre_generation").style.display = "grid";

        getMoviesByGenre(element.id); // Tıklanınca filmleri getir
      });
      genreUl.appendChild(genreLi);
    });
  })
  .catch((error) => console.error("Error fetching genres:", error));

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

let genreIds = [];
fetch(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=${lang}`
)
  .then((response) => response.json())
  .then((data) => {
    genreIds.push(data.genres[0].id); // Using the movie's ID instead of genre IDs

    console.log("Selected Movie ID:", genreIds);

    fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=falselanguage=${lang}&api_key=2a3c21f7203959050cb73bdefd2b2ae2&with_genres=${genreIds}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Movies with the same genre:", data);

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
                  a.title.length > 10 ? a.title.slice(0, 10) + "..." : a.title
                }</h4>
                <h5 class="most_watcher_info">
                  <i><img src="../images/star.png" alt=""><p>${a.vote_average
                    .toString()
                    .slice(0, 3)}</p></i>
                  <p>${
                    a.release_date ? a.release_date.split("-")[0] : "N/A"
                  }</p>
                </h5>
              </a>`;

          addAlsoMovie.appendChild(mostWatcher);
        });
      });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
