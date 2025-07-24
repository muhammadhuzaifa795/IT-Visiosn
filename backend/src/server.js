import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { inngest } from "./inngest/client.js";
import {serve} from "inngest/express";
import { generateRoadmapFn } from "./inngest/functions/roadmap.function.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import postRoutes from "./routes/post.route.js";
import aiRoutes from "./routes/ai.route.js";
import cvRoutes from "./routes/cv.route.js";
import commentRoutes from "./routes/comment.route.js";
import faceAuthRoutes from "./routes/face-auth.route.js";
import roadMapRoutes from "./routes/road-map.route.js";


// Socket emitter integration
import { setSocketIOInstance } from "./controllers/post.controller.js";
import { connectDB } from "./lib/db.js";

const app = express();
const server = http.createServer(app);

// 💡 DevTunnel and Local Origins
const allowedOrigins = [
  "http://localhost:5174",
  "https://k5dnkszc-5174.inc1.devtunnels.ms"
];

// Socket.io Setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join_post", (postId) => {
    socket.join(postId);
    console.log(`🔗 User joined room: ${postId}`);
  });

  socket.on("leave_post", (postId) => {
    socket.leave(postId);
    console.log(`❌ User left room: ${postId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

setSocketIOInstance(io);

// Middleware
const __dirname = path.resolve();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/post", postRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/face-auth", faceAuthRoutes);
app.use("/api/roadmap", roadMapRoutes);
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [generateRoadmapFn],
  })
);

// Static file serving in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  );
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  connectDB();
});

export { io };
