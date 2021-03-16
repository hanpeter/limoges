'use strict';

const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');
const PORT = process.env.PORT || 9001;

// Serve up static folder
let serve = serveStatic('static', { 'index': ['index.html'] });

// Create server
let server = http.createServer(function (req, res) {
  serve(req, res, finalhandler(req, res));
});

// Listen
server.listen(PORT);
