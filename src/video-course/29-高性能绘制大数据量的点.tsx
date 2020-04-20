import React from 'react';
import * as THREE from 'three';
import Stats from 'stats.js';

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

  const triangleTotalCount = 5000000;

  const createTriangleStartTime = performance.now();
  // const points = createTriangleByGeometry(triangleTotalCount);
  const points = createTriangleByBufferGeometry(triangleTotalCount);
  const createTriangleEndTime = performance.now();
  console.log(`创建${triangleTotalCount}个三角形耗时：`, createTriangleEndTime - createTriangleStartTime);

  scene.add(points);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 800;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    stats.begin();
    points.rotation.x += 0.01;
    points.rotation.y += 0.01;
    points.rotation.z += 0.01;
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
  }

  const renderEndTime = performance.now();
  console.log(`渲染${triangleTotalCount}个三角形耗时：`, renderEndTime - createTriangleEndTime);

  return renderer.domElement;
}

function createTriangleByGeometry(totalCount: number) {
  const geometry = new THREE.Geometry();
  const material = new THREE.PointsMaterial({ vertexColors: true, size: 1 });

  const displayRangeSideLength = 400; // 显示区域的立方体边长，所有三角形都在该立方体区域内显示
  const displayRangeSideLengthHalf = displayRangeSideLength / 2;

  for (let i = 0; i < totalCount; i++) {
    // 随机生成立方体容器内的一个向量的x、y、z坐标，即一个顶点坐标
    const x = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const y = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const z = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;

    const point = new THREE.Vector3(x, y, z);

    geometry.vertices.push(point);

    // 计算当前点颜色归一化值
    const r = (x / displayRangeSideLength) + 0.5;
    const g = (y / displayRangeSideLength) + 0.5;
    const b = (z / displayRangeSideLength) + 0.5;

    const color = new THREE.Color();
    color.setRGB(r, g, b);

    geometry.colors.push(color);
  }

  return new THREE.Points(geometry, material);
}

function createTriangleByBufferGeometry(totalCount: number) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({ vertexColors: true, size: 1 });

  const displayRangeSideLength = 400; // 显示区域的立方体边长，所有三角形都在该立方体区域内显示
  const displayRangeSideLengthHalf = displayRangeSideLength / 2;

  const size = totalCount * 3; // 一个顶点有3个坐标
  const positions = new Float32Array(size);
  const colors = new Float32Array(size);

  // for (let i = 0; i < size; i += 3) {
  //   // 随机生成立方体容器内的一个向量的x、y、z坐标，即一个顶点坐标
  //   const x = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
  //   const y = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
  //   const z = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;

  //   // 计算当前位置三角形的颜色归一化值
  //   const r = (x / displayRangeSideLength) + 0.5;
  //   const g = (y / displayRangeSideLength) + 0.5;
  //   const b = (z / displayRangeSideLength) + 0.5;

  //   positions[i] = x;
  //   positions[i + 1] = y;
  //   positions[i + 2] = z;

  //   colors[i] = r;
  //   colors[i + 1] = g;
  //   colors[i + 2] = b;
  // }

  // 由上面注释部分代码简化而来
  for (let i = 0; i < size; i++) {
    const xyz = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const rgb = (xyz / displayRangeSideLength) + 0.5;
    positions[i] = xyz;
    colors[i] = rgb;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // position对应一个顶点，所以需要3个坐标
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(geometry, material);
}