import React from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'stats.js';

const stats = new Stats();
// 以下设置均为默认值
stats.showPanel(0);
stats.dom.style.position = 'fixed';
stats.dom.style.left = '0';
stats.dom.style.top = '0';
stats.dom.style.opacity = '0.9';

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
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0088 });

  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = -5;

  scene.add(cube);

  camera.position.z = 20;

  renderer.setClearColor(0xffffff);

  const tween = new TWEEN.Tween(cube.position); // 参数是个任意的坐标对象
  tween.to({ y: 5 }, 3000)
    .repeat(Infinity)
    .yoyo(true)
    .start();

  render();

  function render() {
    stats.begin();
    renderer.render(scene, camera);
    // cube.position.y += 0.05;
    // if (cube.position.y >= 5) {
    //   cube.position.y = -5;
    // }
    TWEEN.update(); // 相当于把所有创建的tween实例都执行tween.update(TWEEN.now())，推荐直接这样用
    stats.end();
    requestAnimationFrame(render);
  }

  return renderer.domElement;
}