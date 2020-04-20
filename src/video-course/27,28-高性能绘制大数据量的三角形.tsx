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

  const triangleTotalCount = 1000000;

  const createTriangleStartTime = performance.now();
  // const mesh = createTriangleByGeometry(triangleTotalCount);
  const mesh = createTriangleByBufferGeometry(triangleTotalCount);
  const createTriangleEndTime = performance.now();
  console.log(`创建${triangleTotalCount}个三角形耗时：`, createTriangleEndTime - createTriangleStartTime);

  scene.add(mesh);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1800;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    stats.begin();
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;
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
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

  const displayRangeSideLength = 400; // 显示区域的立方体边长，所有三角形都在该立方体区域内显示
  const displayRangeSideLengthHalf = displayRangeSideLength / 2;
  const triangleMaxSize = 10; // 三角形的最大尺寸
  const triangleMaxSizeHalf = triangleMaxSize / 2;

  for (let i = 0; i < totalCount; i++) {
    // 随机生成立方体容器内的一个向量的x、y、z坐标，即一个顶点坐标
    const x = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const y = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const z = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;

    // 随机生成三角形顶点a的x、y、z坐标
    const ax = Math.random() * triangleMaxSize - triangleMaxSizeHalf;
    const ay = Math.random() * triangleMaxSize - triangleMaxSizeHalf;
    const az = Math.random() * triangleMaxSize - triangleMaxSizeHalf;

    // 随机生成三角形顶点b的x、y、z坐标
    const bx = Math.random() * triangleMaxSize - triangleMaxSizeHalf;
    const by = Math.random() * triangleMaxSize - triangleMaxSizeHalf;
    const bz = Math.random() * triangleMaxSize - triangleMaxSizeHalf;

    // 随机生成三角形顶点c的x、y、z坐标
    const cx = Math.random() * triangleMaxSize - triangleMaxSizeHalf;
    const cy = Math.random() * triangleMaxSize - triangleMaxSizeHalf;
    const cz = Math.random() * triangleMaxSize - triangleMaxSizeHalf;

    // 将三角形的三个顶点向量统一加一个相同的向量，相当于平移这个三角形
    const vectorA = new THREE.Vector3(x + ax, y + ay, z + az);
    const vectorB = new THREE.Vector3(x + bx, y + by, z + bz);
    const vectorC = new THREE.Vector3(x + cx, y + cy, z + cz);

    geometry.vertices.push(vectorA, vectorB, vectorC);

    // 设置颜色渐变
    const r = (x / displayRangeSideLength) + 0.5;
    const g = (y / displayRangeSideLength) + 0.5;
    const b = (z / displayRangeSideLength) + 0.5;

    const face = new THREE.Face3(i * 3, i * 3 + 1, i * 3 + 2);
    face.color.setRGB(r, g, b);

    geometry.faces.push(face);
  }

  return new THREE.Mesh(geometry, material);
}

function createTriangleByBufferGeometry(totalCount: number) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

  const displayRangeSideLength = 400; // 显示区域的立方体边长，所有三角形都在该立方体区域内显示
  const displayRangeSideLengthHalf = displayRangeSideLength / 2;
  const triangleMaxSize = 10; // 三角形的最大尺寸
  const triangleMaxSizeHalf = triangleMaxSize / 2;

  const size = totalCount * 3 * 3; // 一个三角形有3个顶点，一个顶点有3个坐标
  const positions = new Float32Array(size);
  const colors = new Float32Array(size);

  for (let i = 0; i < size; i += 9) {
    // 随机生成立方体容器内的一个向量的x、y、z坐标，即一个顶点坐标
    const x = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const y = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;
    const z = Math.random() * displayRangeSideLength - displayRangeSideLengthHalf;

    // 计算当前位置三角形的颜色归一化值
    const r = (x / displayRangeSideLength) + 0.5;
    const g = (y / displayRangeSideLength) + 0.5;
    const b = (z / displayRangeSideLength) + 0.5;

    for (let j = i; j < i + 9; j += 3) {
      // 随机生成三角形顶点的x、y、z坐标
      positions[j] = x + Math.random() * triangleMaxSize - triangleMaxSizeHalf;
      positions[j + 1] = y + Math.random() * triangleMaxSize - triangleMaxSizeHalf;
      positions[j + 2] = z + Math.random() * triangleMaxSize - triangleMaxSizeHalf;

      // 设置三角形顶点的颜色
      colors[j] = r;
      colors[j + 1] = g;
      colors[j + 2] = b;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // position对应一个顶点，所以需要3个坐标
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals(); // 根据position自动计算每个顶点的法向量，不计算也没什么关系貌似

  return new THREE.Mesh(geometry, material);
}