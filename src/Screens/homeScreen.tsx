import {
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { use, useRef, useState } from "react";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from "react-native-gesture-handler";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import {
  createPanGesture,
  createTapGesture,
  setupScene,
  RotatingCube,
} from "../components/camFuntions";
import { createBoxes, updateRotatingCubes } from "../components/cubeFuntions";
import { useLayoutStore } from "../context/context";

const HomeScreen = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);
  const rotatingCubesRef = useRef<RotatingCube[]>([]);

  const panGesture = createPanGesture(cameraRef);
  const tapGesture = createTapGesture(
    cameraRef,
    clickableObjectsRef,
    rotatingCubesRef
  );
  const combinedGesture = Gesture.Race(tapGesture, panGesture);

  const { setLayout } = useLayoutStore();

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Text style={{ fontSize: 18, textAlign: "center", marginTop: 40 }}>
          Toca un cubo para girarlo o arrastra para mover la cámara:
        </Text>
        <StatusBar barStyle="dark-content" />
      </View>
      <GestureDetector gesture={combinedGesture}>
        <GLView
          style={{ flex: 1 }}
          onLayout={(e) => {
            const { x, y, width, height } = e.nativeEvent.layout;
            setLayout({ x, y, width, height });
          }}
          onContextCreate={async (gl) => {
            const renderer = new Renderer({ gl }) as any;
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            const camera = new THREE.PerspectiveCamera(
              45,
              gl.drawingBufferWidth / gl.drawingBufferHeight,
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
