const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => {
  const readData = path.join(__dirname, 'index.html');
  res.sendFile(readData);
})

module.exports = router