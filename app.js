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
let currentPage = 1;
const getMovies = (index) => {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&page=${index}`
  )
    .then((response) => response.json())
    .then((data) => {
      generatePagination(currentPage, data.total_pages);
      data.results.forEach((element) => {
        let movie = document.createElement("div");
        movie.classList.add("movie");
        movie.innerHTML = `<a href="#movie">
              <img class="movie_image" src="${
                element.poster_path
                  ? "https://image.tmdb.org/t/p/w500" + element.poster_path
                  : "images/placeholder.png"
              }" alt="" />
              <h4 class="movie_title" > ${
                element.title.length > 15
                  ? element.title.slice(0, 15) + "..."
                  : element.title
              }</h4>
              <h5 class="movie_info">
                <i><img src="images/star.png" alt=""><p>${element.vote_average
                  .toString()
                  .slice(0, 3)}</p></i>
                <p>${
                  element.release_date
                    ? element.release_date.split("-")[0]
                    : "N/A"
                }</p>
              </h5>
            </a>`;
        movies.appendChild(movie);
      });
    });
};
const paginationEl = document.querySelector(".pagination");
const generatePagination = (j, totalPages) => {
  movies.innerHTML = "";
  paginationEl.innerHTML = "";
  let start = j - 3 > 0 ? j - 3 : 1;
  let end = j + 3 < totalPages ? j + 3 : totalPages;
  for (let i = start; i <= end; i++) {
    let paginationItem = document.createElement("li");
    paginationItem.classList.add("pagination_item");
    if (i === j) {
      paginationItem.classList.add("active");
    }
    paginationItem.textContent = i;
    paginationItem.addEventListener("click", () => {
      currentPage = i;
      getMovies(i);
    });
    paginationEl.appendChild(paginationItem);
  }
};
getMovies(currentPage);

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

let sliderAddEl = document.querySelector(".slider_add");
let nowPlayingMovies = document.createElement("div");
nowPlayingMovies.classList.add("swiper-slide");
sliderAddEl.prepend(nowPlayingMovies);

// fetch(
//   `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${api_key}`
// )
//   .then((response) => response.json())
//   .then((data) => {
//     data.results.forEach((element) => {
//       console.log(element);

//       nowPlayingMovies.innerHTML += `

//         <a href="">
//                   <div bgcolor="teal" class="main_slider_background">
//                     <div class="main_slider_text">
//                       <h1>${element.title}</h1>
//                       <div>
//                         <p>${element.release_date}</p>
//                         <pre>${element.genre_ids.map(id => data.genres.find(g => g.id === id).name).join(', ')}</pre>
//                         <p>${element.overview.slice(0, 150)}...</p>
//                         <p>imdb: ${element.vote_average}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </a>`;
//     });
//   });

document.addEventListener("DOMContentLoaded", function () {
  let sliderAddEl = document.querySelector(".slider_add");
  if (!sliderAddEl) {
    console.error("Hata: .slider_add elementi bulunamadı!");
    return;
  }

  let genreList = {}; // Film türlerini tutacak nesne

  // İlk olarak film türlerini al
  fetch(
    `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${api_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.genres.forEach((genre) => {
        genreList[genre.id] = genre.name;
      });

      // Şimdi "Now Playing" filmlerini al
      return fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2&api_key=${api_key}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        let movieGenres = element.genre_ids
          .map((id) => genreList[id] || "Bilinmiyor")
          .join(", ");

        let nowPlayingMovies = document.createElement("div");
        nowPlayingMovies.classList.add("swiper-slide");

        nowPlayingMovies.innerHTML = `
          <a href="#">
            <div class="main_slider_background">
             <img src="https://image.tmdb.org/t/p/w1280/${
               element.backdrop_path
             }" alt="" />
              <div class="main_slider_text">
                <h1>${element.title}</h1>
                <div>
                  <p>${element.release_date.toString().split("-").join(",")}</p>
                  <pre>IMDB: ${element.vote_average
                    .toString()
                    .slice(0, 3)}</pre>
                  <p>${movieGenres}</p>
                  </div>
                  <p>${element.overview.slice(0, 150)}...</p>
              </div>
            </div>
          </a>`;

        sliderAddEl.prepend(nowPlayingMovies); // Yeni film ekle
      });

      // **Swiper'ı yeniden başlat veya güncelle**
      let swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      swiper.update(); // **Swiper güncelleniyor**
    })
    .catch((error) => console.error("API Hatası:", error));
});

fetch(
  `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=2a3c21f7203959050cb73bdefd2b2ae2`
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.results);
    data.results.forEach((a)=>{
      console.log(a.title);
 let addMostWatcher=document.querySelector(".add_most_watcher")
 if (addMostWatcher) {
   let mostWatcher=document.createElement("div");
   mostWatcher.classList.add("swiper-slide");
   mostWatcher.innerHTML+=`<a href="#movie">
            <img class="movie_image" src="${
              a.poster_path
                ? "https://image.tmdb.org/t/p/w500" + a.poster_path
                : "images/placeholder.png"
            }" alt="" />
            <h4 class="movie_title" > ${
              a.title.length > 15
                ? a.title.slice(0, 15) + "..."
                : a.title
            }</h4>
            <h5 class="movie_info">
              <i><img src="images/star.png" alt=""><p>${a.vote_average
                .toString()
                .slice(0, 3)}</p></i>
              <p>${
                a.release_date
                  ? a.release_date.split("-")[0]
                  : "N/A"
              }</p>
            </h5>
          </a>`
   addMostWatcher.appendChild(mostWatcher);
 }
          })
  });
