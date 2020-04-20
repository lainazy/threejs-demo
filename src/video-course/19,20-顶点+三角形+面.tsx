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

  // 图形1
  const geometry = new THREE.PlaneGeometry(200, 200, 2, 2);
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: true });

  const color1 = new THREE.Color(0xdf4000);
  const color2 = new THREE.Color(0x55bb60);
  const color3 = new THREE.Color(0x0080ff);

  geometry.faces.forEach((face) => {
    face.vertexColors.push(color1, color2, color3);
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 200;

  scene.add(mesh);

  // 图形2
  const geometry2 = new THREE.Geometry();
  const material2 = new THREE.MeshBasicMaterial({ vertexColors: true });

  const vector1 = new THREE.Vector3(0, 100, 0);
  const vector2 = new THREE.Vector3(100, 0, 0);
  const vector3 = new THREE.Vector3(-100, 0, 0);

  geometry2.vertices.push(vector1, vector2, vector3);

  // 顶点index对应vertices数组中的index
  // 3个顶点坐标按顺序连线构成的角必须小于180度：“逆时针：正面，顺时针：反面”
  const face = new THREE.Face3(0, 2, 1);
  face.vertexColors.push(color1, color2, color3);

  geometry2.faces.push(face);

  const mesh2 = new THREE.Mesh(geometry2, material2);
  mesh2.position.y = -200;

  scene.add(mesh2);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    renderer.render(scene, camera);
  }

  return renderer.domElement;
}