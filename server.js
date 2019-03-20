// Dependencies
const express = require("express");
const server = express();

// Middleware
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const corsConfig = require("./middleware/corsConfig.js");

server.use(logger("tiny"));
server.use(cors(corsConfig));
server.use(helmet());
server.use(express.json());

// Sanity check
server.get("/", (req, res) => {
  res.send(`It works.`);
});

// Routes
const exampleRoutes = require("./routes/exampleRoutes");
const usersRouter = require("./routes/users-router.js");
const authRouter = require("./routes/auth-router.js");
const instructorsRouter = require("./routes/instructors-router.js");
// Endpoints
server.use("/api/exampleEndpoint", exampleRoutes);
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/instructors", instructorsRouter);

module.exports = server;
