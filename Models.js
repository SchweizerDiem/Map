'use strict';

import * as THREE from 'three';

export class Map extends THREE.Object3D {
  constructor() {
    super();

    const textureLoader = new THREE.TextureLoader();
    // Carregar a textura do plano
    textureLoader.load(
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

        // Carregar a textura de fundo do cubo (cardboard.jpg)
        const cardTexture = textureLoader.load('./texture/cardboard.avif');

        // Criar o canvas para combinar a textura com o texto
        const canvas = document.createElement('canvas');
        canvas.width = 256; // Tamanho da textura
        canvas.height = 256;
        const context = canvas.getContext('2d');

        // Carregar a textura do alternador (frente do cubo)
        const topTexture = textureLoader.load('./texture/alternador-eletrico.png');

        // Função para desenhar a textura e o texto no canvas
        function createTexturedMaterial() {
          // Desenhar a textura cardboard no canvas
          context.drawImage(cardTexture.image, 0, 0, canvas.width, canvas.height);

          // Adicionar o texto "ALTERNATORS XPTO MY COMPANY INC"
          context.font = '12px Arial'; // Ajuste o tamanho para caber
          context.fillStyle = 'black';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText('ALTERNATORS XPTO MY COMPANY INC', canvas.width / 2, canvas.height / 2);

          // Criar a textura a partir do canvas
          const combinedTexture = new THREE.CanvasTexture(canvas);

          // Retornar o material com a textura combinada
          return new THREE.MeshBasicMaterial({ map: combinedTexture });
        }

        // Aguardar o carregamento de todas as texturas antes de criar os cubos
        textureLoader.load('./texture/cardboard.jpg', () => {
          // Materiais para cada face do cubo
          const cardMaterial = createTexturedMaterial();
          const materials = [
            cardMaterial, // Lado direito
            cardMaterial, // Lado esquerdo
            cardMaterial, // Topo
            cardMaterial, // Base
            new THREE.MeshBasicMaterial({ map: topTexture }), // Frente
            cardMaterial  // Trás
          ];

          // Criar os cubos
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

          // Adicionar os objetos à cena
          this.add(plane);
          this.add(box);
          this.add(box2);
        });
      }
    );
  }
}
