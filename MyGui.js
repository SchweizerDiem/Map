'use strict';

import { Webgl } from './Webgl.js';
/*
   This file aims to deal with human interaction with the application.
   It presents a little user interface throught which humans interact with the application.

   See https://lil-gui.georgealways.com/#Guide for details.
*/

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';  // https://www.npmjs.com/package/lil-gui
import { Box, Shelf, Warehouse, Robot } from './Models.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

export class MyGui {

  webgl;
  currentControls = null;
  robot = null;
  isRobotActive = false;
  robotDirection = 1;
  robotSpeed = 2;
  robotStartX = -400;
  robotEndX = 400;

  constructor(webgl) {
    this.webgl = webgl;

    const guiVars = {
      "boxWidth": 100,
      "boxHeight": 50,
      "boxDepth": 100,
      "boxThickness": 5,
      "shelfWidth": 400,
      "shelfHeight": 300,
      "shelfDepth": 200,
      "cleanScene": () => {
        for (let i = 0; i < this.webgl.scene.children.length;) {
          this.webgl.scene.remove(this.webgl.scene.children[i]);
        }
        this.webgl.scene.add(new THREE.AxesHelper(50));
        this.robot = null;
        this.isRobotActive = false;

        this.webgl.addLight();
      },
      "showBox": () => {
        const box = new Box(
          guiVars.boxWidth,
          guiVars.boxHeight,
          guiVars.boxDepth,
          guiVars.boxThickness
        );

        this.webgl.scene.add(box);
      },
      "showShelf": () => {
        const shelf = new Shelf(
          guiVars.shelfWidth,
          guiVars.shelfHeight,
          guiVars.shelfDepth,
          guiVars.boxWidth,
          guiVars.boxHeight,
          guiVars.boxDepth,
          guiVars.boxThickness
        );

        this.webgl.scene.add(shelf);
      },
      "showWarehouse": () => {
        const warehouse = new Warehouse(
          guiVars.shelfWidth,
          guiVars.shelfHeight,
          guiVars.shelfDepth,
          guiVars.boxWidth,
          guiVars.boxHeight,
          guiVars.boxDepth,
          guiVars.boxThickness
        );
        // Deleting other objects in the scene
        for (let i = 0; i < this.webgl.scene.children.length;) {
          this.webgl.scene.remove(this.webgl.scene.children[i]);
        }
        this.webgl.scene.add(new THREE.AxesHelper(50));
        this.robot = null;
        this.isRobotActive = false;

        this.webgl.scene.add(warehouse);
      },
      "showRobot": () => {
        if (!this.robot) {
          this.robot = new Robot();
          // Position robot in front of the middle shelf
          this.robot.position.set(0, 0, 300);
          this.webgl.scene.add(this.robot);
        }
      },
      "activateRobot": () => {
        this.isRobotActive = !this.isRobotActive;
        if (this.isRobotActive && !this.robot) {
          guiVars.showRobot();
        }
      },
      "setPerspectiveCamera": () => {
        this.webgl.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.webgl.camera.position.set(0, 200, 400);
        this.webgl.camera.lookAt(0, 0, 0);
        if (this.currentControls) {
          this.currentControls.object = this.webgl.camera;
        }
      },
      "setOrthographicCamera": () => {
        const aspect = window.innerWidth / window.innerHeight;
        const size = 200;
        this.webgl.camera = new THREE.OrthographicCamera(
          -size * aspect, size * aspect,
          size, -size,
          0.1, 1000
        );
        this.webgl.camera.position.set(200, 200, 200);
        this.webgl.camera.lookAt(0, 0, 0);
        if (this.currentControls) {
          this.currentControls.object = this.webgl.camera;
        }
      },
      "setTrackballControls": () => {
        const controls = new TrackballControls(this.webgl.camera, this.webgl.renderer.domElement);
        controls.rotateSpeed = 10.0;
        controls.zoomSpeed = 1.0;
        controls.panSpeed = 1.0;
        controls.staticMoving = true;
        this.setControls(controls);
      },
      "setOrbitControls": () => {
        const controls = new OrbitControls(this.webgl.camera, this.webgl.renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI;
        this.setControls(controls);
      },
      "setFirstPersonControls": () => {
        const controls = new FirstPersonControls(this.webgl.camera, this.webgl.renderer.domElement);
        controls.lookSpeed = 0.1;
        controls.movementSpeed = 50;
        controls.lookVertical = true;
        controls.constrainVertical = true;
        controls.verticalMin = 0;
        controls.verticalMax = Math.PI;
        this.setControls(controls);
      },
      "setFlyControls": () => {
        const controls = new FlyControls(this.webgl.camera, this.webgl.renderer.domElement);
        controls.movementSpeed = 50;
        controls.rollSpeed = 0.005;
        controls.dragToLook = true;
        this.setControls(controls);
      }
    };

    const gui = new GUI();

    // // Add box dimensions controls
    // const boxFolder = gui.addFolder('Box Dimensions');
    // boxFolder.add(guiVars, 'boxWidth', 10, 200).name('Width (mm)');
    // boxFolder.add(guiVars, 'boxHeight', 10, 200).name('Height (mm)');
    // boxFolder.add(guiVars, 'boxDepth', 10, 200).name('Depth (mm)');
    // boxFolder.add(guiVars, 'boxThickness', 1, 20).name('Thickness (mm)');
    // boxFolder.open();
    //
    // // Add shelf dimensions controls
    // const shelfFolder = gui.addFolder('Shelf Dimensions');
    // shelfFolder.add(guiVars, 'shelfWidth', 200, 600).name('Width (mm)');
    // shelfFolder.add(guiVars, 'shelfHeight', 200, 400).name('Height (mm)');
    // shelfFolder.add(guiVars, 'shelfDepth', 100, 300).name('Depth (mm)');
    // shelfFolder.open();

    // Add camera controls
    const cameraFolder = gui.addFolder('Camera Controls');
    cameraFolder.add(guiVars, 'setPerspectiveCamera').name('Câmara em perspetiva');
    cameraFolder.add(guiVars, 'setOrthographicCamera').name('Câmara ortográfica');
    cameraFolder.open();

    // Add view controls
    const viewFolder = gui.addFolder('View Controls');
    viewFolder.add(guiVars, 'setTrackballControls').name('Trackball Controls');
    viewFolder.add(guiVars, 'setOrbitControls').name('Orbit Controls');
    viewFolder.add(guiVars, 'setFirstPersonControls').name('First Person Controls');
    viewFolder.add(guiVars, 'setFlyControls').name('Fly Controls');
    viewFolder.open();

    // Add action buttons
    gui.add(guiVars, 'cleanScene').name('Limpar écran');
    gui.add(guiVars, 'showBox').name('Vêr caixa');
    gui.add(guiVars, 'showShelf').name('Vêr estante');
    gui.add(guiVars, 'showWarehouse').name('Vêr armazém');
    gui.add(guiVars, 'showRobot').name('Vêr robot');
    gui.add(guiVars, 'activateRobot').name('Ativar robot');

    // Add initial axes helper
    this.webgl.scene.add(new THREE.AxesHelper(50));

    // Set initial camera and controls
    guiVars.setPerspectiveCamera();
    guiVars.setTrackballControls();

    // Add animation loop for robot movement
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.isRobotActive && this.robot) {
        // Move robot
        this.robot.position.x += this.robotSpeed * this.robotDirection;

        // Check boundaries and reverse direction
        if (this.robot.position.x >= this.robotEndX) {
          this.robotDirection = -1;
        } else if (this.robot.position.x <= this.robotStartX) {
          this.robotDirection = 1;
        }

        // Rotate wheels
        this.robot.children.forEach(child => {
          if (child.geometry instanceof THREE.SphereGeometry) {
            child.rotation.z += 0.1 * this.robotDirection;
          }
        });
      }
    };

    animate();
  }

  setControls(newControls) {
    if (this.currentControls) {
      this.currentControls.dispose();
    }
    this.currentControls = newControls;
    this.webgl.controls = newControls;
  }
}
