document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-btn');
  const fullscreenNav = document.getElementById('fullscreen-nav');
  const overlay = document.getElementById('overlay');
  // 修改为 class 选择器，支持多个 nav-link
  const navlinks = document.querySelectorAll('.nav-link');
  

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
    navlinks.forEach(link => link.classList.add('active'));
  });

  closeBtn.addEventListener('click', () => {
    fullscreenNav.classList.remove('active');
    overlay.classList.remove('active');
    closeBtn.classList.remove('active');
    navlinks.forEach(link => link.classList.remove('active'));
  });

  // 可选：点击遮罩也关闭导航
  overlay.addEventListener('click', () => {
    fullscreenNav.classList.remove('active');
    overlay.classList.remove('active');
  });

  // 让所有按钮在两个blue-overlay动画完成后淡入
  const heroBtns = document.querySelectorAll('.hero .glass-btn');

  let overlay1Done = false;
  let overlay2Done = false;

  function tryShowBtns() {
    if (overlay1Done && overlay2Done && heroBtns.length) {
      heroBtns.forEach(btn => btn.classList.add('show'));
    }
  }

  if (blueOverlay1) {
    blueOverlay1.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'right' || e.propertyName === 'transform') {
        overlay1Done = true;
        tryShowBtns();
      }
    });
  }
  if (blueOverlay2) {
    blueOverlay2.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'right' || e.propertyName === 'transform') {
        overlay2Done = true;
        tryShowBtns();
      }
    });
  }

  // 若页面已激活（刷新后动画已完成），直接显示按钮
  if (blueOverlay1 && blueOverlay1.classList.contains('active') &&
      blueOverlay2 && blueOverlay2.classList.contains('active')) {
    overlay1Done = true;
    overlay2Done = true;
    tryShowBtns();
  }

  // 动态高光随鼠标移动
  heroBtns.forEach(glassBtn => {
    const highlight = glassBtn.querySelector('.highlight');
    glassBtn.addEventListener('mousemove', (e) => {
      const rect = glassBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      highlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 60%, transparent 100%)`;
    });
    glassBtn.addEventListener('mouseleave', () => {
      highlight.style.background = '';
    });
  });

  // 页面滚动进度条
  const progressBar = document.getElementById('scroll-progress-bar');
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  }
  window.addEventListener('scroll', updateScrollProgress);
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();
});