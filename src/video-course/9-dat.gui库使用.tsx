import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';

export default class Course extends React.Component<any, any>{

  private rootRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const { canvas: canvasElement1, light, render: rerenderLight } = create3DRender(Types.Orthographic);
    const { canvas: canvasElement2, camera, render: rerenderCamera } = create3DRender(Types.Perspective);
    this.rootRef.current!.appendChild(canvasElement1);
    this.rootRef.current!.appendChild(canvasElement2);

    createDatGUI({
      [ControlKeys.light]: light!,
      [ControlKeys.camera]: camera!,
      callbacks: {
        onLightColorChange(hexColor) {
          light!.color.setStyle(hexColor); // hexColor格式需要为#开头而不是0x开头
          rerenderLight();
        },
        onCameraFovChange(fov) {
          camera!.fov = fov;
          camera!.updateProjectionMatrix();
          rerenderCamera();
        },
        onCameraPositonXChange(x) {
          camera!.position.x = x;
          rerenderCamera();
        },
        onCameraPositonYChange(y) {
          camera!.position.y = y;
          rerenderCamera();
        },
        onCameraPositonZChange(z) {
          camera!.position.z = z;
          rerenderCamera();
        }
      }
    });
  }

  public render() {
    return (
      <div ref={this.rootRef} style={{ fontSize: 0 }}></div>
    );
  }
}

enum Types {
  Orthographic = 'orthographic',
  Perspective = 'perspective'
}

interface RenderRes {
  canvas: HTMLCanvasElement,
  light?: THREE.Light,
  camera?: THREE.PerspectiveCamera
  render: Function
}

function create3DRender(type: Types): RenderRes {
  const geometry = new THREE.CylinderGeometry(70, 100, 150, 30);
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(geometry, material);

  const light = new THREE.DirectionalLight(0xff0000);
  light.position.set(-150, 300, 1000);

  const scene = new THREE.Scene();
  scene.add(mesh, light);

  let camera;
  if (type === Types.Orthographic) {
    camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 4, -window.innerHeight / 4, 1, 10000);
  } else if (type === Types.Perspective) {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight / 2), 1, 10000);
  }
  camera.position.y = 300;
  camera.position.z = 1000;
  camera.up.set(1, 2, 0); // 控制相机旋转，设置的点坐标在相机正上方向和正前方向构成的平面内
  camera.lookAt(0, 0, 0); // 必须在up设置之后

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight / 2);
  renderer.setClearColor(0xffffff);

  render();

  function render() {
    renderer.render(scene, camera);
  }

  return {
    canvas: renderer.domElement,
    light,
    camera,
    render
  };
}

enum ControlKeys {
  light = 'Light',
  camera = 'Camera'
}

interface ControlTarget {
  [ControlKeys.light]: THREE.Light
  [ControlKeys.camera]: THREE.PerspectiveCamera
  callbacks: ControlTargetCallbacks
}

interface ControlTargetCallbacks {
  onLightColorChange: (hexColor: string) => void
  onCameraPositonXChange: (x: number) => void
  onCameraPositonYChange: (y: number) => void
  onCameraPositonZChange: (z: number) => void
  onCameraFovChange: (fov: number) => void
}

function createDatGUI(controlTarget: ControlTarget) {
  const gui = new dat.GUI({ name: 'GUI Panel', autoPlace: true });
  gui.domElement.style.float = 'left';
  gui.domElement.style.opacity = '0.7';

  const folder1 = gui.addFolder('Folder 1');
  const lightColor = controlTarget[ControlKeys.light].color;
  const computedLightColor = { hex: '#' + lightColor.getHexString() };
  const lightColorControl = folder1.addColor(computedLightColor, 'hex').name(ControlKeys.light + ' Color');
  lightColorControl.onFinishChange(controlTarget.callbacks.onLightColorChange); // 回调函数接收修改后的颜色值作为参数
  folder1.open();

  const folder2 = gui.addFolder('Folder 2');
  const camera = controlTarget[ControlKeys.camera];
  const cameraFovControl = folder2.add(camera, 'fov', 0, 100).name(ControlKeys.camera + ' Fov');
  cameraFovControl.onChange(controlTarget.callbacks.onCameraFovChange);
  const cameraPositionXControl = folder2.add(camera.position, 'x', -200, 200).name(ControlKeys.camera + ' Pos X');
  cameraPositionXControl.onChange(controlTarget.callbacks.onCameraPositonXChange);
  const cameraPositionYControl = folder2.add(camera.position, 'y', 0, 1000).name(ControlKeys.camera + ' Pos Y');
  cameraPositionYControl.onChange(controlTarget.callbacks.onCameraPositonYChange);
  const cameraPositionZControl = folder2.add(camera.position, 'z', 100, 2000).name(ControlKeys.camera + ' Pos Z');
  cameraPositionZControl.onChange(controlTarget.callbacks.onCameraPositonZChange);
  folder2.open();
}