import { THREE } from "expo-three";
import { use } from "react";
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useLayoutStore } from "../context/context";

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
  rotatingCubesRef: React.MutableRefObject<RotatingCube[]>
) => {
  return Gesture.Tap().onEnd(
    (event: GestureUpdateEvent<TapGestureHandlerEventPayload>) => {
      const camera = cameraRef.current;
      const layout = useLayoutStore.getState().layout;
      const { absoluteX, absoluteY } = event;

      const viewx = absoluteX - layout.x;
      const viewy = absoluteY - layout.y;
      if (!camera) return;
      const x = (viewx / layout.width) * 2 - 1;
      const y = -(viewy / layout.height) * 2 + 1;

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
