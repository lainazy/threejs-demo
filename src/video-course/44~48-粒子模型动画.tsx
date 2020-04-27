import React from 'react';
import * as THREE from 'three';
import Stats from 'stats.js';
import TWEEN from '@tweenjs/tween.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

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

  loadModel(require('../assets/models/hestia.obj')).then((model) => {
    model.scale.setScalar(300);
    const { x, y, z } = getBoxKeypoints(model).center;

    const color = 0xffffff * Math.random();
    const material = new THREE.PointsMaterial({ color, size: 5 });

    const tweenGroups: TWEEN.Group[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = getCloneGeometryFromGeometry(child.geometry);

        const points = new THREE.Points(geometry, material);
        points.scale.set(model.scale.x, model.scale.y, model.scale.z);
        points.position.set(-x, -y, -z);

        scene.add(points);

        const tweenGroup = setPointAnimation(geometry);
        tweenGroups.push(tweenGroup);
      } else {
        // 这里其实应该要做递归，这里暂不处理复杂情况
      }
    });

    animate();

    function animate() {
      stats.begin();
      tweenGroups.forEach((tweenGroup) => {
        tweenGroup.update();
      });
      render();
      stats.end();
      requestAnimationFrame(animate);
    }
  });

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    renderer.render(scene, camera);
  }

  return renderer.domElement;
}

function loadModel(url: string) {
  return new Promise((resolve: (group: THREE.Group) => void, reject) => {
    const objLoader = new OBJLoader();
    objLoader.load(url, resolve,
      (event) => { console.log('Model Load Progress:', event); },
      (envent) => {
        console.log('Model Load Error:', event);
        reject(event);
      });
  });
}

function getBoxKeypoints(object: THREE.Object3D | THREE.Geometry | THREE.BufferGeometry) {
  const box3 = new THREE.Box3();

  if (object instanceof THREE.Object3D) {
    box3.setFromObject(object);
  } else if (object instanceof THREE.Geometry) {
    box3.setFromPoints(object.vertices);
  } else if (object instanceof THREE.BufferGeometry) {
    if (!object.attributes.hasOwnProperty('position')) { // eslint-disable-line no-prototype-builtins
      throw new Error('buffer geometry instance has no attribute of position.');
    }

    box3.setFromArray(object.attributes.position.array);
  }

  const vector = new THREE.Vector3();
  const center = box3.getCenter(vector); // 返回的就是vector这个顶点对象，完全没搞懂传入vector的意义何在

  const xPositiveFaceCenter = center.clone().setX(box3.max.x);
  const xNegativeFaceCenter = center.clone().setX(box3.min.x);
  const yPositiveFaceCenter = center.clone().setY(box3.max.y);
  const yNegativeFaceCenter = center.clone().setY(box3.min.y);
  const zPositiveFaceCenter = center.clone().setZ(box3.max.z);
  const zNegativeFaceCenter = center.clone().setZ(box3.min.z);

  return {
    center,
    xPositiveFaceCenter,
    xNegativeFaceCenter,
    yPositiveFaceCenter,
    yNegativeFaceCenter,
    zPositiveFaceCenter,
    zNegativeFaceCenter
  };
}

function getCloneGeometryFromGeometry(geometry: THREE.Geometry | THREE.BufferGeometry) {
  let cloneGeometry: THREE.Geometry;

  if (geometry instanceof THREE.Geometry) {
    cloneGeometry = geometry.clone();
  } else if (geometry instanceof THREE.BufferGeometry) {
    if (!geometry.attributes.hasOwnProperty('position')) { // eslint-disable-line no-prototype-builtins
      throw new Error('buffer geometry instance has no attribute of position.');
    }

    cloneGeometry = new THREE.Geometry();

    const bufferArray = geometry.attributes.position.array;
    const itemSize = geometry.attributes.position.itemSize;

    for (let i = 0; i < bufferArray.length; i += itemSize) {
      const x = bufferArray[i];
      const y = bufferArray[i + 1];
      const z = bufferArray[i + 2];
      const vector = new THREE.Vector3(x, y, z);
      cloneGeometry.vertices.push(vector);
    }
  } else {
    throw new Error('param isn\'t a THREE.Geometry or THREE.BufferGeometry instance.');
  }

  return cloneGeometry;
}

function getCloneVerticesFromGeometry(geometry: THREE.Geometry | THREE.BufferGeometry) {
  const vertices: THREE.Vector3[] = [];

  if (geometry instanceof THREE.Geometry) {
    geometry.vertices.forEach((vector) => {
      vertices.push(vector.clone());
    });
  } else if (geometry instanceof THREE.BufferGeometry) {
    if (!geometry.attributes.hasOwnProperty('position')) { // eslint-disable-line no-prototype-builtins
      throw new Error('buffer geometry instance has no attribute of position.');
    }

    const bufferArray = geometry.attributes.position.array;
    const itemSize = geometry.attributes.position.itemSize;

    for (let i = 0; i < bufferArray.length; i += itemSize) {
      const x = bufferArray[i];
      const y = bufferArray[i + 1];
      const z = bufferArray[i + 2];
      const vector = new THREE.Vector3(x, y, z);
      vertices.push(vector);
    }
  } else {
    throw new Error('param isn\'t a THREE.Geometry or THREE.BufferGeometry instance.');
  }

  return vertices;
}

function setPointAnimation(geometry: THREE.Geometry) {
  const tweenGroup = new TWEEN.Group();

  const { x, y, z } = getBoxKeypoints(geometry).yNegativeFaceCenter;

  geometry.vertices.forEach((vector) => {
    const randomX = x * Math.random() - x / 2;
    const randomZ = z * Math.random() - z / 2;

    const tween = new TWEEN.Tween(vector);
    tween.to({ x: randomX * 20, y, z: randomZ * 20 }, 1000)
      .repeat(Infinity)
      .repeatDelay(1000)
      .yoyo(true)
      .easing(TWEEN.Easing.Back.InOut)
      .onUpdate(() => {
        geometry.verticesNeedUpdate = true;
      })
      .start();

    tweenGroup.add(tween);
  });

  return tweenGroup;
}
