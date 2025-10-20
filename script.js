const nav = document.getElementById("navegation");
const menu = document.querySelector(".menu");
const overlay = document.getElementById("overlay");

let touchStartX = 0;
let currentX = 0;
let menuWidth = 300;
let isDragging = false;

// Abrir menu
function openMenu() {
  menu.classList.add("active");
  nav.classList.add("active");
  overlay.classList.add("active");
  menu.style.transform = "translateX(0)";
}

// Fechar menu
function closeMenu() {
  menu.classList.remove("active");
  nav.classList.remove("active");
  overlay.classList.remove("active");
  menu.style.transform = `translateX(-${menuWidth}px)`;
}

// Clique no hamburger
nav.addEventListener("click", () => {
  menu.classList.contains("active") ? closeMenu() : openMenu();
});

// Clique no overlay
overlay.addEventListener("click", () => closeMenu());

// Touch events para arrastar menu
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  isDragging = true;
  menu.style.transition = "none";
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
  let deltaX = currentX - touchStartX;
  let translateX = -menuWidth + deltaX;
  translateX = Math.min(0, Math.max(-menuWidth, translateX));
  menu.style.transform = `translateX(${translateX}px)`;
  overlay.style.opacity = 0.5 * (1 + translateX / menuWidth);
  overlay.style.pointerEvents = overlay.style.opacity > 0 ? "auto" : "none";
});

document.addEventListener("touchend", () => {
  isDragging = false;
  menu.style.transition = "transform 0.3s ease";
  const matrix = window.getComputedStyle(menu).transform;
  const matrixX = matrix !== "none" ? parseInt(matrix.split(",")[4]) : 0;
  matrixX > -menuWidth / 2 ? openMenu() : closeMenu();
});
