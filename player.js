// Player handler module
// Handles first-person looking, WASD movement, sprinting, crouching, jumping, and potentially simple collisions

class Player {
  constructor() {
    this.camera = camera;

    this.camera.rotation.order = "YXZ";

    this.position = new THREE.Vector3(0, 1.7, 5);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.onGround = true;

    this.radius = 0.5;
    this.standHeight = 1.8;
    this.crouchHeight = 0.9;
    this.currentHeight = this.standHeight;

    this.walkSpeed = 8;
    this.sprintSpeed = 12;
    this.crouchSpeed = 4;
    this.jumpForce = 8;
    this.gravity = 24;

    this.yaw = 0;
    this.pitch = 0;
    this.sensitivity = 0.005;
  }

  rotateCamera(dx, dy) {
    this.yaw -= dx * this.sensitivity;
    this.pitch -= dy * this.sensitivity;

    // Clamp pitch
    const maxPitch = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    // In rotation, x is up and down, and y is left and right
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}