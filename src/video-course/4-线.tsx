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
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const vector1 = new THREE.Vector3(10, 0, 0);
  const vector2 = new THREE.Vector3(0, 10, 0);
  const vector3 = new THREE.Vector3(0, 0, 10);

  // 绘制line1
  const geometry1 = new THREE.Geometry();
  const material1 = new THREE.LineBasicMaterial({ color: 0x4400ff });

  geometry1.vertices.push(vector1, vector2, vector3);

  const line1 = new THREE.Line(geometry1, material1);
  line1.position.y = 10;

  // 绘制line2
  const geometry2 = new THREE.Geometry();
  const material2 = new THREE.LineBasicMaterial({ vertexColors: true });

  const color1 = new THREE.Color(0x444444);
  const color2 = new THREE.Color(0xff0000);
  const color3 = new THREE.Color(0x00ff00);

  geometry2.vertices.push(vector1, vector2, vector3);
  geometry2.colors.push(color1, color2, color3);

  const line2 = new THREE.LineLoop(geometry2, material2);
  line2.position.y = -5;

  scene.add(line1, line2);

  camera.position.set(5, 5, 50);

  renderer.setClearColor(0xffffff);
  renderer.render(scene, camera);

  return renderer.domElement;
}