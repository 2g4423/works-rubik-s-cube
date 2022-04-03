import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('load', () => {
  const scene: THREE.Scene = new THREE.Scene();

  // Camera
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 10000);
  camera.position.set(0, 0, 1000);

  const pointLight = new THREE.PointLight(0xffffff);
  camera.add(pointLight);

  scene.add(camera);

  // Cube
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(100, 100, 100);
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube: THREE.Mesh = new THREE.Mesh(geometry, material);

  scene.add(cube);

  // Light
  const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);

  scene.add(light);

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // Helpers
  const axes = new THREE.AxesHelper(1000);
  scene.add(axes);

  // const grid = new THREE.GridHelper(window.innerWidth, window.innerHeight);
  // scene.add(grid);

  const tick = (): void => {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
});
