const carousel = document.getElementById("carousel");
const dots = document.querySelectorAll(".dot");
const skipBtn = document.getElementById("skipBtn");

let currentSlide = 0;
let startX = 0;
let isSwiping = false;

// Verifica se o tutorial foi visto nas últimas 24 horas
const lastView = localStorage.getItem("tutorialView");
if (lastView && (Date.now() - parseInt(lastView) < 24 * 60 * 60 * 1000)) {
  window.location.href = "index.html";
}

// Atualiza slide e indicadores
function updateSlide() {
  carousel.style.transition = "transform 0.3s ease";
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  skipBtn.style.display = currentSlide === dots.length - 1 ? "block" : "none";
  console.log(`Slide atual: ${currentSlide}`);
}

// Função para calcular o slide com base no swipe
function handleSwipeEnd(diff) {
  const threshold = carousel.offsetWidth * 0.2; // 20% da largura do carrossel como threshold
  if (diff > threshold && currentSlide < dots.length - 1) {
    currentSlide++; // Avança
    if (currentSlide === dots.length - 1) {
      localStorage.setItem("tutorialView", Date.now());
    }
  } else if (diff < -threshold && currentSlide > 0) {
    currentSlide--; // Retrocede
  }
  updateSlide();
  isSwiping = false;
}

// Eventos de touch
carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
  carousel.style.transition = "none"; // Desativa transição durante o arrastar
  console.log("Touchstart: startX =", startX);
});

carousel.addEventListener("touchmove", (e) => {
  if (!isSwiping) return;
  const currentX = e.touches[0].clientX;
  const diff = startX - currentX;
  const translateX = -currentSlide * 100 - (diff / carousel.offsetWidth) * 100;
  carousel.style.transform = `translateX(${translateX}%)`;
  console.log("Touchmove: diff =", diff, "translateX =", translateX);
});

carousel.addEventListener("touchend", (e) => {
  if (!isSwiping) return;
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  console.log("Touchend: diff =", diff, "currentSlide =", currentSlide);
  handleSwipeEnd(diff);
});

// Eventos de mouse (desktop)
carousel.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Impede seleção de texto
  startX = e.clientX;
  isSwiping = true;
  carousel.style.transition = "none";
  console.log("Mousedown: startX =", startX);
});

carousel.addEventListener("mousemove", (e) => {
  if (!isSwiping) return;
  e.preventDefault();
  const currentX = e.clientX;
  const diff = startX - currentX;
  const translateX = -currentSlide * 100 - (diff / carousel.offsetWidth) * 100;
  carousel.style.transform = `translateX(${translateX}%)`;
  console.log("Mousemove: diff =", diff, "translateX =", translateX);
});

carousel.addEventListener("mouseup", (e) => {
  if (!isSwiping) return;
  e.preventDefault();
  const endX = e.clientX;
  const diff = startX - endX;
  console.log("Mouseup: diff =", diff, "currentSlide =", currentSlide);
  handleSwipeEnd(diff);
});

carousel.addEventListener("mouseleave", () => {
  if (isSwiping) {
    updateSlide();
    isSwiping = false;
    console.log("Mouseleave: Slide atual =", currentSlide);
  }
});

// Clique nas dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    if (currentSlide === dots.length - 1) {
      localStorage.setItem("tutorialView", Date.now());
    }
    updateSlide();
    console.log("Dot clicked: Slide =", currentSlide);
  });
});

// Botão Pular
skipBtn.addEventListener("click", () => {
  localStorage.setItem("tutorialView", Date.now());
  window.location.href = "index.html";
  console.log("Skip button clicked");
});

// Inicializa
updateSlide();