// Elementos do DOM
const carousel = document.getElementById("carousel");
const dots = document.querySelectorAll(".dot");
const skipBtn = document.getElementById("skipBtn");

// Verifica se os elementos existem
if (!carousel || !dots.length || !skipBtn) {
  console.error("Erro: Elementos do DOM não encontrados. Verifique os IDs e classes.");
}

// Variáveis de controle
let currentSlide = 0;
let startX = 0;
let isSwiping = false;

// Verifica se o tutorial foi visto nas últimas 24 horas
const lastView = localStorage.getItem("tutorialView");
if (lastView && Date.now() - parseInt(lastView) < 24 * 60 * 60 * 1000) {
  window.location.href = "index.html";
}

// Atualiza o slide e os indicadores
function updateSlide() {
  if (!carousel) return;
  carousel.style.transition = "transform 0.3s ease";
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  skipBtn.style.display = currentSlide === dots.length - 1 ? "block" : "none";
  console.log(`Slide atual: ${currentSlide}`);
}

// Calcula o slide com base no swipe
function handleSwipeEnd(diff) {
  const threshold = carousel.offsetWidth * 0.3; // 30% da largura como threshold
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
function touchStartHandler(e) {
  if (!carousel) return;
  e.preventDefault();
  startX = e.touches[0].pageX;
  isSwiping = true;
  carousel.style.transition = "none";
  console.log("Touchstart: startX =", startX);
}

function touchMoveHandler(e) {
  if (!isSwiping || !carousel) return;
  e.preventDefault();
  const currentX = e.touches[0].pageX;
  const diff = startX - currentX;
  const translateX = -currentSlide * 100 - (diff / carousel.offsetWidth) * 100;
  carousel.style.transform = `translateX(${translateX}%)`;
  console.log("Touchmove: diff =", diff, "translateX =", translateX);
}

function touchEndHandler(e) {
  if (!isSwiping || !carousel) return;
  e.preventDefault();
  const endX = e.changedTouches[0].pageX;
  const diff = startX - endX;
  console.log("Touchend: diff =", diff, "currentSlide =", currentSlide);
  handleSwipeEnd(diff);
}

carousel?.addEventListener("touchstart", touchStartHandler, { passive: false });
carousel?.addEventListener("touchmove", touchMoveHandler, { passive: false });
carousel?.addEventListener("touchend", touchEndHandler, { passive: false });

// Eventos de mouse
function mouseDownHandler(e) {
  if (!carousel) return;
  e.preventDefault();
  startX = e.pageX;
  isSwiping = true;
  carousel.style.transition = "none";
  console.log("Mousedown: startX =", startX);
}

function mouseMoveHandler(e) {
  if (!isSwiping || !carousel) return;
  e.preventDefault();
  const currentX = e.pageX;
  const diff = startX - currentX;
  const translateX = -currentSlide * 100 - (diff / carousel.offsetWidth) * 100;
  carousel.style.transform = `translateX(${translateX}%)`;
  console.log("Mousemove: diff =", diff, "translateX =", translateX);
}

function mouseUpHandler(e) {
  if (!isSwiping || !carousel) return;
  e.preventDefault();
  const endX = e.pageX;
  const diff = startX - endX;
  console.log("Mouseup: diff =", diff, "currentSlide =", currentSlide);
  handleSwipeEnd(diff);
}

carousel?.addEventListener("mousedown", mouseDownHandler);
carousel?.addEventListener("mousemove", mouseMoveHandler);
carousel?.addEventListener("mouseup", mouseUpHandler);

carousel?.addEventListener("mouseleave", () => {
  if (isSwiping && carousel) {
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
skipBtn?.addEventListener("click", () => {
  localStorage.setItem("tutorialView", Date.now());
  window.location.href = "index.html";
  console.log("Skip button clicked");
});

// Inicializa
updateSlide();