'use strict';

import * as THREE from 'three';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';


export class Box extends THREE.Object3D {
  constructor(width, height, depth, thickness) {
    super();

    // Create materials
    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.3,
      roughness: 0.4,
    });
    material.side = THREE.DoubleSide;

    // Create the bottom face
    const bottomGeometry = new THREE.BoxGeometry(width, thickness, depth);
    const bottom = new THREE.Mesh(bottomGeometry, material);
    bottom.position.y = thickness / 2;
    this.add(bottom);

    // Create the front face
    const frontGeometry = new THREE.BoxGeometry(width, height, thickness);
    const front = new THREE.Mesh(frontGeometry, material);
    front.position.y = height / 2;
    front.position.z = depth / 2;
    this.add(front);

    // Create the back face
    const backGeometry = new THREE.BoxGeometry(width, height, thickness);
    const back = new THREE.Mesh(backGeometry, material);
    back.position.y = height / 2;
    back.position.z = -depth / 2;
    this.add(back);

    // Create the left face
    const leftGeometry = new THREE.BoxGeometry(thickness, height, depth);
    const left = new THREE.Mesh(leftGeometry, material);
    left.position.y = height / 2;
    left.position.x = -width / 2;
    this.add(left);

    // Create the right face
    const rightGeometry = new THREE.BoxGeometry(thickness, height, depth);
    const right = new THREE.Mesh(rightGeometry, material);
    right.position.y = height / 2;
    right.position.x = width / 2;
    this.add(right);

    // Add axes helper for debugging
    this.add(new THREE.AxesHelper(10));
  }
}

export class Shelf extends THREE.Object3D {
  constructor(shelfWidth, shelfHeight, shelfDepth, boxWidth, boxHeight, boxDepth, boxThickness) {
    super();

    // Create materials
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,  // Brown color for shelves
      metalness: 0.2,
      roughness: 0.6,
    });
    shelfMaterial.side = THREE.DoubleSide;

    // Calculate shelf dimensions
    const levelHeight = shelfHeight / 3;
    const levelDepth = shelfDepth;
    const levelThickness = 10; // Thickness of the shelf surface

    // Amount of shelf in each station
    const shelfUnits = 3

    // Create three levels with same inclination
    for (let i = 0; i < shelfUnits; i++) {
      // Create a group for each level
      const level = new THREE.Group();

      // Create the shelf surface
      const shelfGeometry = new THREE.BoxGeometry(shelfWidth, levelThickness, shelfDepth * 2);
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);

      // Position the shelf
      shelf.position.y = 0.5 * i * levelHeight;

      const boxUnits = 2;
      for (let j = 0; j < boxUnits; j++) {
        const box = new Box(boxWidth, boxHeight, boxDepth, boxThickness);
        // Position boxes relative to the shelf surface
        box.position.x = (shelfWidth / 2) - boxWidth; // Space them out
        box.position.y = levelThickness / 2; // Position on top of shelf

        if (i == 2) {
          box.position.z = (-1) * (boxDepth) * j - 20;
        } else {
          box.position.z = (boxDepth) * j + 20;
        }
        // Add box to the level group
        shelf.add(box);
      }

      // Add shelf with boxes to the level group
      level.add(shelf);

      // Position the entire level group
      level.position.y = i * levelHeight;
      level.position.z = levelDepth / 4;

      // Apply rotation to the entire level group after everything is added
      let angle = 0;
      if (i == 2) {
        angle = - Math.PI / 16; // - 15 degrees
      } else {
        angle = Math.PI / 16; // 15 degrees
      }
      level.rotation.x = angle;

      this.add(level);
    }

    // Add vertical supports
    const supportWidth = 20;
    const supportGeometry = new THREE.BoxGeometry(supportWidth, shelfHeight, supportWidth);

    // Left support
    const leftSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
    leftSupport.position.set(-shelfWidth / 2 + supportWidth / 2, shelfHeight / 2, -shelfDepth / 2 + supportWidth / 2);
    this.add(leftSupport);

    // Right support
    const rightSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
    rightSupport.position.set(shelfWidth / 2 - supportWidth / 2, shelfHeight / 2, -shelfDepth / 2 + supportWidth / 2);
    this.add(rightSupport);

    // Add axes helper
    this.add(new THREE.AxesHelper(50));
  }
}

