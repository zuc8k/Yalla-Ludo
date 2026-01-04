require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/database");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");

// 🔥 Redis
const redis = require("./config/redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
const server = http.createServer(app);

// Socket.io Init
const io = new Server(server, {
  cors: { origin: "*" }
});

// 🧠 ربط Socket.io بـ Redis (Scaling)
io.adapter(createAdapter(redis, redis));

connectDB();

app.use(cors());
app.use(express.json());

// 🛡️ Rate Limit عام
app.use(apiLimiter);

// Routes
app.use("/api/voice", require("./routes/voice.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/shop", require("./routes/shop.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/leaderboard", require("./routes/leaderboard.routes"));

// Socket Handlers
require("./sockets")(io);

server.listen(process.env.PORT, () => {
  console.log(`🚀 Game Server running on port ${process.env.PORT}`);
});