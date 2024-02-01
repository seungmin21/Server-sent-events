const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => {
  const readData = path.join(__dirname, 'index.html');
  res.sendFile(readData);
})

router.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type' : 'text/event-stream',
    'Cache-Control' : 'no-cache',
    'Connection' : 'keep-alive',
  });

  function sendSSEMessage(event, data) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, jsonData) => {
    if (err) {
      console.error("Error reading data.json:", err);
      res.end();
      return;
    }

    const data = JSON.parse(jsonData)

    sendSSEMessage('data', data);

    req.on('close', () => {
      res.end();
    });
  });
});

module.exports = router