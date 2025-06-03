'use strict';

import * as THREE from 'three';


export class Map extends THREE.Object3D {
  constructor() {
    super();

    const texture = new THREE.TextureLoader();
    // immediately use the texture for material creation 

    texture.load(
      "./texture/trabalho_TP2_mapa_area_logistica.png",
      (texture) => {
        const imgWidth = texture.image.width;
        const imgHeight = texture.image.height;

        const geometry = new THREE.PlaneGeometry(imgWidth, imgHeight);

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });

        const plane = new THREE.Mesh(geometry, material);

        // Rotate plane to lie flat on XZ plane (90 degrees around X-axis)
        plane.rotation.x = -Math.PI / 2;
        // Position plane at y = 0 (or slightly above to avoid z-fighting)
        plane.position.y = 0.01;

        this.add(plane);
      }
    )
  }
}
