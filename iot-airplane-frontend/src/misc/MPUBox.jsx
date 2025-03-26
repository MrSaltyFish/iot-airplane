import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";

const MPUBox = () => {
  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    let socket;

    const connectWebSocket = () => {
      socket = new WebSocket("ws://localhost:3001");

      socket.onopen = () => console.log("✅ Connected to WebSocket!");

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📩 MPU6050 Data:", data);

          // Convert degrees to radians
          setRotation([
            (data.roll * Math.PI) / 180, // X-axis
            (data.yaw * Math.PI) / 180, // Y-axis
            (data.pitch * Math.PI) / 180, // Z-axis
          ]);
        } catch (err) {
          console.error("❌ JSON Parse Error:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket Error:", err);
      };

      socket.onclose = () => {
        console.log("⚠️ Disconnected! Reconnecting in 3s...");
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => socket && socket.close();
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <mesh rotation={rotation}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default MPUBox;
