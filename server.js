const express = require('express');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path')

const app = express();
const port = 3000;

app.use(express.static('public')); // 정적 파일 서비스를 위한 폴더 public 생성

// HTML 파일 보내기
app.get('/', (req, res) => {
  const pathData = path.join(__dirname, 'index.html')
    res.sendFile(pathData);
});

// JSON 파일 읽어서 HTML로 전송
app.get('/getData', (req, res) => {
    fs.readFile('log.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(JSON.parse(data));
    });
});

// Chokidar를 사용한 파일 변경 감지 및 업데이트
const watcher = chokidar.watch('log.json');
watcher.on('change', () => {
    console.log('log.json 파일이 변경되었습니다.');
    // 클라이언트에게 변경을 알림 (Socket.io 또는 기타 방법을 사용)
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
