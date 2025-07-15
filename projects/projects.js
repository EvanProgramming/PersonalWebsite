document.addEventListener('DOMContentLoaded', () => {
  // 菜单按钮和导航相关
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-btn');
  const fullscreenNav = document.getElementById('fullscreen-nav');
  const overlay = document.getElementById('overlay');

  menuBtn.addEventListener('click', () => {
    fullscreenNav.classList.add('active');
    overlay.classList.add('active');
    closeBtn.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    fullscreenNav.classList.remove('active');
    overlay.classList.remove('active');
    closeBtn.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
    fullscreenNav.classList.remove('active');
    overlay.classList.remove('active');
  });

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
