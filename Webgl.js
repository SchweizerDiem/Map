'use strict';

/*
   This file contains the weblg initialization code (creation of scene, camera, renderer, ...).
*/

import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

export class Webgl {

  clock;
  renderer;
  scene;
  camera;
  controls;

  constructor() {

    this.clock = new THREE.Clock();

    // create a render and set the size
    const canvas = document.querySelector('#WebGL-canvas');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.useLegacyLights = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x555555);

    // Add window resize handler
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    });

    this.addLight()
  }

  addLight() {
    ////////////////////////////////////
    //add subtle ambient lighting
    var ambiColor = "#FFFFFF";
    this.ambientLight = new THREE.AmbientLight(ambiColor);
    this.scene.add(this.ambientLight);
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight(0xffffff);

    //spotLight.shadow.mapSize.width = 1024;
    //spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 10;
    this.spotLight.shadow.camera.far = 10000;
    this.spotLight.intensity = 5;

    this.spotLight.position.set(21000, 21000, 21000);
    this.spotLight.castShadow = true;
    this.scene.add(this.spotLight);

    //const helper = new THREE.CameraHelper(this.spotLight.shadow.camera);
    //this.scene.add(helper);
  }

  render() {
    const delta = this.clock.getDelta();

    // Update controls if they exist
    if (this.controls) {
      if (this.controls.update) {
        this.controls.update(delta);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
