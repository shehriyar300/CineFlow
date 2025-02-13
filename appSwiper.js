const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");
var swiper = new Swiper(".mySwiper", {
  spaceBetween: 10,
  centeredSlides: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    autoplayTimeLeft(s, time, progress) {
      progressCircle?.style?.setProperty("--progress", 1 - progress);
      if (!progressContent) return;
      progressContent.textContent = `${Math.ceil(time / 1000)}s`;
    },
  },
});

var swiper = new Swiper(".mySwiper_most_watched", {
  slidesPerView: 6,
  spaceBetween: 10,
  freeMode: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});



