import * as squint_core from 'squint-cljs/core.js';
import '../mystral-shim.js';
import '../q5.js';
import '../utils.js';
var Canvas = initCanvas;
(await Canvas());
background("#101820");
noStroke();
fill("#ff6b6b");
circle(0, 0, 80);

export { Canvas }
