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
const wss = new WebSocket.Server({ noServer: true });

// ฟังการเชื่อมต่อจากไคลเอ็นต์
wss.on('connection', (ws) => {
    console.log(hostname + 'Demo-Client Connected.');

    // เมื่อไคลเอ็นต์ปลดการเชื่อมต่อ
    ws.on('close', () => {
        console.log(hostname + 'Demo-Client Disconnected.');
    });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

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

// -- Zone File Upload  --

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

// -- Zone List All File --

// Endpoint to list all files
app.get('/files', (req, res) => {
    const files = fs.readdirSync('./uploads');
    res.json(files);
});

// -- Zone Download File --
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});
// -- Zone Delete File --
app.delete('/delete/:filename', (req, res) => {
 const filePath = path.join(__dirname, 'uploads', req.params.filename);
 
 if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({success: true, message: 'File deleted successfully'});
 } else{
    res.status(404).json({success: false, message: 'File not found'});
 }
});                                                                                                                                    

// -- Zone Login --
const users = [
    { username: 'admin', password: 'password' }
];

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user (simulating a database lookup)
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.json({ success: false, message: 'Invalid username' });
        }

    // Compare the password (plain text comparison)
    if (user.password === password) {
        return res.json({ success: true, message: 'Login successful' });
    } else {
        return res.json({ success: false, message: 'Invalid password' });
    }});



  // Start the HTTp ser
  const server = app.listen(portNumber, () => {
    console.log(`Server running at http://localhost:${portNumber}`);
  });
  
  // Upgrade HTTP Server to WS Server
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws,request)
    })
  })