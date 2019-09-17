const express = require("express");
const cors = require("cors"); // allows for 2 diff servers to communciate w/ eachother
const helmet = require("helmet");
const server = express();
const dbConnection = require("./database/dbConfig");
const session = require("express-session");
// this below library has to come AFTER session above
const KnexSessionStore = require("connect-session-knex")(session);

// the order matters! place this things in correct order of which you need to use them
const sessionConfig = {
  name: "mycookie",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
  cookie: {
    maxAge: 1000 * 60 * 60, // in milliseconds
    security: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: dbConnection,
    createTable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(sessionConfig));

const UsersRouter = require("./users/users-router");

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use("/api/users", UsersRouter);

server.get("/", (req, res) => {
  res.send("Server is up and running!");
});

module.exports = server;
