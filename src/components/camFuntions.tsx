import { THREE } from "expo-three";
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";

export interface RotatingCube {
  object: THREE.Object3D;
  progress: number; // 0 a 1, controla animación
  originalRotation: THREE.Euler;
}

export const createPanGesture = (
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>
) => {
  return Gesture.Pan().onUpdate(
    (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      const camera = cameraRef.current;
      if (!camera) return;
      const speed = 0.1;
      camera.position.x -= event.translationX * speed;
      camera.position.z -= event.translationY * speed;
    }
  );
};

export const createTapGesture = (
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
  clickableObjectsRef: React.MutableRefObject<THREE.Object3D[]>,
  rotatingCubesRef: React.MutableRefObject<RotatingCube[]>,
  setTotal: (value: number) => void,
  currentTotal: number
) => {
  return Gesture.Tap().onEnd(
    (event: GestureUpdateEvent<TapGestureHandlerEventPayload>) => {
      const camera = cameraRef.current;
      const { absoluteX, absoluteY } = event;
      const x = (absoluteX / window.innerWidth) * 2 - 1;
      const y = -(absoluteY / window.innerHeight) * 2 + 1;

      const pointerVector = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointerVector, camera);

      const intersects = raycaster.intersectObjects(
        clickableObjectsRef.current,
        true
      );
      if (intersects.length > 0) {
        const firstIntersectedObject = intersects[0].object;
        firstIntersectedObject.material.color.set(0xff0000);
        rotatingCubesRef.current.push({
          object: firstIntersectedObject,
          progress: 0,
          originalRotation: firstIntersectedObject.rotation.clone(),
        });

        console.log("Encontrado:", firstIntersectedObject.name);
      }
    }
  );
};

export const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const gridHelper = new THREE.GridHelper(1000, 20);
  scene.add(gridHelper);

  const ambientLight = new THREE.AmbientLight(0x606060, 3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);

  return scene;
};

export const createBoxes = (
  scene: THREE.Scene,
  clickableObjectsRef: React.MutableRefObject<THREE.Object3D[]>
) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
      const MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color: "blue",
        opacity: 0.5,
        transparent: true,
      });
      const box = new THREE.Mesh(boxGeometry, MeshBasicMaterial);
      box.position.set(i * 60 - 200, 0, j * 60 - 200);
      box.name = `Box_${i}_${j}`;
      scene.add(box);
      clickableObjectsRef.current.push(box);
    }
  }
};

export const updateRotatingCubes = (
  rotatingCubesRef: React.MutableRefObject<RotatingCube[]>,
  renderer: any,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  gl: any
) => {
  rotatingCubesRef.current.forEach((cube, index) => {
    const duration = 20;
    cube.progress += 1 / duration;

    if (cube.progress < 0.5) {
      cube.object.rotation.y =
        cube.originalRotation.y + Math.PI * cube.progress * 2;
    } else if (cube.progress <= 1) {
      const t = (cube.progress - 0.5) * 2;
      cube.object.rotation.y = THREE.MathUtils.lerp(
        cube.originalRotation.y + Math.PI,
        cube.originalRotation.y,
        t
      );
    } else {
      cube.object.rotation.copy(cube.originalRotation);
      rotatingCubesRef.current.splice(index, 1);
    }
  });
  renderer.render(scene, camera);
  gl.endFrameEXP();
};
