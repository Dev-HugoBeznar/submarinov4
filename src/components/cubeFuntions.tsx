import { THREE } from "expo-three";
import { RotatingCube } from "./camFuntions";
import { useGridSize } from "../context/context";

export const createBoxes = (
  scene: THREE.Scene,
  clickableObjectsRef: React.MutableRefObject<THREE.Object3D[]>
) => {
  const size = useGridSize.getState().size;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
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
