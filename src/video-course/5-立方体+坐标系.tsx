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
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });

  const cube = new THREE.Mesh(geometry, material);
  const axesHelper = new THREE.AxesHelper(4);

  const object3D = new THREE.Object3D();
  object3D.add(cube, axesHelper);

  scene.add(object3D);

  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);

  renderer.setClearColor(0xffffff);
  render();

  function render() {
    renderer.render(scene, camera);
    object3D.rotation.x += 0.01;
    object3D.rotation.y += 0.01;
    requestAnimationFrame(render);
  }

  return renderer.domElement;
}