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

    // Object that tracks which keys are currently being held down
    this.keys = {};
    this.createControls();
  }

  createControls() {
    // Listens for any key press and marks its key code
    window.addEventListener("keydown", (event) => {
      this.keys[event.code] = true;
    });

    // Listens for any key release and marks its key code as false to stop movement
    window.addEventListener("keyup", (event) => {
      this.keys[event.code] = false;
    });

    // Clicking anywhere on the webpage will lock the cursor to the centre of the screen to ensure it does not leave the window
    document.addEventListener("click", () => {
      if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
      }
    });

    // Only rotates the camera when the mouse is locked, movementX and movementY measure how many pixels the mouse has moved since the previous frame
    document.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement === document.body) {
        this.rotateCamera(event.movementX, event.movementY);
      }
    });
  }

  rotateCamera(dx, dy) {
    this.yaw -= dx * this.sensitivity;
    this.pitch -= dy * this.sensitivity;

    // Clamp pitch
    const maxPitch = PI / 2 - 0.05;
    this.pitch = max(-maxPitch, min(maxPitch, this.pitch));

    // In rotation, x is up and down, and y is left and right
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  update(deltaTime, colliders) {
    // Checks if left ctrl or c is held down
    const isCrouching = this.keys["ControlLeft"] || this.keys["KeyC"];
    const targetHeight = isCrouching ? this.crouchHeight : this.standHeight;
    const previousHeight = this.currentHeight;
    // Smoothly blends currentHeight toward targetHeight rather than snapping instantly
    this.currentHeight = lerp(this.currentHeight, targetHeight, min(1, deltaTime * 15));

    // Keeps the player's feet planted on the floor while their camera lowers or rises
    if (this.onGround) {
      this.position.y += this.currentHeight - previousHeight;
    }

    // Controls movement speeds
    let speed = this.walkSpeed;
    if (isCrouching) {
      speed = this.crouchSpeed;
    }
    else if (this.keys["ShiftLeft"] && this.keys["KeyW"]) {
      speed = this.sprintSpeed;
    }

    // Finds which way is forward and right in a 3D space
    // To stop a player from flying into the sky or walking into the floor, y is 0
    const forward = new THREE.Vector3(-sin(this.yaw), 0, -cos(this.yaw));
    const right = new THREE.Vector3(cos(this.yaw), 0, -sin(this.yaw));
    const moveDirection = new THREE.Vector3(0, 0, 0);

    // Adds or suntracts the forward and right vectors
    if (this.keys["KeyW"]) {
      moveDirection.add(forward);
    }
    if (this.keys["KeyS"]) {
      moveDirection.sub(forward);
    }
    if (this.keys["KeyD"]) {
      moveDirection.add(right);
    }
    if (this.keys["KeyA"]) {
      moveDirection.sub(right);
    }

    // Shrinks the combined vector length back to one unit vector ensuring holding two keys does not increase speed
    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize();
    }

    // Multiples current unit direction by current speed to set horizontal velocity
    this.velocity.x = moveDirection.x * speed;
    this.velocity.z = moveDirection.z * speed;

    // Jump
    if (this.keys["Space"] && this.onGround) {
      this.velocity.y = this.jumpForce;
      this.onGround = false;
    }

    // Apply gravity
    this.velocity.y -= this.gravity * deltaTime;

    // Moves and checks collisions one axis at a time, allowing a player to glide over walls rather than getting stuck on corners
    this.position.x += this.velocity.x * deltaTime;
    this.resolveCollisions(colliders, "x");

    this.position.z += this.velocity.z * deltaTime;
    this.resolveCollisions(colliders, "z");

    this.position.y += this.velocity.y * deltaTime;
    this.resolveCollisions(colliders, "y");

    // Keep on floor
    if (this.position.y <= this.currentHeight) {
      this.position.y = this.currentHeight;
      this.velocity.y = 0;
      this.onGround = true;
    }

    // Copies the player's updated 3D coordinates directly onto the Three.js camera
    this.camera.position.copy(this.position);
  }

  resolveCollisions(colliders, axis) {
    // Builds an invisible AABB around the player from feet to eyes
    const hitBox = new THREE.Box3(new THREE.Vector3(this.position.x - this.radius, this.position.y - this.currentHeight, this.position.z - this.radius), new THREE.Vector3(this.position.x + this.radius, this.position.y, this.position.z + this.radius));

    for (let object of colliders) {
      // Builds an invisble bounding box matching the edges of the 3D object
      const objectBox = new THREE.Box3().setFromObject(object);

      // Checks if the player's box overlaps with the objects's
      if (hitBox.intersectsBox(objectBox)) {
        if (axis === "x") {
          if (this.velocity.x > 0) {
            // Moving right into obstacle: snap player to left edge
            this.position.x = objectBox.min.x - this.radius;
          }
          // Moving left into obstacle: snap player to right edge
          if (this.velocity.x < 0) {
            this.position.x = objectBox.max.x + this.radius;
          }
          this.velocity.x = 0;
        }
        else if (axis === "z") {
          // Moving backward into obstacle: snap player to back edge
          if (this.velocity.z > 0) {
            this.position.z = objectBox.min.z - this.radius;
          }
          // Moving forward into obstacle: snap player to front edge
          if (this.velocity.z < 0) {
            this.position.z = objectBox.max.z + this.radius;
          }
          this.velocity.z = 0;
        }
        else if (axis === "y") {
          // Hit ceiling: stop upward momentum
          if (this.velocity.y > 0) {
            this.position.y = objectBox.min.y;
          }
          // Falling onto obstacle: land on top
          else if (this.velocity.y < 0) {
            this.position.y = objectBox.max.y + this.currentHeight;
            this.onGround = true;
          }
          this.velocity.y = 0;
        }
      }
    }
  }
}