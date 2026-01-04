require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// ================== Core ==================
const connectDB = require("./config/database");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");

// ================== Redis ==================
const redis = require("./config/redis");
const { createAdapter } = require("@socket.io/redis-adapter");

// ================== Monitoring ==================
const logger = require("./utils/logger");
require("./utils/memory.watch"); // Memory alerts

// ================== App Init ==================
const app = express();
const server = http.createServer(app);

// ================== Socket.io ==================
const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔥 Redis Adapter (Scaling)
io.adapter(createAdapter(redis, redis));

// ================== Database ==================
connectDB();

// ================== Middlewares ==================
app.use(cors());
app.use(express.json());

// 🛡️ Global Rate Limit
app.use(apiLimiter);

// ================== Routes ==================
app.use("/health", require("./routes/health.routes")); // Monitoring
app.use("/api/voice", require("./routes/voice.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/shop", require("./routes/shop.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/leaderboard", require("./routes/leaderboard.routes"));

// ================== Socket Handlers ==================
require("./sockets")(io);

// ================== Server Start ==================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`🚀 Game Server running on port ${PORT}`);
  console.log(`🚀 Game Server running on port ${PORT}`);
});

// ================== Global Error Handling ==================
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection", err);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", err);
});