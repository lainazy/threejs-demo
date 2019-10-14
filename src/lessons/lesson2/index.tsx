import React from 'react';
import './index.scss';
import * as THREE from 'three';

export default class Lesson2 extends React.Component<any, any>{

  scene = {} as THREE.Scene;
  camera = {} as THREE.Camera;
  renderer = {} as THREE.Renderer;

  line = {} as THREE.Line;

  componentDidMount() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.animate();
  }

  private createScene() {
    this.scene = new THREE.Scene();
    const geometry = new THREE.Geometry();
    const vector1 = new THREE.Vector3(10, 10, 10);
    const vector2 = new THREE.Vector3(10, -10, -10);
    const vector3 = new THREE.Vector3(-10, 10, 10);
    geometry.vertices.push(vector1, vector2, vector3);
    const material = new THREE.LineDashedMaterial({ color: 0xffff00 });
    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
  }

  private createCamera = () => {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.z = 100;
    this.camera.lookAt(0, 0, 0);
  };

  private createRenderer = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const wrapDiv = document.querySelector<HTMLDivElement>('.lesson2');
    (wrapDiv as HTMLDivElement).appendChild(this.renderer.domElement);
  };

  private animate = () => {
    const { scene, camera, renderer } = this;
    this.line.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(this.animate);
  };

  public render() {
    return (
      <div className="lesson2"></div>
    );
  }
}