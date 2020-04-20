import React from 'react';
import * as THREE from 'three';

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

  getTexture(require('../assets/textures/1.jpg')).then((texture) => {
    texture.repeat.x = 2.5;
    texture.repeat.y = 3.5;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(window.innerWidth * 0.8, window.innerHeight * 0.8);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    render();

    function render() {
      renderer.render(scene, camera);
    }
  });

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  return renderer.domElement;
}

function getTexture(url: string) {
  return new Promise((resolve: (texture: THREE.Texture) => void, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(url, resolve,
      (event) => { console.log('progress:', event); },
      (event) => {
        console.log('error:', event);
        reject(event);
      }
    );
  });
}