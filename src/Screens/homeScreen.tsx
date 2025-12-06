import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from "react-native-gesture-handler";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import { RotatingCube } from "../../App";
import {
  createPanGesture,
  createTapGesture,
  setupScene,
  createBoxes,
  updateRotatingCubes,
} from "../components/camFuntions";

const HomeScreen = () => {
  const [total, setTotal] = useState(0);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);
  const rotatingCubesRef = useRef<RotatingCube[]>([]);

  const panGesture = createPanGesture(cameraRef);
  const tapGesture = createTapGesture(
    cameraRef,
    clickableObjectsRef,
    rotatingCubesRef,
    setTotal,
    total
  );
  const combinedGesture = Gesture.Race(tapGesture, panGesture);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={{ fontSize: 18, textAlign: "center", marginTop: 40 }}>
          Toca un cubo para girarlo o arrastra para mover la cámara: {total}
        </Text>
        <StatusBar barStyle="dark-content" />
      </View>
      <GestureDetector gesture={combinedGesture}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={async (gl) => {
            const renderer = new Renderer({ gl }) as any;
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            const camera = new THREE.PerspectiveCamera(
              45,
              window.innerWidth / window.innerHeight,
              1,
              10000
            );
            camera.position.set(0, 3000, 0);
            camera.lookAt(0, 0, 0);
            cameraRef.current = camera;

            const scene = setupScene();
            createBoxes(scene, clickableObjectsRef);

            const render = () => {
              requestAnimationFrame(render);
              updateRotatingCubes(
                rotatingCubesRef,
                renderer,
                scene,
                camera,
                gl
              );
            };

            render();
          }}
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 130,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    zIndex: 1,
  },
});
