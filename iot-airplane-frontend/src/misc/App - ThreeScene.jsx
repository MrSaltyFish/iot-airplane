import React, { useState, useEffect } from "react";
import ThreeScene from "./ThreeScene";
import NewScene from "./NewScene";

function App() {
  const [sensorData, setSensorData] = useState({
    pitch: 0,
    roll: 0,
    yaw: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Create WebSocket connection
    const websocket = new WebSocket("ws://192.168.1.9:81");

    websocket.onopen = () => {
      console.log("Connected to ESP32 WebSocket");
      setConnectionStatus("Connected to ESP32");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData({
          pitch: data.pitch || 0,
          roll: data.roll || 0,
          yaw: data.yaw || 0,
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Connection error");
    };

    websocket.onclose = () => {
      console.log("Disconnected from ESP32");
      setConnectionStatus("Disconnected");
    };

    // Cleanup function
    return () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>ESP32 MPU6050 Data</h1>
      <p>Status: {connectionStatus}</p>
      <div style={{ marginBottom: "20px" }}>
        <h2>Sensor Values:</h2>
        <p>Pitch: {sensorData.pitch.toFixed(2)}°</p>
        <p>Roll: {sensorData.roll.toFixed(2)}°</p>
        <p>Yaw: {sensorData.yaw.toFixed(2)}°</p>
      </div>
      <ThreeScene sensorData={sensorData} />
    </div>
  );
}

export default App;
