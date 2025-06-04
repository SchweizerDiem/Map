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

        let geometry = new THREE.PlaneGeometry(imgWidth, imgHeight);

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });

        const plane = new THREE.Mesh(geometry, material);

        plane.rotation.z = 0.5678;

        // TODO: Engrave the text "ALTERNATORS XPTO MY COMPANY INC" in the
        // cardboard image
        const cardTexture = new THREE.TextureLoader().load(
          './texture/istockphoto-470229867-612x612.jpg' // Cardboard image
        );


        const topTexture = new THREE.TextureLoader().load(
          './texture/alternador-eletrico.png' // Image of alternator
        );

        // Materiais para cada face do cubo
        const materials = [
          new THREE.MeshBasicMaterial({ map: cardTexture }), // Lado direito
          new THREE.MeshBasicMaterial({ map: cardTexture }), // Lado esquerdo
          new THREE.MeshBasicMaterial({ map: cardTexture }),  // Topo
          new THREE.MeshBasicMaterial({ map: cardTexture }), // Base
          new THREE.MeshBasicMaterial({ map: topTexture }), // Frente
          new THREE.MeshBasicMaterial({ map: cardTexture })  // Trás
        ];

        // Create cubes
        const boxWidth = 28.2;
        const boxHeigth = 28;

        geometry = new THREE.BoxGeometry(boxWidth, boxHeigth, boxHeigth);

        const box = new THREE.Mesh(geometry, materials);
        box.position.y = -97;
        box.position.z = boxHeigth / 2;

        const box2 = new THREE.Mesh(geometry, materials);
        box2.position.y = -97;
        box2.position.z = boxHeigth / 2;
        box2.position.x = -169;

        this.add(plane);
        this.add(box)
        this.add(box2)
      }
    )
  }
}
