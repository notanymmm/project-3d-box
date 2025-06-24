import * as THREE from 'three';

let scene, camera, renderer, box, lid, textSprite;
let isDragging = false,
  previousY = 0,
  textAnimated = false;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  const boxGeometry = new THREE.BoxGeometry(2, 1, 2);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8844ff });
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(box);

  const lidGeometry = new THREE.BoxGeometry(2, 0.1, 2);
  const lidMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  lid = new THREE.Mesh(lidGeometry, lidMaterial);
  lid.position.y = 0.55;
  lid.position.z = 0;
  lid.rotation.x = 0;
  scene.add(lid);

  // Tạo canvas cho văn bản 2D
  const canvas = document.createElement('canvas');
  canvas.width = 1024; // Tăng kích thước canvas
  canvas.height = 256;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffcc00'; // Màu vàng
  context.font = '60px Arial'; // Tăng kích thước font
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText('xin chào bạn đã đến web của Nghĩa đẹp trai', 20, 128);

  // Tạo texture từ canvas
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  textSprite = new THREE.Sprite(spriteMaterial);
  textSprite.position.set(-2.5, 1.7, 0); // Điều chỉnh vị trí
  textSprite.scale.set(5, 1.25, 1); // Tăng tỷ lệ để hiển thị rõ
  textSprite.visible = false;
  scene.add(textSprite);

  window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousY = e.clientY;
  });
  window.addEventListener('mouseup', () => (isDragging = false));
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - previousY;
    previousY = e.clientY;
    lid.rotation.x = Math.min(
      Math.max(lid.rotation.x - deltaY * 0.01, 0),
      Math.PI / 2
    );
  });

  window.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousY = e.touches[0].clientY;
  });
  window.addEventListener('touchend', () => (isDragging = false));
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - previousY;
    previousY = e.touches[0].clientY;
    lid.rotation.x = Math.min(
      Math.max(lid.rotation.x - deltaY * 0.01, 0),
      Math.PI / 2
    );
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (lid.rotation.x > Math.PI / 4 && textSprite && !textAnimated) {
    textSprite.visible = true;
    textAnimated = true;
  }

  renderer.render(scene, camera);
}