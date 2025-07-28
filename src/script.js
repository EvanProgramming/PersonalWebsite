
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


// ...existing code...


//Magnetic yoyo ball
// JIEJOE produce
    // b站主页：https://space.bilibili.com/3546390319860710
    const magnetic = {
        container: document.querySelector(".container"),
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        lines: 12, // Adjusted for better visibility Origin: 10
        rows: 12, // Adjusted for better visibility Origin: 10
        balls: [],
        mouse_radius: 100,
        init() {
            this.resize();
            this.create_yoyo(15);
            document.addEventListener("mousemove", (e) => {
                this.move_balls(e.x, e.y);
            })
        },
        resize() {
            this.width = this.container.getBoundingClientRect().width;
            this.height = this.container.getBoundingClientRect().height;
            this.left = this.container.getBoundingClientRect().left;
            this.top = this.container.getBoundingClientRect().top;
        },
        create_yoyo(radius) {
            for (let r = 0; r <= this.rows; r++) {
                for (let l = 0; l <= this.lines; l++) {
                    let x = this.width / this.lines * l;
                    let y = this.height / this.rows * r;
                    const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    ball.setAttribute("fill", "#00F0FF");
                    ball.setAttribute("cx", x);
                    ball.setAttribute("cy", y);
                    ball.setAttribute("r", radius);
                    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    point.setAttribute("fill", "#f7f7f7");
                    point.setAttribute("cx", x);
                    point.setAttribute("cy", y);
                    point.setAttribute("r", radius / 5);
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", x);
                    line.setAttribute("y1", y);
                    line.setAttribute("x2", x);
                    line.setAttribute("y2", y);
                    this.container.appendChild(line);
                    this.container.appendChild(point);
                    this.container.appendChild(ball);
                    ball.line = line;
                    ball.ori_x = x;
                    ball.ori_y = y;
                    this.balls.push(ball);
                };
            };
        },
        move_balls(x, y) {
            this.balls.forEach(ball => {
                const mouse_x = x - this.left;
                const mouse_y = y - this.top;
                const dx = ball.ori_x - mouse_x;
                const dy = ball.ori_y - mouse_y;
                const distance = Math.sqrt(dx ** 2 + dy ** 2);
                if (distance <= this.mouse_radius) {
                    ball.move_x = mouse_x + dx / distance * this.mouse_radius;
                    ball.move_y = mouse_y + dy / distance * this.mouse_radius;
                    if (ball.animater) ball.animater.kill();
                    ball.animater = gsap.timeline()
                        .to(ball, {
                            attr: {
                                cx: ball.move_x,
                                cy: ball.move_y,
                            },
                            duration: 0.5,
                            ease: "power3.out",
                        })
                        .to(ball.line, {
                            attr: {
                                x2: ball.move_x,
                                y2: ball.move_y,
                            },
                            duration: 0.5,
                            ease: "power3.out",
                        }, "<")
                        .to(ball, {
                            attr: {
                                cx: ball.ori_x,
                                cy: ball.ori_y,
                            },
                            duration: 1,
                            ease: "power3.out",
                        }, "<0.1")
                        .to(ball.line, {
                            attr: {
                                x2: ball.ori_x,
                                y2: ball.ori_y,
                            },
                            duration: 1,
                            ease: "power3.out",
                        }, "<");
                }
            });
        }
    };
    magnetic.init();