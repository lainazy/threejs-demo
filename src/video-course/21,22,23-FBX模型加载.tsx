import React from 'react';
import * as THREE from 'three';
import Stats from 'stats.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const stats = new Stats();

export default class Course extends React.Component<any, any>{

  private rootRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const canvasElement = createCanvasElement();
    this.rootRef.current!.appendChild(canvasElement);
    this.rootRef.current!.appendChild(stats.dom);
  }

  public render() {
    return (
      <div ref={this.rootRef} style={{ fontSize: 0 }}></div>
    );
  }
}

function createCanvasElement(): HTMLCanvasElement {
  const scene = new THREE.Scene();

  loadModel(require('../assets/models/altair.fbx')).then((model) => {
    model.position.y = -window.innerHeight * 0.35;

    const light = new THREE.PointLight(0xffffff, 1, 2000, 1);
    light.position.set(-500, 500, 1000);

    // 这里的model就是由多个mesh组成的group，所以不需要自行创建material和mesh
    // 有些情况下加载返回的可能只是geometry，那就需要自行创建material和mesh，如使用VTKLoader
    scene.add(model, light);

    animate();

    function animate() {
      stats.begin();
      model.rotateY(0.02);
      render();
      stats.end();
      requestAnimationFrame(animate);
    }

  });

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1200;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    renderer.render(scene, camera);
  }

  return renderer.domElement;
}

function loadModel(url: string) {
  return new Promise((resolve: (group: THREE.Group) => void, reject) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(url, resolve,
      (event) => { console.log('progress:', event); },
      (event) => {
        console.log('error:', event);
        reject(event);
      }
    );
  });
}