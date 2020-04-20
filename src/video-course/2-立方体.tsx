import React from 'react';
import * as THREE from 'three';
import { render } from 'react-dom';

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
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  camera.position.z = 20;

  render();

  function render() {
    renderer.render(scene, camera);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    requestAnimationFrame(render);
  }

  return renderer.domElement;
}
