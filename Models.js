'use strict';

import * as THREE from 'three';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';


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

        this.add(plane);
      }
    )
  }
}
