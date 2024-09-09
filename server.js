const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { getIO, initIO } = require('./socket'); // Importing your socket functions

// Create Express app
const app = express();

// Serve static files (optional if you have a static directory)
app.use('/', express.static(path.join(__dirname, 'static')));

// Create HTTP server and integrate with Express
const httpServer = createServer(app);

// Initialize the custom Socket.IO setup with the HTTP server
initIO(httpServer);

// Listen on the appropriate port (defined by environment or default to 3500)
const port = process.env.PORT || 3500;
httpServer.listen(port, () => {
  console.log("Server started on port", port);
});

// Fetch and log the IO instance for confirmation
getIO();

// Define a basic route for the root path
app.get('/', (req, res) => {
  res.send('Signaling server is running.');
});
