import React from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

export default class Course extends React.Component<any, any>{

  private rootRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const canvasElement = createCanvasElement();
    this.rootRef.current!.appendChild(canvasElement);
  }

  public render() {
    return (
      <div ref={this.rootRef} style={{ fontSize: 0 }}></div>
    );
  }
}

function createCanvasElement(): HTMLCanvasElement {
  const scene = new THREE.Scene();

  Promise.all([
    loadTexture(require('../assets/textures/hestia-face.png')),
    loadTexture(require('../assets/textures/hestia-skins.png')),
  ]).then(([textureFace, textureSkins]) => {
    loadMTLFile(require('../assets/models/hestia.mtl')).then((materials) => {
      loadOBJFile(require('../assets/models/hestia.obj'), materials).then((model) => {
        model.scale.set(300, 300, 300);
        model.position.y = -window.innerHeight * 0.35;

        model.traverse((object3D) => {
          if (object3D instanceof THREE.Mesh) {
            if (Array.isArray(object3D.material)) {
              object3D.material.forEach((material) => {
                if (material instanceof THREE.MeshPhongMaterial) {
                  switch (material.name) {
                    case 'Face':
                      material.map = textureFace;
                      break;
                    case 'Final':
                      material.map = textureSkins;
                      break;
                    default:
                      console.warn('This material has no texture matched!');
                  }
                }
              });
            }
          }
        });

        const light = new THREE.AmbientLight();

        scene.add(model, light);

        animate();

        function animate() {
          render();
          model.rotateY(0.01);
          requestAnimationFrame(animate);
        }
      });
    });
  });

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    renderer.render(scene, camera);
  }

  return renderer.domElement;
}

function loadTexture(url: string) {
  return new Promise((resolve: (texture: THREE.Texture) => void, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(url, resolve,
      (event) => { console.log('Texture File Load Progress:', event); },
      (envent) => {
        console.log('Texture File Load Error:', event);
        reject(event);
      });
  });
}

function loadMTLFile(url: string) {
  return new Promise((resolve: (materials: MTLLoader.MaterialCreator) => void, reject) => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(url,
      (materials) => {
        materials.preload(); // 如果materials属性中没有materialsInfo属性中的material对象，先生成
        resolve(materials);
      },
      (event) => { console.log('MTL File Load Progress:', event); },
      (envent) => {
        console.log('MTK File Load Error:', event);
        reject(event);
      });
  });
}

function loadOBJFile(url: string, materials?: MTLLoader.MaterialCreator) {
  return new Promise((resolve: (group: THREE.Group) => void, reject) => {
    const objLoader = new OBJLoader();
    if (materials) objLoader.setMaterials(materials); // 设置material
    objLoader.load(url, resolve,
      (event) => { console.log('OBJ File Load Progress:', event); },
      (envent) => {
        console.log('OBJ File Load Error:', event);
        reject(event);
      });
  });
}