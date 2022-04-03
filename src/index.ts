import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CONFIG } from './config';

const positionKeyframeTrackJSON = {
  name: '.position',
  type: 'vector',
  times: [0, 1, 2],
  values: [0, 0, 0, 2, 1, 15, 0, 0, 0]
};

const rotationKeyframeTrackJSON = {
  name: '.rotation[y]',
  type: 'number',
  times: [0, 2],
  values: [0, 2 * Math.PI],
  interpolation: THREE.InterpolateSmooth
};

const clipJSON = {
  duration: 2,
  tracks: [positionKeyframeTrackJSON, rotationKeyframeTrackJSON]
};
const clip = THREE.AnimationClip.parse(clipJSON);

const materials: THREE.MeshBasicMaterial[] = [
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.re }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.bl }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.gr }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.ye }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.or }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.wh }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.re })
];

function createCubeGroup(): THREE.Group {
  const { width, height, depth } = CONFIG.cube.size;
  const group: THREE.Group = new THREE.Group();
  [-1, 0, 1].forEach((x) => {
    [-1, 0, 1].forEach((y) => {
      [-1, 0, 1].forEach((z) => {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(width - 20, height - 20, depth - 20);
        const cube: THREE.Mesh = new THREE.Mesh(geometry, materials);
        cube.position.set(x * width, y * height, z * depth);
        group.add(cube);
      });
    });
  });
  return group;
}

window.onload = function () {
  const scene: THREE.Scene = new THREE.Scene();

  // Camera
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 10000);
  camera.position.set(0, 0, 1000);

  const pointLight = new THREE.PointLight(CONFIG.light.color);
  camera.add(pointLight);

  scene.add(camera);

  // Cube
  const cube: THREE.Group = createCubeGroup();
  scene.add(cube);

  // Light
  const light: THREE.DirectionalLight = new THREE.DirectionalLight(CONFIG.light.color);
  light.position.set(1, 1, 1);

  scene.add(light);

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(CONFIG.backGround.color);
  document.body.appendChild(renderer.domElement);

  const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);

  // Helpers
  const axes = new THREE.AxesHelper(1000);
  scene.add(axes);

  // const grid = new THREE.GridHelper(window.innerWidth, window.innerHeight);
  // scene.add(grid);

  // Animaation
  var mixer = new THREE.AnimationMixer(cube);
  var action = mixer.clipAction(clip);
  action.play();

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const tick = (): void => {
    requestAnimationFrame(tick);

    mixer.update(0.01);
    controls.update();
    renderer.render(scene, camera);
  };

  tick();
};
