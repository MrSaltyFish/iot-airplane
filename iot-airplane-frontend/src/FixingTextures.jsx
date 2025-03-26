import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  // Center the model after loading
  React.useEffect(() => {
    if (groupRef.current) {
      // Calculate bounding box to center model
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const center = box.getCenter(new THREE.Vector3());

      // Offset the model to center its pivot point
      groupRef.current.position.x -= center.x;
      groupRef.current.position.y -= center.y;
      groupRef.current.position.z -= center.z;
    }
  }, []);

  return <primitive ref={groupRef} object={scene} />;
}

function Airplane({ pitch, roll, yaw }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Apply rotations (with your calibration offsets)
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(pitch - 5.12),
        THREE.MathUtils.degToRad(-(yaw - 84.76)),
        THREE.MathUtils.degToRad(roll - 1.15)
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        {" "}
        {/* This helps with centering */}
        <Suspense fallback={null}>
          <Model url="/airplane.glb" />
        </Suspense>
      </Center>
    </group>
  );
}

export default function ThreeScene({ sensorData }) {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="dawn" />

        <Airplane
          pitch={sensorData.pitch}
          roll={sensorData.roll}
          yaw={sensorData.yaw}
        />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/airplane.glb");
