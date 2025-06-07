document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-btn');
  const fullscreenNav = document.getElementById('fullscreen-nav');
  const overlay = document.getElementById('overlay');
  const navlink = document.getElementById('nav-link');
  

  // Add active class to overlays on page load
  const blueOverlay1 = document.querySelector('.blue-overlay');
  const blueOverlay2 = document.querySelector('.blue-overlay2');
  const whiteOverlay = document.querySelector('.white-overlay');
  const hero = document.querySelector('.hero');
  const heroWord1 = document.querySelector('.word1');
  const heroWord2 = document.querySelector('.word2');
  const heroWord3 = document.querySelector('.word3');
  if (blueOverlay1) blueOverlay1.classList.add('active');
  if (blueOverlay2) blueOverlay2.classList.add('active');
  if (whiteOverlay) whiteOverlay.classList.add('active');
  if (hero) hero.classList.add('active');
  if (heroWord1) heroWord1.classList.add('active');
  if (heroWord2) heroWord2.classList.add('active');
  if (heroWord3) heroWord3.classList.add('active');

  menuBtn.addEventListener('click', () => {
    fullscreenNav.classList.add('active');
    overlay.classList.add('active');
    closeBtn.classList.add('active');
    navlink.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    fullscreenNav.classList.remove('active');
    overlay.classList.remove('active');
    closeBtn.classList.remove('active');
    navlink.classList.remove('active');
  });

  // 可选：点击遮罩也关闭导航
  overlay.addEventListener('click', () => {
    fullscreenNav.classList.remove('active');
    overlay.classList.remove('active');
  });
});