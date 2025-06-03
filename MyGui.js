'use strict';

import { Webgl } from './Webgl.js';
/*
   This file aims to deal with human interaction with the application.
   It presents a little user interface throught which humans interact with the application.

   See https://lil-gui.georgealways.com/#Guide for details.
*/

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';  // https://www.npmjs.com/package/lil-gui
import { Map } from './Models.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

export class MyGui {

  webgl;
  currentControls = null;

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
      },
      "showMap": () => {
        const map = new Map();

        this.webgl.scene.add(map);
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
      }
    };

    const gui = new GUI();

    // Add camera controls
    const cameraFolder = gui.addFolder('Camera Controls');
    cameraFolder.add(guiVars, 'setPerspectiveCamera').name('Câmara em perspetiva');
    cameraFolder.add(guiVars, 'setOrthographicCamera').name('Câmara ortográfica');
    cameraFolder.open();

    // Add view controls
    const viewFolder = gui.addFolder('View Controls');
    viewFolder.add(guiVars, 'setTrackballControls').name('Trackball Controls');
    viewFolder.open();

    // Add action buttons
    const sceneFolder = gui.addFolder('Scenes Controls')
    sceneFolder.add(guiVars, 'cleanScene').name('Limpar écran');
    sceneFolder.add(guiVars, 'showMap').name('Vêr Mapa');
    sceneFolder.open();

    // Add initial axes helper
    this.webgl.scene.add(new THREE.AxesHelper(50));

    // Set initial camera and controls
    guiVars.setPerspectiveCamera();
    guiVars.setTrackballControls();

    // Add animation loop for robot movement
    const animate = () => {
      requestAnimationFrame(animate);
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
