const carousel = document.getElementById("carousel");
const dots = document.querySelectorAll(".dot");
const skipBtn = document.getElementById("skipBtn");

let currentSlide = 0;
let startX = 0;
let isSwiping = false;

// Verifica se o tutorial foi visto nas últimas 24 horas
//const lastView = localStorage.getItem("tutorialView");
//if (lastView && (Date.now() - parseInt(lastView) < 24 * 60 * 60 * 1000)) {
 // window.location.href = "index.html";
//}

// Atualiza slide e indicadores
function updateSlide() {
  carousel.style.transition = "transform 0.3s ease"; // Reativa a transição
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  skipBtn.style.display = currentSlide === dots.length - 1 ? "block" : "none";
  console.log(`Slide atual: ${currentSlide}`); // Depuração
}

// Swipe touch
carousel.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Impede comportamento padrão
  startX = e.touches[0].clientX;
  isSwiping = true;
  carousel.style.transition = "none"; // Desativa transição durante o arrastar
  console.log("Touchstart: startX =", startX); // Depuração
});

carousel.addEventListener("touchmove", (e) => {
  if (!isSwiping) return;
  e.preventDefault(); // Impede comportamento padrão
  const currentX = e.touches[0].clientX;
  const diff = startX - currentX;
  const translateX = -currentSlide * 100 - (diff / carousel.offsetWidth) * 100;
  carousel.style.transform = `translateX(${translateX}%)`; // Movimento suave
  console.log("Touchmove: diff =", diff, "translateX =", translateX); // Depuração
});

carousel.addEventListener("touchend", (e) => {
  if (!isSwiping) return;
  e.preventDefault(); // Impede comportamento padrão
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  console.log("Touchend: diff =", diff, "currentSlide =", currentSlide); // Depuração
  if (diff > 20 && currentSlide < dots.length - 1) {
    currentSlide++; // Avança (arrastar da direita para a esquerda)
    if (currentSlide === dots.length - 1) {
      localStorage.setItem("tutorialView", Date.now()); // Salva timestamp no último slide
    }
  } else if (diff < -20 && currentSlide > 0) {
    currentSlide--; // Retrocede (arrastar da esquerda para a direita)
  }
  updateSlide();
  isSwiping = false;
});

// Swipe mouse (desktop)
carousel.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Impede seleção de texto
  startX = e.clientX;
  isSwiping = true;
  carousel.style.transition = "none"; // Desativa transição durante o arrastar
  console.log("Mousedown: startX =", startX); // Depuração
});

carousel.addEventListener("mousemove", (e) => {
  if (!isSwiping) return;
  e.preventDefault(); // Impede seleção de texto
  const currentX = e.clientX;
  const diff = startX - currentX;
  const translateX = -currentSlide * 100 - (diff / carousel.offsetWidth) * 100;
  carousel.style.transform = `translateX(${translateX}%)`; // Movimento suave
  console.log("Mousemove: diff =", diff, "translateX =", translateX); // Depuração
});

carousel.addEventListener("mouseup", (e) => {
  if (!isSwiping) return;
  e.preventDefault(); // Impede seleção de texto
  const endX = e.clientX;
  const diff = startX - endX;
  console.log("Mouseup: diff =", diff, "currentSlide =", currentSlide); // Depuração
  if (diff > 20 && currentSlide < dots.length - 1) {
    currentSlide++; // Avança (arrastar da direita para a esquerda)
    if (currentSlide === dots.length - 1) {
      localStorage.setItem("tutorialView", Date.now()); // Salva timestamp no último slide
    }
  } else if (diff < -20 && currentSlide > 0) {
    currentSlide--; // Retrocede (arrastar da esquerda para a direita)
  }
  updateSlide();
  isSwiping = false;
});

carousel.addEventListener("mouseleave", () => {
  if (isSwiping) {
    updateSlide(); // Garante o "snap" ao sair
    isSwiping = false;
    console.log("Mouseleave: Slide atual =", currentSlide); // Depuração
  }
});

// Clique nas dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    if (currentSlide === dots.length - 1) {
      localStorage.setItem("tutorialView", Date.now()); // Salva timestamp no último slide
    }
    updateSlide();
    console.log("Dot clicked: Slide =", currentSlide); // Depuração
  });
});

// Botão Pular (aparece só no último slide)
skipBtn.addEventListener("click", () => {
  localStorage.setItem("tutorialView", Date.now()); // Salva timestamp ao pular
  window.location.href = "index.html";
  console.log("Skip button clicked"); // Depuração
});

// Inicializa
updateSlide();