
// 悬停时让其他导航按钮模糊
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        document.querySelectorAll('.nav-link').forEach(other => {
            if (other !== link) {
                other.classList.add('blurred');
            }
        });
    });
    link.addEventListener('mouseleave', () => {
        document.querySelectorAll('.nav-link').forEach(other => {
            other.classList.remove('blurred');
        });
    });
});

const lenis = new Lenis()
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
//document.querySelector('body').appendChild(SplashCursor())

// 动态导航动画控制
const dynamicNav = document.querySelector('.dynamic-nav');
if (dynamicNav) {
    dynamicNav.addEventListener('mouseenter', () => {
        dynamicNav.classList.remove('shrink-anim');
    });
    dynamicNav.addEventListener('mouseleave', () => {
        dynamicNav.classList.add('shrink-anim');
        // 动画结束后移除类，避免反复触发
        dynamicNav.addEventListener('animationend', function handler() {
            dynamicNav.classList.remove('shrink-anim');
            dynamicNav.removeEventListener('animationend', handler);
        });
    });
}
