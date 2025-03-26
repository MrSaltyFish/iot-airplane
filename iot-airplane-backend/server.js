const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

// ESP32 WebSocket details (CAN'T MODIFY THESE)
const ESP32_WS_URL = "ws://192.168.1.9:81";
let esp32Socket = null;

// Serve React app
app.use(express.static(path.join(__dirname, "build")));

// WebSocket Server for React clients
const wss = new WebSocket.Server({ server });

// Connect to ESP32 WebSocket
function connectToESP32() {
  esp32Socket = new WebSocket(ESP32_WS_URL);

  esp32Socket.on("open", () => {
    console.log(`Connected to ESP32 at ${ESP32_WS_URL}`);
  });

  esp32Socket.on("message", (data) => {
    try {
      // Log raw data from ESP32
      console.log("ESP32 Data:", data.toString());

      // Broadcast to all React clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    } catch (err) {
      console.error("Error handling ESP32 data:", err);
    }
  });

  esp32Socket.on("close", () => {
    console.log("Disconnected from ESP32. Reconnecting in 5s...");
    setTimeout(connectToESP32, 5000);
  });

  esp32Socket.on("error", (err) => {
    console.error("ESP32 WebSocket error:", err);
  });
}

// Handle React client connections
wss.on("connection", (ws) => {
  console.log("New React client connected");

  ws.on("close", () => {
    console.log("React client disconnected");
  });
});

// Start ESP32 connection
connectToESP32();

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`React WebSocket available on ws://localhost:${PORT}`);
});
