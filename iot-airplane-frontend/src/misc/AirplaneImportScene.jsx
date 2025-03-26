import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Airplane({ pitch, roll, yaw }) {
  return (
    <group
      rotation={[
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(-roll),
      ]}
    >
      <Suspense fallback={null}>
        <Model url="/airplane.glb" />
      </Suspense>
    </group>
  );
}

export default function ThreeScene({ sensorData }) {
  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Airplane
          pitch={sensorData.pitch}
          roll={sensorData.roll}
          yaw={sensorData.yaw}
        />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

// Preload model
useGLTF.preload("/airplane.glb");
