const WebSocket = require('ws');
const host = '127.0.0.1';
const portNumber = 8080;
var os = require("os");
var hostname = os.hostname();

// สร้าง WebSocket Server
const wss = new WebSocket.Server({ port:portNumber }, () => {

    //console.clear();
    console.log('WebSocket server Name:' + hostname);

    //console.log('WebSocket server is running on ws://localhost:8080');
    console.log(`WebSocket server is running on ws://${host}:${portNumber}`);

});

// ฟังการเชื่อมต่อจากไคลเอ็นต์
wss.on('connection', (ws) => {
    console.log('Demo-Client Connected.');

    // รับข้อความจากไคลเอ็นต์
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // ตรวจสอบขอความเพื่อระบุเงื่อนไข
        if(message == 'What you name?'){
            ws.send(`My name is ${hostname}`);
        }
        else
        // ส่งข้อความตอบกลับไปยังไคลเอ็นต์
        ws.send(`Server received: ${message}`);
    });

    // เมื่อไคลเอ็นต์ปลดการเชื่อมต่อ
    ws.on('close', () => {
        console.log('Demo-Client Disconnected.');
    });
});