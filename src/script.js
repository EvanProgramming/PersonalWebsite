
// ...existing code...

// 动态背景点阵与鼠标交互
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const POINTS_NUM = 140;
const POINT_RADIUS = 3;
const ACTIVE_RADIUS = 80;
let points = [];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

for (let i = 0; i < POINTS_NUM; i++) {
    // 随机分配颜色
    const color = Math.random() < 0.5 ? '255,255,255' : '0,240,255';
    points.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        baseR: POINT_RADIUS,
        color: color,
    });
}

let mouse = { x: -1000, y: -1000 };
canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    // 可选：重新分布点
    points.forEach(p => {
        p.x = randomBetween(0, width);
        p.y = randomBetween(0, height);
    });
});

function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let p of points) {
        let dist = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        let r = p.baseR;
        let alpha = 0;
        let shadow = 0;
        if (dist < ACTIVE_RADIUS) {
            // 距离越近，透明度越高，半径越大
            alpha = 0.3 + 0.7 * (1 - dist / ACTIVE_RADIUS);
            r = p.baseR + 4 * (1 - dist / ACTIVE_RADIUS);
            shadow = 12 * (1 - dist / ACTIVE_RADIUS);
        }
        // 只有在alpha大于阈值时才绘制
        if (alpha > 0.05) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${alpha})`;
            ctx.shadowColor = `rgba(${p.color},${alpha})`;
            ctx.shadowBlur = shadow;
            ctx.fill();
            ctx.closePath();
        }
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
}
draw();

// ...existing code...
