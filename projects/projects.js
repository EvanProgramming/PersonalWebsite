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

  // About overlays 激活逻辑
  const aboutSection = document.querySelector('.about');
  const aboutOverlay1 = document.querySelector('.aboutOverlay1');
  const aboutOverlay2 = document.querySelector('.aboutOverlay2');
  const aboutOverlay3 = document.querySelector('.aboutOverlay3');
  let aboutActivated = false;

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }

  // 3D 卡片高光与旋转交互
  const multiple = 15;
  const element = document.getElementById("element");
  const img = document.getElementById("g-img");
  if (!element || !img) return;

  function transformElement(x, y) {
    let box = element.getBoundingClientRect();
    const calcX = -(y - box.y - box.height / 2) / multiple;
    const calcY = (x - box.x - box.width / 2) / multiple;
    const percentage = Math.max(0, Math.min(100, ((x - box.x) / box.width) * 100));
    element.style.transform = "rotateX(" + calcX + "deg) " + "rotateY(" + calcY + "deg)";
    img.style.setProperty('--per', percentage + '%');
  }

  element.addEventListener("mousemove", (e) => {
    window.requestAnimationFrame(function () {
      transformElement(e.clientX, e.clientY);
    });
  });

  element.addEventListener("mouseleave", () => {
    window.requestAnimationFrame(function () {
      element.style.transform = "rotateX(0) rotateY(0)";
      img.style.setProperty('--per', '30%');
    });
  });
});
