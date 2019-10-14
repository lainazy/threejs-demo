import React from 'react';
import './index.scss';
import * as THREE from 'three';

export default class Lesson3 extends React.Component<any, any>{

  scene = {} as THREE.Scene;
  camera = {} as THREE.Camera;
  renderer = {} as THREE.Renderer;

  mesh = {} as THREE.Mesh;
  wrapper = {} as THREE.Object3D;

  componentDidMount() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
    const font = require('three/examples/fonts/helvetiker_regular.typeface.json');
    const geometry = new THREE.TextGeometry('three.js', {
      font: new THREE.Font(font),
      size: 100,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 5,
      bevelSegments: 3,
      bevelOffset: 0
    });
    const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = -220;
    this.wrapper = new THREE.Object3D();
    this.wrapper.add(this.mesh);
    const light1 = new THREE.DirectionalLight(0xAA0000);
    light1.position.set(500, 0, 500);
    const light2 = new THREE.DirectionalLight(0x00AA00);
    light2.position.set(-500, 0, 500);
    this.scene.add(this.wrapper, light1, light2);
  }

  createCamera = () => {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(0, 0, 1200);
    this.camera.lookAt(0, 0, 0);
  };

  createRenderer = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const wrapDiv = document.querySelector<HTMLDivElement>('.lesson3');
    (wrapDiv as HTMLDivElement).appendChild(this.renderer.domElement);
  };

  animate = () => {
    const { scene, camera, renderer, wrapper } = this;
    wrapper.rotation.y += 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
  };

  public render() {
    return (
      <div className="lesson3"></div>
    );
  }
}