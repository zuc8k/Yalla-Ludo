require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/database");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/voice", require("./routes/voice.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));

require("./sockets")(io);

server.listen(process.env.PORT, () => {
  console.log(`🚀 Game Server running on port ${process.env.PORT}`);
});