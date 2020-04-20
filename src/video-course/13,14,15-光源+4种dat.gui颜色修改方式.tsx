import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';

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
  const geometry = new THREE.BoxGeometry(50, 30, 20);
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  const mesh1 = new THREE.Mesh(geometry, material);
  const mesh2 = new THREE.Mesh(geometry, material);
  const mesh3 = new THREE.Mesh(geometry, material);
  const mesh4 = new THREE.Mesh(geometry, material);
  const mesh5 = new THREE.Mesh(geometry, material);
  const mesh6 = new THREE.Mesh(geometry, material);

  mesh1.position.set(0, 0, 0);
  mesh2.position.x = -80;
  mesh3.position.x = 80;
  mesh4.position.y = 50;
  mesh5.position.y = -50;
  mesh6.position.z = -40;

  const defaultLightOptions = {
    color: 0xff0000,
    intensity: 0,
    distance: 1000,
    decay: 1
  };

  const { color, intensity, distance, decay } = defaultLightOptions;

  // 环境光
  const ambientLight = new THREE.AmbientLight(color, intensity);

  // 平行光
  const directionalLight = new THREE.DirectionalLight(color, intensity);

  // 点光源，decay表示光线从发射点到distance位置时衰减的程度
  const pointLight = new THREE.PointLight(color, intensity, distance, decay);

  // 聚光灯
  const spotLight = new THREE.SpotLight(color, intensity, distance);

  const scene = new THREE.Scene();
  scene.rotation.y = -Math.PI / 6;
  scene.add(mesh1, mesh2, mesh3, mesh4, mesh5, mesh6);
  scene.add(ambientLight, directionalLight, pointLight, spotLight);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.y = 200;
  camera.position.z = 500;
  camera.lookAt(0, 100, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  createDatGUI({
    ambientLight,
    directionalLight,
    pointLight,
    spotLight
  });

  return renderer.domElement;
}

interface ControlTarget {
  ambientLight: THREE.AmbientLight
  directionalLight: THREE.DirectionalLight
  pointLight: THREE.PointLight
  spotLight: THREE.SpotLight
}

function createDatGUI(controlTarget: ControlTarget) {
  const gui = new dat.GUI({ name: 'Light Control' });

  const ambientLightFolder = gui.addFolder('Ambient Light');
  const ambientLight = { color: convertToStandardColor(controlTarget.ambientLight.color) };
  ambientLightFolder.addColor(ambientLight, 'color')
    .onChange((color) => {
      console.log(color); // 格式：{ r: 255, g: 255, b: 255 }
      const { r, g, b } = convertToThreeColor(color);
      controlTarget.ambientLight.color.setRGB(r, g, b);
    });
  ambientLightFolder.add(controlTarget.ambientLight, 'intensity', 0, 1);
  ambientLightFolder.add(controlTarget.ambientLight.position, 'x', 0, 1000).name('light pos x');
  ambientLightFolder.add(controlTarget.ambientLight.position, 'y', 0, 1000).name('light pos y');
  ambientLightFolder.add(controlTarget.ambientLight.position, 'z', 0, 1000).name('light pos z');
  ambientLightFolder.open();

  const directionalLightFolder = gui.addFolder('Directional Light');
  const directionalLight = { color: controlTarget.directionalLight.color.getHex() };
  directionalLightFolder.addColor(directionalLight, 'color')
    .onChange((color) => {
      console.log(color); // 格式：16711680
      controlTarget.directionalLight.color.setHex(color);
    });
  directionalLightFolder.add(controlTarget.directionalLight, 'intensity', 0, 1);
  directionalLightFolder.add(controlTarget.directionalLight.position, 'x', 0, 1000).name('light pos x');
  directionalLightFolder.add(controlTarget.directionalLight.position, 'y', 0, 1000).name('light pos y');
  directionalLightFolder.add(controlTarget.directionalLight.position, 'z', 0, 1000).name('light pos z');
  // directionalLightFolder.open();

  const pointLightFolder = gui.addFolder('Point Light');
  const pointLight = { color: '#' + controlTarget.pointLight.color.getHexString() };
  pointLightFolder.addColor(pointLight, 'color')
    .onChange((color) => {
      console.log(color); // 格式：#ffffff
      console.log(controlTarget.pointLight);
      controlTarget.pointLight.color.setStyle(color);
    });
  pointLightFolder.add(controlTarget.pointLight, 'intensity', 0, 1);
  pointLightFolder.add(controlTarget.pointLight.position, 'x', 0, 1000).name('light pos x');
  pointLightFolder.add(controlTarget.pointLight.position, 'y', 0, 1000).name('light pos y');
  pointLightFolder.add(controlTarget.pointLight.position, 'z', 0, 1000).name('light pos z');
  // pointLightFolder.open();

  const spotLightFolder = gui.addFolder('Spot Light');
  const spotLight = { color: controlTarget.spotLight.color.getStyle() };
  spotLightFolder.addColor(spotLight, 'color')
    .onChange((color) => {
      console.log(color); // 格式：rgb(255,255,255)
      controlTarget.spotLight.color.setStyle(color);
    });
  spotLightFolder.add(controlTarget.spotLight, 'intensity', 0, 1);
  spotLightFolder.add(controlTarget.spotLight.position, 'x', 0, 1000).name('light pos x');
  spotLightFolder.add(controlTarget.spotLight.position, 'y', 0, 1000).name('light pos y');
  spotLightFolder.add(controlTarget.spotLight.position, 'z', 0, 1000).name('light pos z');
  // spotLightFolder.open();
}

function convertToStandardColor({ r, g, b }) {
  return { r: r * 255, g: g * 255, b: b * 255 };
}
function convertToThreeColor({ r, g, b }) {
  return { r: r / 255, g: g / 255, b: b / 255 };
}