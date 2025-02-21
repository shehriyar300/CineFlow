document.addEventListener("DOMContentLoaded", function () {
  const progressCircle = document.querySelector(".autoplay-progress svg");
  const progressContent = document.querySelector(".autoplay-progress span");

  var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      autoplayTimeLeft(s, time, progress) {
        if (progressCircle) {
          progressCircle.style.setProperty("--progress", 1 - progress);
        }
        if (progressContent) {
          progressContent.textContent = `${Math.ceil(time / 1000)}s`;
        }
      },
    },
  });

  // **Çözüm: Swiper'i yeniden başlat**
  setTimeout(() => {
    swiper.update(); // Swiper'ı güncelle
    swiper.autoplay.start(); // Autoplay'i başlat
  }, 100);
});

var swiper = new Swiper(".mySwiper_most_watched", {
  slidesPerView: 6, // Default olaraq 6 slayd göstərir
  spaceBetween: 10,
  freeMode: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    320: {  // Mobil (320px və yuxarı)
      slidesPerView: 1,
      spaceBetween: 5,
    },
    480: {  // Kiçik planşetlər (480px və yuxarı)
      slidesPerView: 2,
      spaceBetween: 10,
    },
    768: {  // Böyük planşetlər (768px və yuxarı)
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1024: { // Kiçik desktoplar (1024px və yuxarı)
      slidesPerView: 3,
      spaceBetween: 15,
    },
    1280: { // Böyük ekranlar (1280px və yuxarı)
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1440: { // Extra böyük ekranlar (1440px və yuxarı)
      slidesPerView: 6,
      spaceBetween: 20,
    }
  }
});

