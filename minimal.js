import "./mystral-shim.js";
import "./q5.js";
import "./utils.js";

let Canvas = initCanvas;

// ------

// await Canvas(1280, 720);
await Canvas();

background("#101820");
noStroke();

fill("#ff6b6b");
circle(0, 0, 80);