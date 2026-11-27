// CS30 Final Project
// James Gorkoff and Narayan Thibodeau
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

import {Player} from "./player.js";

let gui;
let scene;
let playerCamera;
let renderer;
let player;
let colliders = [];

async function setup() {
  // p5.js

  gui = createCanvas(windowWidth, windowHeight);
  // Pins the top-left corner of the p5.js canvas to the exact top-left corner of the window
  gui.position(0, 0);
  // Sets the CSS stacking order so the p5.js GUI always sits on top of the Three.js 3D canvas
  gui.style('z-index', '1');
  // Makes the p5.js canvas invisible to clicks, making you start in the Three.js gameplay mode
  gui.style('pointer-events', 'none');


  // Three.js

  // 3D world container
  scene = new THREE.Scene();
  // Player camera, FOV = 75 degrees, aspect ratio is set to ensure 3D image is not stretched, nothing closer than 0.1 units will render (near clipping), nothing farther than 1000 units will render (far clipping)
  playerCamera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
  // 3D graphics engine, antialiasing smooths out jagged edges on 3D shapes
  renderer = new THREE.WebGLRenderer({antialias: true});
  // Makes Three.js 3D canvas fill entire browser window
  renderer.setSize(windowWidth, windowHeight);
  // Attaches the Three.js canvas onto the HTML webpage so you are actually able to see it
  document.body.appendChild(renderer.domElement);
  // Moves the cameras 5 units backward along the z-axis, ensuring it is not stuck at the centre (0, 0, 0) of the world
  playerCamera.position.z = 5;

  // Light
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(10, 20, 10);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  // Ground
  const groundPlane = new THREE.PlaneGeometry(100, 100, 64, 64);
  groundPlane.rotateX(-PI/2);
  const groundTexture = new THREE.MeshStandardMaterial({color: "#90929E"});
  const ground = new THREE.Mesh(groundPlane, groundTexture);
  scene.add(ground);

  // Player
  player = new Player(playerCamera);
}

function draw() {
  player.update(deltaTime / 1000, colliders);

  // Takes a snapshot of what the camera currently sees in the scene and draws it onto the screen
  renderer.render(scene, playerCamera);
}

window.setup = setup;
window.draw = draw;