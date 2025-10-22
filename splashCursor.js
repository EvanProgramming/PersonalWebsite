// 原生标准 JavaScript fluid splash cursor
// 获取 WebGL 上下文的标准实现
function getWebGLContext(canvas) {
    const params = { alpha: true, premultipliedAlpha: false };
    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    if (!gl) alert('WebGL not supported');
    let ext = {
        formatRGBA: isWebGL2 ? gl.RGBA8 : gl.RGBA,
        supportLinearFiltering: isWebGL2 || !!gl.getExtension('OES_texture_float_linear')
    };
    return { gl, ext };
}
// 配置参数（可根据需要修改）
const SIM_RESOLUTION = 128;
const DYE_RESOLUTION = 1440;
const CAPTURE_RESOLUTION = 512;
const DENSITY_DISSIPATION = 3.5;
const VELOCITY_DISSIPATION = 2;
const PRESSURE = 0.1;
const PRESSURE_ITERATIONS = 20;
const CURL = 3;
const SPLAT_RADIUS = 0.2;
const SPLAT_FORCE = 6000;
const SHADING = true;
const COLOR_UPDATE_SPEED = 10;
const BACK_COLOR = { r: 0.5, g: 0, b: 0 };
const TRANSPARENT = true;

// 创建并插入 canvas 到页面
const fluidDiv = document.createElement('div');
fluidDiv.style.position = 'fixed';
fluidDiv.style.top = '0';
fluidDiv.style.left = '0';
fluidDiv.style.zIndex = '50';
fluidDiv.style.pointerEvents = 'none';
fluidDiv.style.width = '100%';
fluidDiv.style.height = '100%';
document.body.appendChild(fluidDiv);

const canvas = document.createElement('canvas');
canvas.id = 'fluid';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.display = 'block';
fluidDiv.appendChild(canvas);

// fluid splash cursor 主逻辑
(function () {
  function pointerPrototype() {
    this.id = -1;
    this.texcoordX = 0;
    this.texcoordY = 0;
    this.prevTexcoordX = 0;
    this.prevTexcoordY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.down = false;
    this.moved = false;
    this.color = [0, 0, 0];
  }

  let config = {
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    PAUSED: false,
    BACK_COLOR,
    TRANSPARENT,
  };

  let pointers = [new pointerPrototype()];

  const { gl, ext } = getWebGLContext(canvas);
  if (!ext.supportLinearFiltering) {
    config.DYE_RESOLUTION = 256;
    config.SHADING = false;
  }
  // ...existing code...

  // 其余代码保持原样，全部在 IIFE 内部运行
  // ...existing code...

  // 事件绑定全部改为标准 JS
  window.addEventListener('mousedown', (e) => {
    let pointer = pointers[0];
    let posX = scaleByPixelRatio(e.clientX);
    let posY = scaleByPixelRatio(e.clientY);
    updatePointerDownData(pointer, -1, posX, posY);
    clickSplat(pointer);
  });

  document.body.addEventListener('mousemove', function handleFirstMouseMove(e) {
    let pointer = pointers[0];
    let posX = scaleByPixelRatio(e.clientX);
    let posY = scaleByPixelRatio(e.clientY);
    let color = generateColor();
    updateFrame();
    updatePointerMoveData(pointer, posX, posY, color);
    document.body.removeEventListener('mousemove', handleFirstMouseMove);
  });

  window.addEventListener('mousemove', (e) => {
    let pointer = pointers[0];
    let posX = scaleByPixelRatio(e.clientX);
    let posY = scaleByPixelRatio(e.clientY);
    let color = pointer.color;
    updatePointerMoveData(pointer, posX, posY, color);
  });

  document.body.addEventListener('touchstart', function handleFirstTouchStart(e) {
    const touches = e.targetTouches;
    let pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      let posX = scaleByPixelRatio(touches[i].clientX);
      let posY = scaleByPixelRatio(touches[i].clientY);
      updateFrame();
      updatePointerDownData(pointer, touches[i].identifier, posX, posY);
    }
    document.body.removeEventListener('touchstart', handleFirstTouchStart);
  });

  window.addEventListener('touchstart', (e) => {
    const touches = e.targetTouches;
    let pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      let posX = scaleByPixelRatio(touches[i].clientX);
      let posY = scaleByPixelRatio(touches[i].clientY);
      updatePointerDownData(pointer, touches[i].identifier, posX, posY);
    }
  });

  window.addEventListener(
    'touchmove',
    (e) => {
      const touches = e.targetTouches;
      let pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        let posX = scaleByPixelRatio(touches[i].clientX);
        let posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
    },
    false
  );

  window.addEventListener('touchend', (e) => {
    const touches = e.changedTouches;
    let pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      updatePointerUpData(pointer);
    }
  });

  updateFrame();
})();