export class Robot extends THREE.Object3D {
  constructor() {
    super();

    // Create materials
    const material = new THREE.MeshStandardMaterial({
      color: 0x444444,  // Dark gray for robot
      metalness: 0.7,
      roughness: 0.3,
    });
    material.side = THREE.DoubleSide;

    // Robot dimensions
    const robotWidth = 10;
    const robotHeight = 150;
    const robotDepth = 40;

    // Create main body (box)
    const bodyGeometry = new THREE.BoxGeometry(robotWidth, robotHeight, robotDepth);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = robotHeight / 2;
    this.add(body);

    // Create wheels (spheres)
    const wheelsWidth = 10;
    const wheelsHeight = 32;
    const wheelsDepth = 32;

    const wheelGeometry = new THREE.SphereGeometry(wheelsWidth, wheelsHeight, wheelsDepth);
    const wheelPositions = [
      { x: -20, y: 10, z: -20 }, // front left
      { x: 20, y: 10, z: -20 },  // front right
      { x: -20, y: 10, z: 20 },  // back left
      { x: 20, y: 10, z: 20 }    // back right
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, material);
      wheel.position.set(pos.x, pos.y, pos.z);
      this.add(wheel);
    });

    // Create robot arm (two connected tubes)
    const armBaseGeometry = new THREE.CylinderGeometry(5, 5, 40, 32);
    const armBase = new THREE.Mesh(armBaseGeometry, material);
    armBase.position.set(0, 150, 0);
    armBase.rotation.x = Math.PI / 2;
    this.add(armBase);

    const armExtensionGeometry = new THREE.CylinderGeometry(3, 3, 30, 32);
    const armExtension = new THREE.Mesh(armExtensionGeometry, material);
    armExtension.position.set(0, 150, -30);
    armExtension.rotation.x = Math.PI / 2;
    this.add(armExtension);

    const varCubo = 30;
    const raio = 15;

    const tuboGeometry = new THREE.TorusGeometry(
      2 * raio,  // raio do torus
      raio,   // raio do tubo
      16,  // segmentos radiais
      100, // segmentos tubulares
      Math.PI // arco (radianos)
    );
    const tubo = new THREE.Mesh(tuboGeometry, material);
    tubo.position.x = varCubo / 2;
    tubo.rotation.x = -0.5 * Math.PI;
    tubo.position.y = varCubo + raio * 5;
    tubo.position.z = -varCubo;
    tubo.rotation.z = -0.5 * Math.PI;
    this.add(tubo);

    const tuboEsquerdo = new THREE.Mesh(tuboGeometry, material);
    tuboEsquerdo.position.x = -varCubo / 2;
    tuboEsquerdo.rotation.x = -0.5 * Math.PI;
    tuboEsquerdo.position.y = varCubo + raio * 5;
    tuboEsquerdo.position.z = -varCubo;
    tuboEsquerdo.rotation.z = 0.5 * Math.PI;
    this.add(tuboEsquerdo);

    // Add axes helper
    this.add(new THREE.AxesHelper(10));
  }
}

export class Warehouse extends THREE.Object3D {
  constructor(shelfWidth, shelfHeight, shelfDepth, boxWidth, boxHeight, boxDepth, boxThickness) {
    super();

    const material = new THREE.MeshStandardMaterial({
      color: 0xCCCCCC,  // Light gray for warehouse structure
      metalness: 0.1,
      roughness: 0.8,
    });
    material.side = THREE.DoubleSide;

    // Colors
    const whiteColor = 0xffffff;
    const blueColor = 0x4444ff;
    const redColor = 0xff4444;
    const yellowColor = 0xffff44;

    // Add directional lights for dramatic effect
    const directionalLight1 = new THREE.DirectionalLight(blueColor, 2);
    directionalLight1.position.set(1, 1, 1);
    directionalLight1.castShadow = true;
    this.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(redColor, 2);
    directionalLight2.position.set(-1, 1, -1);
    directionalLight2.castShadow = true;
    this.add(directionalLight2);

    // Add spotlights above each shelf with different colors
    const spotlightColors = [yellowColor, whiteColor, blueColor];
    for (let i = 0; i < 3; i++) {
      const spotLight = new THREE.SpotLight(spotlightColors[i]);

      // Configure spotlight properties
      spotLight.shadow.mapSize.width = 2048;
      spotLight.shadow.mapSize.height = 2048;
      spotLight.shadow.camera.near = 10;
      spotLight.shadow.camera.far = 10000;
      spotLight.intensity = 5; // Increased intensity
      spotLight.angle = Math.PI / 4; // 45 degrees for wider coverage
      spotLight.penumbra = 0.1;
      spotLight.decay = 1;
      spotLight.distance = 1000;
      spotLight.castShadow = true;

      // Position the spotlight
      spotLight.position.set(
        (i - 1) * shelfWidth, // x position
        shelfHeight * 2,      // y position (higher above the shelves)
        0                     // z position
      );

      // Create a target for the spotlight
      const target = new THREE.Object3D();
      target.position.set(
        (i - 1) * shelfWidth, // x position
        0,                    // y position (at floor level)
        0                     // z position
      );
      spotLight.target = target;
      this.add(target);
      this.add(spotLight);
    }

    // Add point lights for additional illumination with different colors
    const pointLight1 = new THREE.PointLight(redColor, 3, 1000);
    pointLight1.position.set(shelfWidth, shelfHeight, shelfDepth);
    this.add(pointLight1);

    const pointLight2 = new THREE.PointLight(blueColor, 3, 1000);
    pointLight2.position.set(-shelfWidth, shelfHeight, shelfDepth);
    this.add(pointLight2);

    const pointLight3 = new THREE.PointLight(yellowColor, 3, 1000);
    pointLight3.position.set(0, shelfHeight, -shelfDepth);
    this.add(pointLight3);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(shelfWidth * 4, shelfDepth * 4);
    const floor = new THREE.Mesh(floorGeometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.add(floor);

    // Create back wall
    const backWallGeometry = new THREE.PlaneGeometry(shelfWidth * 4, shelfHeight * 1.5);
    const backWall = new THREE.Mesh(backWallGeometry, material);
    backWall.position.z = -shelfDepth * 2;
    backWall.position.y = shelfHeight * 0.75;
    this.add(backWall);

    // Create side walls
    const sideWallGeometry = new THREE.PlaneGeometry(shelfDepth * 4, shelfHeight * 1.5);

    // Left wall
    const leftWall = new THREE.Mesh(sideWallGeometry, material);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -shelfWidth * 2;
    leftWall.position.y = shelfHeight * 0.75;
    this.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(sideWallGeometry, material);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = shelfWidth * 2;
    rightWall.position.y = shelfHeight * 0.75;
    this.add(rightWall);

    // Create three shelves side by side
    for (let i = 0; i < 3; i++) {
      const shelf = new Shelf(shelfWidth, shelfHeight, shelfDepth, boxWidth, boxHeight, boxDepth, boxThickness);
      // Position shelves side by side
      shelf.position.x = (i - 1) * shelfWidth + 20;
      shelf.position.y = 30;

      this.add(shelf);
    }

    // Add axes helper
    this.add(new THREE.AxesHelper(50));
  }
}
