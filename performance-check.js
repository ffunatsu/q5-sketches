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

// ==================
//   p5.js
// ==================

// function setup() {
//   createCanvas(1280, 720);
// }
//
// function draw() {
//   background(0);
//   fill(255);
//   noStroke();
//
//   for (var i = 0; i < 5000; i++) {
//     rect(random(width), random(height), 10, 10);  
//   }
//
//   fill(0, 255, 255);
//   text("fps: " + round(frameRate(), 2), 10, 10);
// }
//
// function mousePressed() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     let fs = fullscreen();
//     fullscreen(!fs);
//   }
// }

// ==================
//   openFrameworks
// ==================

// void ofApp::draw(){
//     ofBackground(0);
//     ofSetColor(255);
//     ofFill();
//
//     for (int i = 0; i < 20000; i++) {
//       ofDrawRectangle(ofRandom(ofGetWidth()), ofRandom(ofGetHeight()), 10, 10);
//     }
//
//     ofSetColor(0, 255, 255);
//     ofDrawBitmapStringHighlight("fps: " + ofToString(ofGetFrameRate(), 2), 10, 10);
//
// }
//
// void ofApp::mousePressed(int x, int y, int button){
//     ofToggleFullscreen();
// }