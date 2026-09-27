import "./mystral-shim.js";
import "./q5.js";
import "./utils.js";

let Canvas = initCanvas;
await Canvas(undefined, undefined, "webgpu");

let width = window.innerWidth;
let height = window.innerHeight;

let pg = createGraphics(256, 256);

q5.draw = function () {
  // 1. pg (2Dキャンバス) に毎フレーム描画
  pg.background(0, 100, 200); // 青背景
  pg.fill(255, 200, 0);       // 黄色い円
  pg.noStroke();
  let x = 128 + Math.cos(frameCount * 0.05) * 60;
  let y = 128 + Math.sin(frameCount * 0.05) * 60;
  pg.circle(x, y, 60);

  if (frameCount === 1) {
    let ctx = pg.drawingContext || pg.ctx;
    console.log("[test] ctx.fillStyle after background:", ctx.fillStyle);
    console.log("[test] pg._fill:", pg._fill);
    
    // pg.fill() と pg.rect() を呼んでみる
    pg.fill(255, 0, 0);
    console.log("[test] ctx.fillStyle after pg.fill(255, 0, 0):", ctx.fillStyle);
    pg.rect(0, 0, 50, 50);

    let imgData = ctx.getImageData(0, 0, 10, 10);
    console.log("[test] pixel after pg.rect (should be red):", Array.from(imgData.data.slice(0, 4)));
  }

  // 2. メインキャンバスをクリアして image() で表示
  background(30);
  imageMode(CENTER);
  image(pg, 0, 0, 256, 256);
};
