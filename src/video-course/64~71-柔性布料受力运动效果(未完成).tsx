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

  const widthSize = 50;
  const heightSize = 50;

  const cloth = createCloth(widthSize, heightSize, 'Geometry');

  if (cloth.geometry instanceof THREE.Geometry) {
    cloth.geometry.vertices.forEach((vector) => {
      if (vector.y === heightSize / 2) {
        fixPoint(vector);
      }
    });
  }

  scene.add(cloth);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 80;
  camera.position.x = 200;
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    handleCloth();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function handleCloth() {
    if (cloth.geometry instanceof THREE.Geometry) {
      const outsideForce = getOutsideForce();
      const displacement = getDisplacement(outsideForce, 1, 1);

      cloth.geometry.vertices.forEach((vector) => {
        addDisplacement(vector, displacement);
      });

      cloth.geometry.verticesNeedUpdate = true;
    }
  }

  return renderer.domElement;
}

// 创建布料
function createCloth(
  widthSize: number,
  heightSize: number,
  geometryConstructor: 'Geometry' | 'BufferGeometry' | 'PlaneGeometry' = 'PlaneGeometry'
) {
  let geometry: THREE.Geometry | THREE.BufferGeometry;

  if (geometryConstructor === 'PlaneGeometry') {
    geometry = new THREE.PlaneGeometry(widthSize, heightSize, widthSize, heightSize);

    const lightRedColor = 0xc80000;
    const darkRedColor = 0x640000;

    geometry.faces.forEach((face, i) => {
      const color = i % 4 < 2 ? lightRedColor : darkRedColor;
      face.color.setHex(color);
    });
  } else if (geometryConstructor === 'Geometry') {
    geometry = new THREE.Geometry();

    const lightRedColor = 0xc80000;
    const darkRedColor = 0x640000;

    for (let i = 0; i <= widthSize; i++) {
      const color = i % 2 === 0 ? lightRedColor : darkRedColor;
      const x = i - widthSize / 2;

      for (let j = 0; j <= heightSize; j++) {
        // 创建点
        const y = j - heightSize / 2;
        const vector = new THREE.Vector3(x, -y, 0); // 从左上角开始添加顶点
        geometry.vertices.push(vector);

        if (i === widthSize || j === heightSize) continue;

        // 创建四角面，一个四角面由2个三角面组成
        const leftTopPointIndex = i * (heightSize + 1) + j; // 四角面左上角顶点的索引值
        const face1 = new THREE.Face3(leftTopPointIndex, leftTopPointIndex + 1, leftTopPointIndex + heightSize + 1);
        const face2 = new THREE.Face3(leftTopPointIndex + heightSize + 1, leftTopPointIndex + 1, leftTopPointIndex + heightSize + 2);

        face1.color.setHex(color);
        face2.color.setHex(color);

        geometry.faces.push(face1, face2);
      }
    }
  } else if (geometryConstructor === 'BufferGeometry') {
    geometry = new THREE.BufferGeometry();

    const lightRedColor = 0xc80000;
    const darkRedColor = 0x640000;

    const times = 2 * 3 * 3; // 一个四角面由2个三角面组成，一个三角面有3个顶点，一个顶点有3个坐标
    const size = widthSize * heightSize * times; // 一共有 widthSize * heightSize 个四角面
    const positions = new Float32Array(size);
    const colors = new Float32Array(size);

    const color = new THREE.Color();

    for (let i = 0; i < widthSize; i++) {
      const colorHex = i % 2 === 0 ? lightRedColor : darkRedColor;
      const { r, g, b } = color.setHex(colorHex);
      const x = i - widthSize / 2;

      for (let j = 0; j < heightSize; j++) {
        const k = (i * heightSize + j) * times;

        const y = j - heightSize / 2;

        // 设置顶点坐标，从左上角顶点开始添加
        positions[k] = x;
        positions[k + 1] = - y;
        positions[k + 2] = 0;

        positions[k + 12] = positions[k + 3] = x;
        positions[k + 13] = positions[k + 4] = - (y + 1);
        positions[k + 14] = positions[k + 5] = 0;

        positions[k + 9] = positions[k + 6] = x + 1;
        positions[k + 10] = positions[k + 7] = - y;
        positions[k + 11] = positions[k + 8] = 0;

        positions[k + 15] = x + 1;
        positions[k + 16] = - (y + 1);
        positions[k + 17] = 0;

        // 设置颜色
        for (let l = 0; l < times; l += 3) {
          colors[k + l] = r;
          colors[k + l + 1] = g;
          colors[k + l + 2] = b;
        }
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  } else {
    throw new Error('The third param must be a value of \
      \'Geometry\' or \'BufferGeometry\' or \'PlaneGeometry\'');
  }

  const material = new THREE.MeshBasicMaterial({ vertexColors: true });

  const plane = new THREE.Mesh(geometry, material);

  return plane;
}

// 添加外部重力和风力
function getOutsideForce() {
  const gravity = new THREE.Vector3(0, -1, 0); // 重力
  const windForce = new THREE.Vector3(0, 0, Math.random()); // 风力
  const combinedForce = new THREE.Vector3(); // 组合力
  combinedForce.addVectors(gravity, windForce);
  return combinedForce;
}

// 计算位移
function getDisplacement(force: THREE.Vector3, mass = 1, time = 1) {
  // v = a * t =  f / m * t = f * (t / m)
  // d = 0.5 * v * t
  const velocity = force.multiplyScalar(time / mass);
  const displacement = velocity.multiplyScalar(0.5 * time);

  return displacement;
}

// 添加位移
function addDisplacement(point: THREE.Vector3, displacement: THREE.Vector3) {
  if (!isPointFixed(point)) {
    point.addVectors(point, displacement);
  }
}

function fixPoint(point: THREE.Vector3) {
  // @ts-ignore
  point.isFixed = true;
}

function isPointFixed(point: THREE.Vector3) {
  // @ts-ignore
  return !!point.isFixed;
}