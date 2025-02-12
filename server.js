const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 
const express = require('express');
const fs = require('fs');

const host = '127.0.0.1';
const portNumber = 8080;
var os = require("os");
var hostname = os.hostname();

const app = express();

// สร้าง WebSocket Server
const wss = new WebSocket.Server({ port:portNumber }, () => {

    //console.clear();
    console.log('WebSocket server Name:' + hostname);

    //console.log('WebSocket server is running on ws://localhost:8080');
    console.log(`WebSocket server is running on ws://${host}:${portNumber}`);

});

// ฟังการเชื่อมต่อจากไคลเอ็นต์
wss.on('connection', (ws) => {
    console.log(hostname + 'Demo-Client Connected.');

    // รับข้อความจากไคลเอ็นต์
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // ตรวจสอบข้อความเพื่อระบุเงื่อนไข
        if(message == 'What you name?'){
            ws.send(`My name is ${hostname}`);
        }
        else
        // ส่งข้อความตอบกลับไปยังไคลเอ็นต์
        ws.send(`Server received: ${message}`);
    });

    // เมื่อไคลเอ็นต์ปลดการเชื่อมต่อ
    ws.on('close', () => {
        console.log(hostname + 'Demo-Client Disconnected.');
    });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Function to generate the short timestamp
function getShortDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

// -- File Upload  --

// Define storage settings to keep original file name
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be uploaded
    },
    filename: function (req, file, cb) {
        // Generate the new file name with the timestamp and original file name
        const timestamp = getShortDate();
        const originalName = file.originalname;
        const fileExtension = path.extname(originalName); // Get the file extension
        const baseName = path.basename(originalName, fileExtension); // Get the file name without the extension
        
        // Construct the new file name as {date}-originalfilename.extension
        const newFileName = `${timestamp}-${baseName}${fileExtension}`;
        cb(null, newFileName); // Save the file with the new name
    }
});

// Setup for file upload
const upload = multer({ storage: storage });

// Endpoint to upload files
app.post('/upload', upload.single('file'), (req, res) => {
    console.log('File uploaded:', req.file);
    res.json({ message: 'File uploaded successfully', file: req.file });
});

// Endpoint to list all files
app.get('/files', (req, res) => {
    const files = fs.readdirSync('./uploads');
    res.json(files);
});