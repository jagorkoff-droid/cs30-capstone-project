// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let scene;
let camera;
let renderer;

async function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '1');
  cnv.style('pointer-events', 'none');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(windowWidth, windowHeight);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;
}

function draw() {
  renderer.render(scene, camera);
}