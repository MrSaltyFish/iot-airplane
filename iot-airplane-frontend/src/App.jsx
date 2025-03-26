import React, { useState, useEffect } from "react";
import FixingTextures from "./FixingTextures";

function App() {
  const [sensorData, setSensorData] = useState({
    pitch: 0,
    roll: 0,
    yaw: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.9:81");

    ws.onopen = () => {
      setConnectionStatus("Connected");
      setError(null);
      console.log("WebSocket Connected");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (
          data.pitch !== undefined &&
          data.roll !== undefined &&
          data.yaw !== undefined
        ) {
          setSensorData({
            pitch: parseFloat(data.pitch),
            roll: parseFloat(data.roll),
            yaw: parseFloat(data.yaw),
          });
        }
      } catch (err) {
        setError("Invalid data format");
        console.error("Parsing error:", err);
      }
    };

    ws.onerror = (err) => {
      setConnectionStatus("Error");
      setError("Connection error");
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected");
      console.log("WebSocket Disconnected");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="app-container">
      <h1>Aircraft Attitude Indicator</h1>
      <div className="status">
        <p>
          Status:{" "}
          <span className={connectionStatus.toLowerCase()}>
            {connectionStatus}
          </span>
        </p>
        {error && <p className="error">Error: {error}</p>}
      </div>

      <div className="sensor-data">
        <div>
          <h3>Pitch</h3>
          <p>{sensorData.pitch.toFixed(2)}°</p>
        </div>
        <div>
          <h3>Roll</h3>
          <p>{sensorData.roll.toFixed(2)}°</p>
        </div>
        <div>
          <h3>Yaw</h3>
          <p>{sensorData.yaw.toFixed(2)}°</p>
        </div>
      </div>

      <FixingTextures sensorData={sensorData} />
    </div>
  );
}

export default App;
