import "./mystral-shim.js";
import "./q5.js";
import "./utils.js";

let Canvas = initCanvas;

// ------

// await Canvas(1280, 720);
await Canvas();

let width = window.innerWidth;
let height = window.innerHeight;

const N = 5000;
const S = 5;

q5.draw = function() {
  background(0);
  fill(255);
  noStroke();
  
  for (let i = 0; i < N; i++) {
    rect(random(width) - width/2, random(height) - height/2, S, S);  
  }
  
  fill('blue');
  text("fps: " + round(frameRate(), 2), 50, 50);
};