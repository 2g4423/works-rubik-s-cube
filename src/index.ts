import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('load', () => {
  const scene: THREE.Scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 10000);
  camera.position.set(0, 0, 1000);

  const pointLight = new THREE.PointLight(0xffffff);
  camera.add(pointLight);

  const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  scene.add(camera);

  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(100, 100, 100);
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube: THREE.Mesh = new THREE.Mesh(geometry, material);

  scene.add(cube);

  const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);

  scene.add(light);

  const tick = (): void => {
    requestAnimationFrame(tick);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;

    renderer.render(scene, camera);
  };

  tick();
});
