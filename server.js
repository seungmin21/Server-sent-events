// app.js

const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const app = express();
expressWs(app);

let wsClients = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.ws('/ws', (ws, req) => {
  console.log('WebSocket 연결이 열렸습니다.');

  wsClients.push(ws);

  ws.on('close', () => {
    console.log('WebSocket 연결이 닫혔습니다.');
    wsClients = wsClients.filter(client => client !== ws);
  });
});

const logFilePath = path.join(__dirname, 'log.json');
chokidar.watch(logFilePath).on('change', (event, path) => {
  console.log('log.json 파일이 변경되었습니다.');

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('log.json 파일을 읽는 도중 오류가 발생했습니다.');
      return;
    }

    // JSON을 객체로 파싱
    let jsonData = JSON.parse(data);

    // 특정 키의 값을 변경 (예: 배열의 첫 번째 요소)
    jsonData[0] = '';

    // 변경된 데이터를 문자열로 변환
    const updatedData = JSON.stringify(jsonData);

    // 변경된 데이터를 모든 클라이언트에게 전송
    wsClients.forEach(client => {
      if (client.readyState === 1) {
        client.send(updatedData);
      }
    });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
