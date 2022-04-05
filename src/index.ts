import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CONFIG } from './config';

const materials: THREE.MeshBasicMaterial[] = [
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.re }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.bl }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.gr }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.ye }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.or }),
  new THREE.MeshBasicMaterial({ color: CONFIG.cube.color.wh })
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

  const target: THREE.Group = new THREE.Group();
  scene.add(target);

  // マウスイベントを登録
  let isMouseDown = false;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
  renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
  renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
  window.addEventListener('resize', handleWindowresize, false);

  function onDocumentMouseDown(event: any) {
    event.preventDefault();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(cube.children);

    if (intersects.length > 0) {
      isMouseDown = true;
      controls.enabled = false;

      const intersect = intersects[0].object;
      console.log(intersect);
      cube.children.filter((e) => e.position.y === intersect.position.y).forEach((e) => target.add(e));
    }
  }

  function onDocumentMouseMove(event: any) {
    event.preventDefault();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (isMouseDown) {
      target.rotation.y -= pointer.y;
    }
  }

  function onDocumentMouseUp(event: any) {
    event.preventDefault();

    controls.enabled = true;
    isMouseDown = false;
  }

  function handleWindowresize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  const tick = (): void => {
    requestAnimationFrame(tick);

    controls.update();
    renderer.render(scene, camera);
  };

  tick();
};
