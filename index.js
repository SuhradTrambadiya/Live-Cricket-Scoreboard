// index.js or server.js (your main file)
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { dbConnection } from "./src/Database/DBconnection.js";
import teamRoutes from "./src/Routes/Team.Routes.js";
import playerRoutes from "./src/Routes/Player.Routes.js";
import LiveScoreRoutes from "./src/Routes/Live-Score.Routes.js";
import matchRoutes from "./src/Routes/Match.Routes.js"; 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
dbConnection();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.static("public")); // if serving static frontend files

// ✅ Register API routes
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes)
app.use("/api", LiveScoreRoutes);

// ✅ Setup Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected!");

  socket.emit("message", "Hello, world!");

  socket.on("chatMessage", (msg) => {
    console.log("Received message:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


