import React from 'react';
import './index.scss';
import * as THREE from 'three';

export default class Lesson1 extends React.Component<any, any>{

  private static degree = Math.PI * 0.01;

  private scene = {} as THREE.Scene;
  private camera = {} as THREE.Camera;
  private renderer = {} as THREE.Renderer;

  private mesh = {} as THREE.Mesh;

  componentDidMount() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.animate();
  }

  private createScene() {
    this.scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  private createCamera = () => {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10);
    this.camera.position.z = 5;
  };

  private createRenderer = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const wrapDiv = document.querySelector<HTMLDivElement>('.lesson1');
    (wrapDiv as HTMLDivElement).appendChild(this.renderer.domElement);
  };

  private animate = () => {
    const { scene, camera, renderer, mesh } = this;
    mesh.rotation.x += Lesson1.degree;
    mesh.rotation.y += Lesson1.degree;
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
  };

  public render() {
    return (
      <div className="lesson1"></div>
    );
  }
}