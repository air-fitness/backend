// Dependencies
const express = require('express');
const server = express();

// Middleware
const configureMiddleware = require('./config/middleware');

configureMiddleware(server);

// Sanity check
server.get('/', (req, res) => {
	res.send(`It works.`);
});

// Routes
const exampleRoutes = require('./routes/exampleRoutes');

// Endpoints
server.use('/api/example', exampleRoutes);

module.exports = server;
