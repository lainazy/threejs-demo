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

  const group = createBoxMesh(1000);

  const light = new THREE.AmbientLight(0xffffff);

  scene.add(group, light);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

  const cameraPositionRadius = 1000;
  let phiDegree = 0;
  let thetaDegree = 0;

  const raycaster = new THREE.Raycaster(); // 镭射
  let lastIntersectionObject: THREE.Mesh | null = null;

  // 归一化的设备坐标：左上角为(0, 0)，右下角为(1, 1)
  // 归一化的世界坐标：屏幕中心点为(0, 0)，左下角为(-1, -1)，右上角为(1, 1)
  // 这里我们需要归一化的世界坐标
  const mouse = { x: 0, y: 0 };

  window.addEventListener('mousemove', (event) => {
    // 鼠标指针位置转化为归一化世界坐标的计算公式
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  });

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    stats.begin();
    rotateCamera();
    updateIntersections();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
  }

  function rotateCamera() {
    const phiRadian = THREE.MathUtils.degToRad(phiDegree += 0.05);
    const thetaRadian = THREE.MathUtils.degToRad(thetaDegree += 0.1);

    const x = - cameraPositionRadius * Math.cos(phiRadian) * Math.sin(thetaRadian);
    const y = cameraPositionRadius * Math.cos(thetaRadian);
    const z = cameraPositionRadius * Math.sin(phiRadian) * Math.sin(thetaRadian);

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(); // 暂不清楚必要性
  }

  function updateIntersections() {
    // 每次更新都要重新设置
    raycaster.setFromCamera(mouse, camera);
    // 每次更新都要重新设置，从近到远排列
    const intersections = raycaster.intersectObjects(group.children);
    if (intersections.length > 0) {
      const currentIntersectionObject = intersections[0].object as THREE.Mesh;
      if (lastIntersectionObject !== currentIntersectionObject) {
        if (lastIntersectionObject !== null) {
          // @ts-ignore
          lastIntersectionObject.material.color.setHex(lastIntersectionObject.selfColor);
          // @ts-ignore
          delete lastIntersectionObject.selfColor;
        }
        // @ts-ignore
        currentIntersectionObject.selfColor = currentIntersectionObject.material.color.getHex();
        // @ts-ignore
        currentIntersectionObject.material.color.setHex(0xff0000);

        lastIntersectionObject = currentIntersectionObject;
      }
    } else {
      if (lastIntersectionObject !== null) {
        // @ts-ignore
        lastIntersectionObject.material.color.setHex(lastIntersectionObject.selfColor);
        // @ts-ignore
        delete lastIntersectionObject.selfColor;
        lastIntersectionObject = null;
      }
    }
  }

  return renderer.domElement;
}

function createBoxMesh(totalCount: number) {
  const group = new THREE.Group();

  const displayRangeSphereRadius = 1000;

  // 将一根线水平方向旋转360度，竖直方向旋转180度就能构成一个球体
  const phiMaxRadian = 2 * Math.PI; // 和x轴正方向构成的最大夹角(弧度)
  const thetaMaxRadian = Math.PI; // 和y轴正方向构成的最大夹角(弧度)

  const boxMaxSize = 50;
  const boxMaxSizeHalf = boxMaxSize / 2;

  for (let i = 0; i < totalCount; i++) {
    // 随机生成一个与x，y轴的夹角
    const phiRadian = Math.random() * phiMaxRadian;
    const thetaRadian = Math.random() * thetaMaxRadian;

    // 随机生成球体表面的一个向量的x、y、z坐标
    const x = - displayRangeSphereRadius * Math.cos(phiRadian) * Math.sin(thetaRadian);
    const y = displayRangeSphereRadius * Math.cos(thetaRadian);
    const z = displayRangeSphereRadius * Math.sin(phiRadian) * Math.sin(thetaRadian);
    let scaler = Math.random();
    let loop = 4;
    while (loop > 0 && scaler < 0.5) { // 防止球心位置太密集
      scaler = Math.random();
      loop--;
    }

    // 随机生成box模型的大小
    const width = (Math.random() + 1) * boxMaxSizeHalf;
    const height = (Math.random() + 1) * boxMaxSizeHalf;
    const depth = (Math.random() + 1) * boxMaxSizeHalf;

    const geometry = new THREE.BoxBufferGeometry(width, height, depth);

    const material = new THREE.MeshLambertMaterial({ color: 0xffffff * Math.random() });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x * scaler, y * scaler, z * scaler);
    mesh.rotation.set(Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random());

    group.add(mesh);
  }

  return group;
}
